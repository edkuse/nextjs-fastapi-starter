from fastapi import APIRouter, Depends, HTTPException, Request, Response, Query
from fastapi.responses import RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession
import secrets
import logging
from typing import Optional
from datetime import datetime
from app.core.auth import (
    get_authorization_url, 
    exchange_code_for_token, 
    get_user_info, 
    get_or_create_user,
    create_access_token
)
from app.core.config import settings
from app.db.session import get_session
from app.models.user import User
from app.core.auth import get_current_user, MICROSOFT_GRAPH_ENDPOINT
import httpx

router = APIRouter()

# Set up logger
logger = logging.getLogger("app.auth")

# Store state for CSRF protection
state_store = {}

@router.get("/login")
async def login(request: Request, redirect_uri: Optional[str] = None):
    """
    Initiate Microsoft Entra ID login flow
    """
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "unknown")
    
    # Log login initiation
    logger.info(
        f"Login attempt initiated | IP: {client_ip} | "
        f"User-Agent: {user_agent} | "
        f"Timestamp: {datetime.utcnow().isoformat()}"
    )
    
    # Determine the callback URL
    callback_url = f"{settings.API_URL}/api/v1/auth/callback"
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    
    # Store state with original redirect URI if provided
    state_store[state] = redirect_uri or settings.FRONTEND_URL
    
    # Get Microsoft authorization URL
    auth_url, _ = get_authorization_url(callback_url, state)
    
    # Redirect to Microsoft login
    return RedirectResponse(auth_url)

@router.get("/callback")
async def callback(
    request: Request,
    code: str = Query(None),
    state: str = Query(None),
    error: str = Query(None),
    error_description: str = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """
    Handle callback from Microsoft Entra ID
    """
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "unknown")
    timestamp = datetime.utcnow().isoformat()
    
    # Check for errors from Azure AD
    if error:
        error_details = f"Error: {error} | Description: {error_description}"
        logger.error(
            f"Authentication failed | {error_details} | "
            f"IP: {client_ip} | User-Agent: {user_agent} | "
            f"Timestamp: {timestamp}"
        )
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error={error}&error_description={error_description}"
        )
    
    # Validate state for CSRF protection
    if not state or state not in state_store:
        logger.warning(
            f"Invalid state parameter detected | IP: {client_ip} | "
            f"User-Agent: {user_agent} | State: {state if state else 'None'} | "
            f"Timestamp: {timestamp} | Possible CSRF attempt"
        )
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error=invalid_state"
        )
    
    # Get the original redirect URI
    redirect_uri = state_store.pop(state)
    
    try:
        # Exchange code for token
        callback_url = f"{settings.API_URL}/api/v1/auth/callback"
        token_response = await exchange_code_for_token(code, callback_url)
        
        # Get user info from Microsoft Graph
        access_token = token_response.get("access_token")
        user_info = await get_user_info(access_token)
        
        # Get or create user in database
        user = await get_or_create_user(session, user_info)
        
        # Log successful authentication
        logger.info(
            f"Authentication successful | User: {user.email} | "
            f"IP: {client_ip} | User-Agent: {user_agent} | "
            f"Timestamp: {timestamp}"
        )
        
        # Create session token
        session_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )
        
        # Redirect to frontend with token as query parameter
        return RedirectResponse(
            f"{redirect_uri}?token={session_token}"
        )
        
    except HTTPException as e:
        # Log detailed authentication failure
        logger.error(
            f"Authentication process failed | Status: {e.status_code} | "
            f"Detail: {e.detail} | IP: {client_ip} | "
            f"User-Agent: {user_agent} | Timestamp: {timestamp}"
        )
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error=authentication_failed&error_description={e.detail}"
        )
    except Exception as e:
        # Log unexpected errors
        logger.error(
            f"Unexpected error during authentication | Error: {str(e)} | "
            f"Type: {type(e).__name__} | IP: {client_ip} | "
            f"User-Agent: {user_agent} | Timestamp: {timestamp}",
            exc_info=True
        )
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/login?error=server_error&error_description=An unexpected error occurred"
        )

@router.get("/logout")
async def logout(request: Request, response: Response, redirect_uri: Optional[str] = None):
    """
    Logout user by clearing session cookie
    """
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "unknown")
    
    # Log logout attempt
    logger.info(
        f"Logout initiated | IP: {client_ip} | "
        f"User-Agent: {user_agent} | "
        f"Timestamp: {datetime.utcnow().isoformat()}"
    )
    
    response = RedirectResponse(redirect_uri or settings.FRONTEND_URL)
    response.delete_cookie(key="session_token")
    return response

@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information
    """
    try:
        # Get user's profile picture URL from Microsoft Graph
        photo_url = f"{MICROSOFT_GRAPH_ENDPOINT}/users/{current_user.id}/photo/$value"
        
        # Check if photo exists by making a HEAD request
        async with httpx.AsyncClient() as client:
            response = await client.head(photo_url, headers={"Authorization": f"Bearer {current_user.access_token}"})
            if response.status_code == 404:
                photo_url = None
                
        return {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "role": current_user.role,
            "photoUrl": photo_url
        }
    except Exception as e:
        # If we can't get the photo URL, return user info without it
        return {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "role": current_user.role
        }

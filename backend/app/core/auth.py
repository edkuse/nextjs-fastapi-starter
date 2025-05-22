from fastapi import Depends, HTTPException, status, Response, Request, Cookie
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets
import requests
from urllib.parse import urlencode
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional

from app.core.config import settings
from app.db.session import get_session
from app.models.user import User

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

# Azure AD (Microsoft Entra ID) endpoints
AZURE_AUTHORITY = f"https://login.microsoftonline.com/{settings.AZURE_TENANT_ID}"
AZURE_AUTHORIZE_ENDPOINT = f"{AZURE_AUTHORITY}/oauth2/v2.0/authorize"
AZURE_TOKEN_ENDPOINT = f"{AZURE_AUTHORITY}/oauth2/v2.0/token"
MICROSOFT_GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0"

# JWT token creation for session management
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Generate the Azure authorization URL
def get_authorization_url(redirect_uri: str, state: str = None):
    if not state:
        state = secrets.token_urlsafe(32)
    
    params = {
        "client_id": settings.AZURE_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "response_mode": "query",
        "scope": "openid profile email User.Read",
        "state": state
    }
    
    return f"{AZURE_AUTHORIZE_ENDPOINT}?{urlencode(params)}", state

# Exchange authorization code for tokens
async def exchange_code_for_token(code: str, redirect_uri: str):
    data = {
        "client_id": settings.AZURE_CLIENT_ID,
        "client_secret": settings.AZURE_CLIENT_SECRET,
        "scope": "openid profile email User.Read",
        "code": code,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }
    
    response = requests.post(AZURE_TOKEN_ENDPOINT, data=data)
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return response.json()

# Get user info from Microsoft Graph
async def get_user_info(access_token: str):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{MICROSOFT_GRAPH_ENDPOINT}/me", headers=headers)
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not get user info",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return response.json()

# Get or create user in database
async def get_or_create_user(session: AsyncSession, user_info: dict):
    user_id = user_info.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user info",
        )
    
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        # Create new user
        user = User(
            id=user_id,
            email=user_info.get("mail") or user_info.get("userPrincipalName", ""),
            name=user_info.get("displayName", ""),
            role="user"
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    
    return user

# Verify JWT token
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Get current user from token
async def get_current_user(
    session: AsyncSession = Depends(get_session),
    token: str = Depends(oauth2_scheme)
):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = await verify_token(token)
    user_id = payload.get("sub")
    
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

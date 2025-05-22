from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
import requests

from app.deps import get_current_active_user, get_current_active_superuser, get_session
from app.models.user import User
from app.core.config import settings
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user.
    """
    return current_user

@router.get("/me/graph-profile")
async def get_user_graph_profile(
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get user's Microsoft Graph profile information.
    This demonstrates how the backend can proxy requests to Microsoft Graph.
    """
    try:
        # This would normally use a token from the session or get a new one
        # For a real implementation, you'd need to handle token acquisition/refresh
        
        # Example of how to call Microsoft Graph API from the backend
        # In a real implementation, you would:
        # 1. Get a token for Microsoft Graph (either from user session or via client credentials)
        # 2. Make the API call with proper error handling and retries
        # 3. Process and return the data
        
        return {
            "message": "This endpoint would fetch user profile data from Microsoft Graph",
            "user_id": current_user.id,
            "implementation_note": "In a real implementation, this would make an authenticated request to Microsoft Graph API"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Microsoft Graph data: {str(e)}")

@router.get("/{user_id}", response_model=User)
async def read_user_by_id(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_active_superuser),
):
    """
    Get a specific user by id.
    """
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user

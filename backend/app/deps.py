from fastapi import Depends, HTTPException, status, Cookie
from typing import Optional
from app.db.session import get_session
from app.core.auth import get_current_user
from app.models.user import User

# Get current active user
async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get the current active user.
    """
    return current_user

# Get current active superuser
async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get the current active superuser.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user

# Get token from cookie
async def get_token_from_cookie(
    session_token: Optional[str] = Cookie(None)
) -> Optional[str]:
    """
    Get token from cookie
    """
    return session_token

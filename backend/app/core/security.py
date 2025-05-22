from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
import requests

from app.core.config import settings

# Microsoft Entra ID JWKS URI
MICROSOFT_JWKS_URI = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/discovery/v2.0/keys"

async def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT token from Microsoft Entra ID.
    
    In a production environment, you would:
    1. Fetch the JWKS (JSON Web Key Set) from Microsoft
    2. Find the key that matches the token's 'kid' (Key ID)
    3. Verify the token signature using the public key
    4. Verify the token claims (issuer, audience, expiration)
    """
    try:
        # For this example, we'll use a simplified approach
        payload = jwt.decode(
            token,
            options={"verify_signature": False},  # In production, set this to True
            audience=settings.MICROSOFT_CLIENT_ID,
        )
        
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

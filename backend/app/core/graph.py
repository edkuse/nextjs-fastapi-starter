"""
Microsoft Graph API utilities for the backend.
This module handles all interactions with Microsoft Graph API.
"""

import requests
from fastapi import HTTPException, status
from typing import Dict, Any, Optional

from app.core.config import settings

# Microsoft Graph API endpoint
MICROSOFT_GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0"

async def get_graph_token() -> str:
    """
    Get an access token for Microsoft Graph API using client credentials flow.
    This is for application-level permissions, not user-delegated permissions.
    """
    token_url = f"https://login.microsoftonline.com/{settings.AZURE_TENANT_ID}/oauth2/v2.0/token"
    
    data = {
        "client_id": settings.AZURE_CLIENT_ID,
        "client_secret": settings.AZURE_CLIENT_SECRET,
        "scope": "https://graph.microsoft.com/.default",
        "grant_type": "client_credentials"
    }
    
    response = requests.post(token_url, data=data)
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get Microsoft Graph token"
        )
    
    token_data = response.json()
    return token_data["access_token"]

async def get_user_profile(user_id: str, access_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Get a user's profile from Microsoft Graph API.
    
    Args:
        user_id: The user's ID in Azure AD
        access_token: Optional access token. If not provided, a new one will be obtained.
    
    Returns:
        The user's profile data
    """
    if not access_token:
        access_token = await get_graph_token()
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{MICROSOFT_GRAPH_ENDPOINT}/users/{user_id}", headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile from Microsoft Graph: {response.text}"
        )
    
    return response.json()

async def get_user_photo(user_id: str, access_token: Optional[str] = None) -> bytes:
    """
    Get a user's profile photo from Microsoft Graph API.
    
    Args:
        user_id: The user's ID in Azure AD
        access_token: Optional access token. If not provided, a new one will be obtained.
    
    Returns:
        The user's profile photo as bytes
    """
    if not access_token:
        access_token = await get_graph_token()
    
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    
    response = requests.get(f"{MICROSOFT_GRAPH_ENDPOINT}/users/{user_id}/photo/$value", headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user photo from Microsoft Graph"
        )
    
    return response.content

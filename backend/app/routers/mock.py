from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta

from app.deps import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/stats")
async def get_mock_stats(
    current_user: User = Depends(get_current_active_user),
) -> Dict[str, Any]:
    """
    Get mock statistics.
    """
    return {
        "total_projects": 12,
        "active_projects": 5,
        "completed_projects": 7,
        "recent_activity": 8
    }

@router.get("/activities")
async def get_mock_activities(
    current_user: User = Depends(get_current_active_user),
) -> List[Dict[str, Any]]:
    """
    Get mock activities.
    """
    return [
        {
            "id": 1,
            "type": "project_created",
            "project_name": "Website Redesign",
            "timestamp": datetime.now() - timedelta(days=2)
        },
        {
            "id": 2,
            "type": "project_updated",
            "project_name": "Mobile App",
            "timestamp": datetime.now() - timedelta(days=1)
        },
        {
            "id": 3,
            "type": "comment_added",
            "project_name": "API Integration",
            "timestamp": datetime.now() - timedelta(hours=5)
        }
    ]

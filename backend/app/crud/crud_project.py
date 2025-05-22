from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    async def get_multi_by_owner(
        self, db: AsyncSession, *, owner_id: str, skip: int = 0, limit: int = 100
    ) -> List[Project]:
        """
        Get multiple projects by owner.
        """
        result = await db.execute(
            select(Project)
            .filter(Project.user_id == owner_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

project = CRUDProject(Project)

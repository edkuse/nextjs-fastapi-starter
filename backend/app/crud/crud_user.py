from typing import Any, Dict, Optional, Union
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """
        Get a user by email.
        """
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()
    
    async def get_or_create(
        self, db: AsyncSession, *, id: str, email: str, name: str
    ) -> User:
        """
        Get a user by ID or create a new one if it doesn't exist.
        """
        user = await self.get(db, id=id)
        if not user:
            user_in = UserCreate(
                id=id,
                email=email,
                name=name,
                role="user"
            )
            user = await self.create(db, obj_in=user_in)
        return user

user = CRUDUser(User)

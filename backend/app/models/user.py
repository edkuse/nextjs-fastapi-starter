from typing import List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from .project import Project


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    role: str = Field(default="user")
    created_at: datetime = Field(default_factory=datetime.now)
    
    # Relationships
    projects: List["Project"] = Relationship(back_populates="owner", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

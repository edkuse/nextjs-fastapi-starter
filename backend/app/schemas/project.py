from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Shared properties
class ProjectBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

# Properties to receive via API on creation
class ProjectCreate(ProjectBase):
    name: str
    description: Optional[str] = None
    status: str = "active"

# Properties to receive via API on update
class ProjectUpdate(ProjectBase):
    pass

# Properties shared by models stored in DB
class ProjectInDBBase(ProjectBase):
    id: int
    name: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    user_id: str
    
    class Config:
        from_attributes = True

# Additional properties to return via API
class Project(ProjectInDBBase):
    pass

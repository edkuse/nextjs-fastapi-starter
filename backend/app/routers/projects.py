from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.deps import get_current_active_user, get_session
from app.models.user import User
from app.models.project import Project, ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter()


@router.get("/", response_model=List[ProjectRead])
async def read_projects(
    session: AsyncSession = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    user_id: Optional[str] = Query(None, description="Filter projects by user ID"),
) -> Any:
    """
    Retrieve projects. If user_id is provided, returns projects for that specific user.
    Otherwise, returns all projects.
    """
    query = select(Project)
    
    # If user_id is provided, filter by that user
    if user_id:
        query = query.where(Project.user_id == user_id)
    
    # Add pagination
    query = query.offset(skip).limit(limit)
    
    result = await session.execute(query)
    projects = result.scalars().all()
    return projects


@router.post("/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    *,
    session: AsyncSession = Depends(get_session),
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new project.
    """
    project_data = project_in.model_dump()
    project_data["user_id"] = current_user.id
    project = Project.model_validate(project_data)
    
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    return project


@router.get("/{id}", response_model=ProjectRead)
async def read_project(
    *,
    session: AsyncSession = Depends(get_session),
    id: int
) -> Any:
    """
    Get project by ID.
    """
    result = await session.execute(
        select(Project).where(Project.id == id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.patch("/{id}", response_model=ProjectRead)
async def update_project(
    *,
    session: AsyncSession = Depends(get_session),
    id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a project. Only the project owner can update it.
    """
    result = await session.execute(
        select(Project).where(Project.id == id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update project attributes
    project_data = project_in.dict(exclude_unset=True)
    for key, value in project_data.items():
        setattr(project, key, value)
    
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    return project


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    *,
    session: AsyncSession = Depends(get_session),
    id: int,
    current_user: User = Depends(get_current_active_user),
) -> None:
    """
    Delete a project. Only the project owner can delete it.
    """
    result = await session.execute(
        select(Project).where(Project.id == id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if the current user is the project owner
    if project.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to delete this project"
        )
    
    await session.delete(project)
    await session.commit()

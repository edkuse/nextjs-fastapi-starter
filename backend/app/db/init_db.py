import logging
import os
import subprocess
from pathlib import Path
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from app.db.session import get_session
from app.core.config import settings
from app.models.user import User

logger = logging.getLogger(__name__)

async def create_first_superuser() -> None:
    """
    Create a superuser if it doesn't exist
    """
    try:
        # Get a session
        session_generator = get_session()
        session = await session_generator.__anext__()
        
        # Check if superuser exists
        result = await session.execute(
            select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Create superuser
            user = User(
                id="admin",
                email=settings.FIRST_SUPERUSER_EMAIL,
                name=settings.FIRST_SUPERUSER_NAME,
                role="admin"
            )
            session.add(user)
            await session.commit()
            logger.info(f"Superuser created: {user.email}")
        else:
            logger.info(f"Superuser already exists: {user.email}")
            
    except Exception as e:
        logger.error(f"Error creating superuser: {e}")

def run_sql_scripts():
    """
    Run SQL scripts to initialize the database
    """
    try:
        # Get the database URL
        db_url = str(settings.DATABASE_URI)
        
        # Get the path to the SQL scripts
        sql_dir = Path(__file__).parent.parent.parent / "sql"
        script_path = sql_dir / "run_sql_scripts.sh"
        
        # Make the script executable
        os.chmod(script_path, 0o755)
        
        # Run the script
        result = subprocess.run(
            [script_path, db_url],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            logger.info("SQL scripts executed successfully")
            logger.debug(result.stdout)
        else:
            logger.error(f"Error executing SQL scripts: {result.stderr}")
            
    except Exception as e:
        logger.error(f"Error running SQL scripts: {e}")

def create_db_tables():
    """
    Create database tables directly from SQLModel metadata
    This is an alternative to using SQL scripts or migrations
    """
    try:
        from sqlmodel import SQLModel
        from app.db.session import engine
        import asyncio
        
        # Import all models to ensure they're registered with SQLModel
        from app.models.user import User
        from app.models.project import Project
        
        async def create_tables():
            # Create tables asynchronously
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
            
            logger.info("Database tables created successfully")
        
        # Run the async function
        asyncio.run(create_tables())
        
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

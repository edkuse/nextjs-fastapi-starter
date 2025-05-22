"""
Startup script for Azure App Service.
This file is used by Azure App Service to start the application.
"""
import os
import sys
import logging

# Add the current directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Import the FastAPI app
from app.main import app

# This is used by Azure App Service to start the application
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting application on port {port}")
    uvicorn.run("startup:app", host="0.0.0.0", port=port)

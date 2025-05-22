# FastAPI Backend with SQLModel

This is the backend for the FullStack application, built with FastAPI, SQLModel, and PostgreSQL.

## Project Structure

\`\`\`
backend/
├── app/                    # Application package
│   ├── routers/            # API endpoint routers
│   ├── core/               # Core functionality
│   │   ├── config.py       # Configuration
│   │   └── security.py     # Security utilities
│   ├── db/                 # Database setup
│   ├── models/             # SQLModel models
│   ├── deps.py             # Dependency functions
│   └── main.py             # FastAPI application (entry point)
├── sql/                    # SQL scripts for database initialization
│   ├── 00_schema.sql       # Schema creation
│   ├── 01_users.sql        # Users table
│   └── ...                 # Other SQL files
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker configuration
├── README.md               # This file
└── requirements.txt        # Python dependencies
\`\`\`

## Setup

### Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit the `.env` file with your configuration.

### Running with Docker

\`\`\`bash
docker-compose up -d
\`\`\`

### Running without Docker

1. Install dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the application:

\`\`\`bash
uvicorn app.main:app --reload
\`\`\`

## Database Management

This project uses two approaches for database management:

### 1. SQLModel Metadata

By default, the application creates database tables directly from SQLModel metadata during startup. This is simple and works well for development.

### 2. SQL Scripts

Alternatively, you can use the SQL scripts in the `sql/` directory for more control over the database schema:

\`\`\`bash
# Run all SQL scripts in order
./sql/run_sql_scripts.sh postgresql://postgres:postgres@localhost:5432/fullstack_db
\`\`\`

To switch between these approaches, modify the `startup_event()` function in `app/main.py`.

## API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Features

- **SQLModel Integration**: Uses SQLModel to combine SQLAlchemy and Pydantic
- **Async Support**: Fully async API with SQLModel's async features
- **Azure AD Authentication**: Secure authentication with Azure AD
- **Modular Structure**: Organized by feature for easy maintenance
- **API Versioning**: Supports multiple API versions

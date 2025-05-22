# Next.js and FastAPI Full-Stack Starter

A modern full-stack application with Next.js frontend, FastAPI backend, Azure AD (Microsoft Entra ID) authentication, and PostgreSQL database.

## Project Overview

This starter project provides a complete foundation for building full-stack applications with:

- **Frontend**: Next.js with App Router and Server Components
- **Backend**: FastAPI with SQLModel ORM
- **Authentication**: Azure AD (Microsoft Entra ID)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with radix/ui components

## Project Structure

\`\`\`
├── app/                      # Next.js frontend
│   ├── page.tsx              # Home page
│   ├── login/                # Login page
│   └── dashboard/            # Dashboard page
├── lib/                      # Frontend utilities
│   ├── auth.ts               # Authentication utilities
│   └── api.ts                # API client
├── backend/                  # FastAPI backend
│   ├── app/                  # Backend application code
│   │   ├── routers/          # API endpoints
│   │   ├── models/           # SQLModel models
│   │   ├── core/             # Core configurations
│   │   └── main.py           # Main app entry point
│   ├── sql/                  # SQL database definitions
│   │   ├── 00_schema.sql     # Database schema
│   │   ├── 01_users.sql      # Users table
│   │   └── ...               # Other SQL files
│   └── requirements.txt      # Python dependencies
└── next.config.mjs           # Next.js configuration
\`\`\`

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- PostgreSQL database (or Docker for local development)
- Azure AD account (Microsoft Entra ID)

## Setup and Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/edkuse/nextjs-fastapi-starter.git
cd nextjs-fastapi-starter
\`\`\`

### 2. Set up the frontend

\`\`\`bash
# Install pnpm if you don't have it already
npm install -g pnpm

# Install dependencies
pnpm install

# Create a .env.local file
cp .env.example .env.local

# Edit the .env.local file with your environment variables
# NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### 3. Set up the backend

\`\`\`bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file
cp .env.example .env

# Edit the .env file with your configuration
# POSTGRES_SERVER=localhost
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=postgres
# POSTGRES_DB=fullstack_db
# AZURE_TENANT_ID=...
# AZURE_CLIENT_ID=...
# AZURE_CLIENT_SECRET=...
\`\`\`

### 4. Set up the database

You can either use Docker to run PostgreSQL:

\`\`\`bash
# From the backend directory
docker-compose up -d db
\`\`\`

Or connect to an existing PostgreSQL database by updating the `.env` file.

### 5. Run the applications

#### Start the backend

\`\`\`bash
# From the backend directory, with virtual environment activated
uvicorn app.main:app --reload
\`\`\`

#### Start the frontend

\`\`\`bash
# From the project root directory
pnpm dev
\`\`\`

## Database Management

This project uses two approaches for database management:

### 1. SQLModel Metadata

By default, the application creates database tables directly from SQLModel metadata during startup. This is simple and works well for development.

### 2. SQL Scripts

Alternatively, you can use the SQL scripts in the `backend/sql/` directory for more control over the database schema:

\`\`\`bash
# Run all SQL scripts in order
./backend/sql/run_sql_scripts.sh postgresql://postgres:postgres@localhost:5432/fullstack_db
\`\`\`

To switch between these approaches, modify the `startup_event()` function in `backend/app/main.py`.

## Azure AD Setup

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to "Microsoft Entra ID" > "App registrations"
3. Click "New registration"
4. Enter a name for your application
5. Set the redirect URI to your backend callback URL (e.g., `http://localhost:8000/api/v1/auth/callback`)
6. Select "Web" as the application type
7. Click "Register"
8. Go to "Certificates & secrets" and create a new client secret
9. Copy the Application (client) ID, Directory (tenant) ID, and Client Secret to your environment variables

## Project Features

### Frontend Features

- Modern Next.js 13+ with App Router
- Azure AD authentication via backend
- Responsive UI with Tailwind CSS and shadcn/ui
- API client for communicating with the backend
- Dashboard with projects and user information

### Backend Features

- FastAPI with async support
- SQLModel for database operations
- Azure AD token validation
- PostgreSQL database with comprehensive schema
- API endpoints with proper validation and error handling

## API Documentation

Once the backend is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Frontend Deployment (Vercel)

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure your environment variables in the Vercel dashboard
4. Deploy your application

### Backend Deployment

You can deploy your FastAPI backend to various platforms:

- **Heroku**: Use the Procfile and requirements.txt
- **Railway**: Connect your GitHub repository
- **AWS/GCP/Azure**: Deploy using Docker containers
- **Digital Ocean**: Use App Platform or Droplets

Make sure to update your `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend.

## Docker Deployment

For containerized deployment, use the provided Dockerfiles:

\`\`\`bash
# Build and run the frontend
docker build -t frontend .
docker run -p 3000:3000 frontend

# Build and run the backend
cd backend
docker build -t backend .
docker run -p 8000:8000 backend

# Or use docker-compose for the full stack
docker-compose up
\`\`\`

# Docker Deployment Guide

This document provides instructions for deploying the application using Docker containers to Azure App Services.

## Prerequisites

1. Azure subscription
2. Azure Container Registry (ACR)
3. Azure App Service plans for both frontend and backend
4. Azure Database for PostgreSQL
5. Docker installed locally for testing

## Local Development with Docker

### Building and Running Locally

1. Clone the repository
2. Create a `.env` file in the root directory with the required environment variables
3. Run the application using Docker Compose:

\`\`\`bash
docker-compose up --build
\`\`\`

This will start:
- The Next.js frontend at http://localhost:3000
- The FastAPI backend at http://localhost:8000
- A PostgreSQL database

## Setting Up Azure Resources

### 1. Create Azure Container Registry

\`\`\`bash
az acr create --name yourregistry --resource-group your-resource-group --sku Basic --admin-enabled true
\`\`\`

### 2. Create Azure App Services for Containers

#### Frontend App Service
\`\`\`bash
az appservice plan create --name frontend-plan --resource-group your-resource-group --sku B1 --is-linux
az webapp create --name your-frontend-app --resource-group your-resource-group --plan frontend-plan --deployment-container-image-name yourregistry.azurecr.io/frontend:latest
\`\`\`

#### Backend App Service
\`\`\`bash
az appservice plan create --name backend-plan --resource-group your-resource-group --sku B1 --is-linux
az webapp create --name your-backend-app --resource-group your-resource-group --plan backend-plan --deployment-container-image-name yourregistry.azurecr.io/backend:latest
\`\`\`

### 3. Configure App Settings

#### Frontend App Settings
\`\`\`bash
az webapp config appsettings set --name your-frontend-app --resource-group your-resource-group --settings NEXT_PUBLIC_API_URL=https://your-backend-app.azurewebsites.net WEBSITES_PORT=3000
\`\`\`

#### Backend App Settings
\`\`\`bash
az webapp config appsettings set --name your-backend-app --resource-group your-resource-group --settings \
  POSTGRES_SERVER=your-postgres-server.postgres.database.azure.com \
  POSTGRES_USER=your-postgres-user \
  POSTGRES_PASSWORD=your-postgres-password \
  POSTGRES_DB=your-postgres-db \
  AZURE_TENANT_ID=your-tenant-id \
  AZURE_CLIENT_ID=your-client-id \
  AZURE_CLIENT_SECRET=your-client-secret \
  API_URL=https://your-backend-app.azurewebsites.net \
  FRONTEND_URL=https://your-frontend-app.azurewebsites.net \
  COOKIE_SECURE=True \
  SECRET_KEY=your-secret-key \
  BACKEND_CORS_ORIGINS='["https://your-frontend-app.azurewebsites.net"]' \
  WEBSITES_PORT=8000
\`\`\`

### 4. Configure Container Registry Authentication

\`\`\`bash
# Get the credentials for your container registry
ACR_USERNAME=$(az acr credential show --name yourregistry --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name yourregistry --query "passwords[0].value" --output tsv)

# Configure the frontend app to use the container registry
az webapp config container set --name your-frontend-app --resource-group your-resource-group \
  --docker-custom-image-name yourregistry.azurecr.io/frontend:latest \
  --docker-registry-server-url https://yourregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Configure the backend app to use the container registry
az webapp config container set --name your-backend-app --resource-group your-resource-group \
  --docker-custom-image-name yourregistry.azurecr.io/backend:latest \
  --docker-registry-server-url https://yourregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
\`\`\`

## GitHub Actions Deployment

### Setting Up Secrets

Add the following secrets to your GitHub repository:

#### Container Registry Secrets
- `AZURE_CONTAINER_REGISTRY`: Name of your Azure Container Registry with domain (e.g., yourregistry.azurecr.io)
- `AZURE_REGISTRY_USERNAME`: Username for your Azure Container Registry
- `AZURE_REGISTRY_PASSWORD`: Password for your Azure Container Registry

#### Frontend Secrets
- `AZURE_FRONTEND_APP_NAME`: Name of your frontend Azure App Service
- `AZURE_FRONTEND_PUBLISH_PROFILE`: Publish profile for frontend App Service
- `NEXT_PUBLIC_API_URL`: URL of your backend API

#### Backend Secrets
- `AZURE_BACKEND_APP_NAME`: Name of your backend Azure App Service
- `AZURE_BACKEND_PUBLISH_PROFILE`: Publish profile for backend App Service

### Getting Publish Profiles

1. Go to your App Service in the Azure Portal
2. Click on "Get publish profile" and download the file
3. Copy the contents of the file to your GitHub secret

## Azure DevOps Deployment

### Setting Up Variables

Create a variable group in your Azure DevOps project with the following variables:

#### Container Registry Variables
- `AZURE_CONTAINER_REGISTRY`: Name of your Azure Container Registry with domain

#### Frontend Variables
- `AZURE_FRONTEND_APP_NAME`: Name of your frontend Azure App Service
- `AZURE_FRONTEND_SERVICE_CONNECTION`: Name of the service connection for frontend
- `NEXT_PUBLIC_API_URL`: URL of your backend API

#### Backend Variables
- `AZURE_BACKEND_APP_NAME`: Name of your backend Azure App Service
- `AZURE_BACKEND_SERVICE_CONNECTION`: Name of the service connection for backend
- `POSTGRES_SERVER`: PostgreSQL server hostname
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password (mark as secret)
- `POSTGRES_DB`: PostgreSQL database name
- `AZURE_TENANT_ID`: Azure AD tenant ID
- `AZURE_CLIENT_ID`: Azure AD client ID
- `AZURE_CLIENT_SECRET`: Azure AD client secret (mark as secret)
- `API_URL`: URL of your backend API
- `FRONTEND_URL`: URL of your frontend application
- `SECRET_KEY`: Secret key for JWT encoding (mark as secret)
- `BACKEND_CORS_ORIGINS`: JSON array of allowed origins
- `ENVIRONMENT`: Environment name (dev, staging, production)

### Creating Service Connections

1. Go to Project Settings > Service connections
2. Create a new Docker Registry service connection for your Azure Container Registry
3. Create new Azure Resource Manager service connections for your frontend and backend App Services

## Docker Image Optimization

### Frontend Image Optimization

1. Use multi-stage builds to reduce image size
2. Only copy necessary files to the final image
3. Use a non-root user for security
4. Set proper environment variables

### Backend Image Optimization

1. Use a slim base image to reduce size
2. Only install necessary system dependencies
3. Use a non-root user for security
4. Set proper environment variables

## Troubleshooting

### Common Issues

1. **Container fails to start**
   - Check the container logs in Azure App Service
   - Verify environment variables are correctly set
   - Check if the port configuration is correct

2. **Frontend cannot connect to backend**
   - Verify CORS settings in the backend
   - Check if the API URL is correctly set in the frontend

3. **Authentication issues**
   - Verify Azure AD settings
   - Check redirect URIs in Azure AD app registration
   - Ensure all required environment variables are set

### Viewing Container Logs

#### Frontend Logs
\`\`\`bash
az webapp log tail --name your-frontend-app --resource-group your-resource-group
\`\`\`

#### Backend Logs
\`\`\`bash
az webapp log tail --name your-backend-app --resource-group your-resource-group
\`\`\`

## Additional Resources

- [Azure App Service for Containers Documentation](https://docs.microsoft.com/en-us/azure/app-service/configure-custom-container)
- [Azure Container Registry Documentation](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)

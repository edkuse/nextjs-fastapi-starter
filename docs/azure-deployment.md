# Azure App Service Deployment Guide

This document provides instructions for deploying the application to Azure App Services using GitHub Actions or Azure DevOps Pipelines.

## Prerequisites

1. Azure subscription
2. Azure App Service plans for both frontend and backend
3. Azure Database for PostgreSQL
4. Azure App registrations for authentication

## Setting Up Azure Resources

### 1. Create Azure App Services

#### Frontend App Service
\`\`\`bash
az appservice plan create --name frontend-plan --resource-group your-resource-group --sku B1
az webapp create --name your-frontend-app --resource-group your-resource-group --plan frontend-plan --runtime "NODE:18-lts"
\`\`\`

#### Backend App Service
\`\`\`bash
az appservice plan create --name backend-plan --resource-group your-resource-group --sku B1
az webapp create --name your-backend-app --resource-group your-resource-group --plan backend-plan --runtime "PYTHON:3.11"
\`\`\`

### 2. Configure App Settings

#### Frontend App Settings
\`\`\`bash
az webapp config appsettings set --name your-frontend-app --resource-group your-resource-group --settings NEXT_PUBLIC_API_URL=https://your-backend-app.azurewebsites.net NODE_ENV=production
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
  BACKEND_CORS_ORIGINS='["https://your-frontend-app.azurewebsites.net"]'
\`\`\`

## GitHub Actions Deployment

### Setting Up Secrets

Add the following secrets to your GitHub repository:

#### Frontend Secrets
- `AZURE_FRONTEND_APP_NAME`: Name of your frontend Azure App Service
- `AZURE_FRONTEND_PUBLISH_PROFILE`: Publish profile for frontend App Service
- `NEXT_PUBLIC_API_URL`: URL of your backend API

#### Backend Secrets
- `AZURE_BACKEND_APP_NAME`: Name of your backend Azure App Service
- `AZURE_BACKEND_PUBLISH_PROFILE`: Publish profile for backend App Service
- `POSTGRES_SERVER`: PostgreSQL server hostname
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: PostgreSQL database name
- `AZURE_TENANT_ID`: Azure AD tenant ID
- `AZURE_CLIENT_ID`: Azure AD client ID
- `AZURE_CLIENT_SECRET`: Azure AD client secret
- `API_URL`: URL of your backend API
- `FRONTEND_URL`: URL of your frontend application
- `SECRET_KEY`: Secret key for JWT encoding
- `BACKEND_CORS_ORIGINS`: JSON array of allowed origins

### Getting Publish Profiles

1. Go to your App Service in the Azure Portal
2. Click on "Get publish profile" and download the file
3. Copy the contents of the file to your GitHub secret

## Azure DevOps Deployment

### Setting Up Variables

Create a variable group in your Azure DevOps project with the following variables:

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
2. Create a new Azure Resource Manager service connection
3. Select your subscription and resource group
4. Name the connection according to your variable (e.g., `AZURE_FRONTEND_SERVICE_CONNECTION`)
5. Repeat for the backend service connection

## Troubleshooting

### Common Issues

1. **Deployment fails with "Could not find a part of the path"**
   - Ensure your build artifacts are correctly configured

2. **Backend fails to start**
   - Check the logs in Azure App Service
   - Verify environment variables are correctly set
   - Check if the startup command is correct

3. **Frontend cannot connect to backend**
   - Verify CORS settings in the backend
   - Check if the API URL is correctly set in the frontend

4. **Authentication issues**
   - Verify Azure AD settings
   - Check redirect URIs in Azure AD app registration
   - Ensure all required environment variables are set

### Viewing Logs

#### Frontend Logs
\`\`\`bash
az webapp log tail --name your-frontend-app --resource-group your-resource-group
\`\`\`

#### Backend Logs
\`\`\`bash
az webapp log tail --name your-backend-app --resource-group your-resource-group
\`\`\`

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)

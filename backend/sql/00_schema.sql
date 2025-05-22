-- Create schema and extensions
CREATE SCHEMA IF NOT EXISTS public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for better password hashing if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Comment on schema
COMMENT ON SCHEMA public IS 'Standard public schema for FullStack application';

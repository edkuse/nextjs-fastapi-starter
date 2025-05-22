#!/bin/bash

# Script to run all SQL scripts in order
# Usage: ./run_sql_scripts.sh <database_url>

# Check if database URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./run_sql_scripts.sh <database_url>"
    echo "Example: ./run_sql_scripts.sh postgresql://postgres:postgres@localhost:5432/fullstack_db"
    exit 1
fi

DB_URL=$1
SQL_DIR="$(dirname "$0")"

# Function to run a SQL script
run_script() {
    echo "Running $1..."
    psql "$DB_URL" -f "$SQL_DIR/$1"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully executed $1"
    else
        echo "❌ Error executing $1"
        exit 1
    fi
}

# Run scripts in order
run_script "00_schema.sql"
run_script "01_users.sql"
run_script "02_projects.sql"
run_script "03_tasks.sql"
run_script "04_comments.sql"
run_script "05_activity_log.sql"
run_script "06_views.sql"
run_script "07_functions.sql"
run_script "08_init_data.sql"

echo "All SQL scripts executed successfully!"

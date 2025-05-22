-- Function to get all tasks for a user (both owned and assigned)
CREATE OR REPLACE FUNCTION get_user_tasks(user_id_param VARCHAR)
RETURNS TABLE (
    task_id INTEGER,
    task_title VARCHAR,
    task_description TEXT,
    task_status VARCHAR,
    task_priority VARCHAR,
    task_due_date TIMESTAMP WITH TIME ZONE,
    project_id INTEGER,
    project_name VARCHAR,
    is_owner BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id AS task_id,
        t.title AS task_title,
        t.description AS task_description,
        t.status AS task_status,
        t.priority AS task_priority,
        t.due_date AS task_due_date,
        p.id AS project_id,
        p.name AS project_name,
        CASE WHEN p.user_id = user_id_param THEN TRUE ELSE FALSE END AS is_owner
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE 
        p.user_id = user_id_param OR t.assigned_to = user_id_param
    ORDER BY 
        t.due_date ASC NULLS LAST, t.priority DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_tasks IS 'Function to get all tasks for a user (both owned and assigned)';

-- Function to get project statistics
CREATE OR REPLACE FUNCTION get_project_statistics(project_id_param INTEGER)
RETURNS TABLE (
    total_tasks INTEGER,
    pending_tasks INTEGER,
    in_progress_tasks INTEGER,
    completed_tasks INTEGER,
    overdue_tasks INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(id) AS total_tasks,
        COUNT(id) FILTER (WHERE status = 'pending') AS pending_tasks,
        COUNT(id) FILTER (WHERE status = 'in_progress') AS in_progress_tasks,
        COUNT(id) FILTER (WHERE status = 'completed') AS completed_tasks,
        COUNT(id) FILTER (WHERE status != 'completed' AND due_date < CURRENT_TIMESTAMP) AS overdue_tasks,
        CASE 
            WHEN COUNT(id) = 0 THEN 0
            ELSE ROUND((COUNT(id) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(id)) * 100, 2)
        END AS completion_percentage
    FROM tasks
    WHERE 
        project_id = project_id_param;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_project_statistics IS 'Function to get statistics for a specific project';

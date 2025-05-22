-- User projects view
CREATE OR REPLACE VIEW user_projects_view AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    p.id AS project_id,
    p.name AS project_name,
    p.description AS project_description,
    p.status AS project_status,
    p.created_at AS project_created_at,
    p.updated_at AS project_updated_at,
    COUNT(t.id) AS task_count,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks
FROM 
    users u
LEFT JOIN 
    projects p ON u.id = p.user_id
LEFT JOIN 
    tasks t ON p.id = t.project_id
GROUP BY 
    u.id, u.name, u.email, p.id, p.name, p.description, p.status, p.created_at, p.updated_at;

COMMENT ON VIEW user_projects_view IS 'View showing users with their projects and task statistics';

-- Project tasks view
CREATE OR REPLACE VIEW project_tasks_view AS
SELECT 
    p.id AS project_id,
    p.name AS project_name,
    p.user_id AS owner_id,
    u.name AS owner_name,
    t.id AS task_id,
    t.title AS task_title,
    t.status AS task_status,
    t.priority AS task_priority,
    t.due_date AS task_due_date,
    t.assigned_to AS assigned_user_id,
    au.name AS assigned_user_name
FROM 
    projects p
JOIN 
    users u ON p.user_id = u.id
LEFT JOIN 
    tasks t ON p.id = t.project_id
LEFT JOIN 
    users au ON t.assigned_to = au.id;

COMMENT ON VIEW project_tasks_view IS 'View showing projects with their tasks and assigned users';

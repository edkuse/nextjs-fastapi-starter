-- Insert admin user
INSERT INTO users (id, email, name, role)
VALUES ('admin', 'admin@example.com', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects for admin
INSERT INTO projects (name, description, status, user_id)
VALUES 
    ('Sample Project 1', 'This is a sample project for demonstration', 'active', 'admin'),
    ('Sample Project 2', 'Another sample project with different status', 'completed', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample tasks (if task table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tasks') THEN
        INSERT INTO tasks (title, description, status, priority, project_id, assigned_to)
        VALUES 
            ('Task 1', 'Sample task description', 'pending', 'high', 
             (SELECT id FROM projects WHERE name = 'Sample Project 1' LIMIT 1), 'admin'),
            ('Task 2', 'Another task description', 'in_progress', 'medium', 
             (SELECT id FROM projects WHERE name = 'Sample Project 1' LIMIT 1), 'admin'),
            ('Task 3', 'Completed task', 'completed', 'low', 
             (SELECT id FROM projects WHERE name = 'Sample Project 1' LIMIT 1), 'admin')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

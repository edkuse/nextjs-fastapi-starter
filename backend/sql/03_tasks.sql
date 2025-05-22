-- Tasks table (for future implementation)
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    project_id INTEGER NOT NULL,
    assigned_to VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_task_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_task_due_date ON tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_task_project_id ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_task_assigned_to ON tasks (assigned_to);

-- Comments
COMMENT ON TABLE tasks IS 'Project tasks';
COMMENT ON COLUMN tasks.id IS 'Unique task identifier';
COMMENT ON COLUMN tasks.title IS 'Task title';
COMMENT ON COLUMN tasks.description IS 'Task description';
COMMENT ON COLUMN tasks.status IS 'Task status (pending, in_progress, completed, cancelled)';
COMMENT ON COLUMN tasks.priority IS 'Task priority (low, medium, high, urgent)';
COMMENT ON COLUMN tasks.due_date IS 'Task due date';
COMMENT ON COLUMN tasks.created_at IS 'Timestamp when the task was created';
COMMENT ON COLUMN tasks.updated_at IS 'Timestamp when the task was last updated';
COMMENT ON COLUMN tasks.project_id IS 'Reference to the project this task belongs to';
COMMENT ON COLUMN tasks.assigned_to IS 'Reference to the user this task is assigned to';

-- Update trigger for updated_at
CREATE TRIGGER update_task_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

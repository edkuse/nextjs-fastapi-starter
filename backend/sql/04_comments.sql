-- Comments table (for future implementation)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    task_id INTEGER,
    project_id INTEGER,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT check_comment_target CHECK (
        (task_id IS NOT NULL AND project_id IS NULL) OR
        (task_id IS NULL AND project_id IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comment_task_id ON comments (task_id);
CREATE INDEX IF NOT EXISTS idx_comment_project_id ON comments (project_id);
CREATE INDEX IF NOT EXISTS idx_comment_user_id ON comments (user_id);

-- Comments
COMMENT ON TABLE comments IS 'Comments on tasks or projects';
COMMENT ON COLUMN comments.id IS 'Unique comment identifier';
COMMENT ON COLUMN comments.content IS 'Comment content';
COMMENT ON COLUMN comments.created_at IS 'Timestamp when the comment was created';
COMMENT ON COLUMN comments.updated_at IS 'Timestamp when the comment was last updated';
COMMENT ON COLUMN comments.task_id IS 'Reference to the task this comment belongs to (if applicable)';
COMMENT ON COLUMN comments.project_id IS 'Reference to the project this comment belongs to (if applicable)';
COMMENT ON COLUMN comments.user_id IS 'Reference to the user who created this comment';
COMMENT ON CONSTRAINT check_comment_target ON comments IS 'Ensures a comment is associated with either a task or a project, but not both';

-- Update trigger for updated_at
CREATE TRIGGER update_comment_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

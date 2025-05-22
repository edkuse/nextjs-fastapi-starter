-- Activity log table (for future implementation)
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log (action);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log (entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_id ON activity_log (entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log (created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_details ON activity_log USING GIN (details);

-- Comments
COMMENT ON TABLE activity_log IS 'Log of user activities';
COMMENT ON COLUMN activity_log.id IS 'Unique activity log identifier';
COMMENT ON COLUMN activity_log.action IS 'Action performed (create, update, delete, etc.)';
COMMENT ON COLUMN activity_log.entity_type IS 'Type of entity affected (project, task, etc.)';
COMMENT ON COLUMN activity_log.entity_id IS 'ID of the entity affected';
COMMENT ON COLUMN activity_log.details IS 'Additional details about the activity (JSON format)';
COMMENT ON COLUMN activity_log.created_at IS 'Timestamp when the activity occurred';
COMMENT ON COLUMN activity_log.user_id IS 'Reference to the user who performed the activity';

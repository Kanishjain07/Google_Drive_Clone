-- SQL script to add trash functionality columns to existing Supabase tables
-- Run these commands in your Supabase SQL editor to enable full trash functionality

-- Add trash columns to files table
ALTER TABLE files 
ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add trash columns to folders table
ALTER TABLE folders 
ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance on trash queries
CREATE INDEX IF NOT EXISTS idx_files_is_trashed ON files(is_trashed);
CREATE INDEX IF NOT EXISTS idx_folders_is_trashed ON folders(is_trashed);
CREATE INDEX IF NOT EXISTS idx_files_owner_trashed ON files(owner_id, is_trashed);
CREATE INDEX IF NOT EXISTS idx_folders_owner_trashed ON folders(owner_id, is_trashed);

-- Update existing records to set is_trashed = false if null
UPDATE files SET is_trashed = FALSE WHERE is_trashed IS NULL;
UPDATE folders SET is_trashed = FALSE WHERE is_trashed IS NULL;
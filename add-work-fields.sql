-- Add missing fields to `work` table to make it compatible with `projects`
ALTER TABLE work
ADD COLUMN IF NOT EXISTS live_url TEXT,
ADD COLUMN IF NOT EXISTS repo_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

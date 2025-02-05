/*
  # Enable realtime for SEO tasks

  1. Changes
    - Enable REPLICA IDENTITY FULL for seo_tasks table to track all column changes
    - Add publication for realtime functionality
  
  2. Security
    - Publication only includes seo_tasks table
    - Only tracks changes (INSERT, UPDATE, DELETE)
*/

-- Enable REPLICA IDENTITY FULL for the seo_tasks table
ALTER TABLE seo_tasks REPLICA IDENTITY FULL;

-- Create publication for realtime if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'seo_tasks_publication'
  ) THEN
    CREATE PUBLICATION seo_tasks_publication FOR TABLE seo_tasks;
  END IF;
END
$$;
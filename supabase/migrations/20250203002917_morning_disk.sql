/*
  # Add task status tracking

  1. Changes
    - Adds status enum type for tracking task progress
    - Adds columns for tracking task status and timing
    - Updates RLS policies if they don't exist

  2. Security
    - Ensures RLS policies exist for all tables
    - Checks for existing policies before creating new ones
*/

-- Add status enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('pending', 'processing', 'completed', 'failed');
  END IF;
END
$$;

-- Update seo_tasks table
ALTER TABLE seo_tasks
ADD COLUMN IF NOT EXISTS status task_status NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS target_url text NOT NULL,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_seo_tasks_updated_at'
  ) THEN
    CREATE TRIGGER update_seo_tasks_updated_at
      BEFORE UPDATE ON seo_tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Ensure RLS is enabled
ALTER TABLE seo_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'seo_tasks' 
    AND policyname = 'Users can manage their own tasks'
  ) THEN
    CREATE POLICY "Users can manage their own tasks"
      ON seo_tasks
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END
$$;
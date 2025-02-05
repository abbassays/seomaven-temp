/*
  # Add task response storage

  1. New Tables
    - `task_responses` - Stores the raw API response data
      - `id` (uuid, primary key)
      - `task_id` (references seo_tasks)
      - `response_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on new table
    - Add policy for authenticated users to access their own data
*/

-- Create task responses table
CREATE TABLE IF NOT EXISTS task_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  response_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can access their own task responses"
  ON task_responses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM seo_tasks
      WHERE seo_tasks.id = task_responses.task_id
      AND seo_tasks.user_id = auth.uid()
    )
  );
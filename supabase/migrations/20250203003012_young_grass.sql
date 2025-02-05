/*
  # Delete specific SEO tasks

  1. Changes
    - Deletes two specific tasks and their associated data
    - Uses transaction to ensure data consistency
    - Cascading delete through foreign key relationships

  2. Security
    - Maintains RLS policies
    - Only affects specified tasks
*/

-- Delete specific tasks and their associated data
DO $$
BEGIN
  -- Delete tasks with specific IDs
  DELETE FROM seo_tasks
  WHERE task_id IN (
    '02030144-4461-0216-0000-8a7011a2e2e3',
    '02030200-4461-0216-0000-9a08321e0aea'
  );

  -- Due to ON DELETE CASCADE in our foreign key relationships,
  -- all associated data in related tables will be automatically deleted
END
$$;
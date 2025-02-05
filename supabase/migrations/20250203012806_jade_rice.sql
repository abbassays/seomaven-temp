/*
  # Add database functions

  1. New Functions
    - `create_task_with_response` - Creates a task and stores its response atomically
*/

-- Function to create a task and store its response in a transaction
CREATE OR REPLACE FUNCTION create_task_with_response(
  p_task_id text,
  p_target_url text,
  p_user_id uuid,
  p_response_data jsonb
) RETURNS seo_tasks AS $$
DECLARE
  v_task seo_tasks;
BEGIN
  -- Insert the task
  INSERT INTO seo_tasks (
    task_id,
    target_url,
    user_id,
    status
  ) VALUES (
    p_task_id,
    p_target_url,
    p_user_id,
    'processing'
  )
  RETURNING * INTO v_task;

  -- Store the response
  INSERT INTO task_responses (
    task_id,
    response_data
  ) VALUES (
    v_task.id,
    p_response_data
  );

  RETURN v_task;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_task_with_response TO authenticated;
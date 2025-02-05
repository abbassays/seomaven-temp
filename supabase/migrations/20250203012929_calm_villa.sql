/*
  # Fix task creation function

  1. Changes
    - Drop existing function if it exists
    - Recreate function with proper parameter types and error handling
    - Add transaction handling
    - Add proper return type

  2. Security
    - Function runs with SECURITY DEFINER
    - Limited to authenticated users
*/

-- Drop the function if it exists
DROP FUNCTION IF EXISTS create_task_with_response;

-- Create the function with proper parameter types and error handling
CREATE OR REPLACE FUNCTION create_task_with_response(
  p_task_id text,
  p_target_url text,
  p_user_id uuid,
  p_response_data jsonb
) RETURNS seo_tasks AS $$
DECLARE
  v_task seo_tasks;
BEGIN
  -- Start transaction
  BEGIN
    -- Insert the task first
    INSERT INTO seo_tasks (
      task_id,
      target_url,
      user_id,
      status
    ) VALUES (
      p_task_id,
      p_target_url,
      p_user_id,
      'processing'::task_status
    )
    RETURNING * INTO v_task;

    -- Then store the response
    INSERT INTO task_responses (
      task_id,
      response_data
    ) VALUES (
      v_task.id,
      p_response_data
    );

    -- Return the created task
    RETURN v_task;
  EXCEPTION
    WHEN OTHERS THEN
      -- Roll back the transaction on any error
      RAISE EXCEPTION 'Failed to create task: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION create_task_with_response FROM PUBLIC;

-- Grant execute permission only to authenticated users
GRANT EXECUTE ON FUNCTION create_task_with_response TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION create_task_with_response IS 'Creates a new SEO task and stores its API response data in a single transaction';
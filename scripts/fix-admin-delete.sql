-- Create an enhanced version of the admin delete function with debugging
CREATE OR REPLACE FUNCTION direct_admin_delete_meeting(meeting_id UUID, admin_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
  deleted_row meetings%ROWTYPE;
  result JSONB;
BEGIN
  -- Get the email from the JWT
  caller_email := auth.jwt()->>'email';
  
  -- Create a result object with debugging info
  result := jsonb_build_object(
    'caller_email', caller_email,
    'admin_email', admin_email,
    'is_admin', caller_email = admin_email,
    'meeting_id', meeting_id
  );
  
  -- Check if the caller is the admin
  IF caller_email = admin_email THEN
    -- Try to delete the meeting
    DELETE FROM meetings
    WHERE id = meeting_id
    RETURNING * INTO deleted_row;
    
    -- Add deletion results to our debug object
    IF deleted_row.id IS NOT NULL THEN
      result := result || jsonb_build_object(
        'success', true,
        'deleted', jsonb_build_object(
          'id', deleted_row.id,
          'title', deleted_row.title
        )
      );
    ELSE
      result := result || jsonb_build_object(
        'success', false,
        'reason', 'No meeting found with that ID'
      );
    END IF;
  ELSE
    -- Not admin
    result := result || jsonb_build_object(
      'success', false,
      'reason', 'Permission denied: only admin can delete meetings'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Re-grant execution permission
GRANT EXECUTE ON FUNCTION direct_admin_delete_meeting(UUID, TEXT) TO authenticated; 
-- Store admin email in GUC (Grand Unified Configuration)
ALTER DATABASE postgres SET app.admin_email TO 'goonewardenadimantha@gmail.com';

-- Ensure the RLS policies are properly configured
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Add a comment to help administrators understand the configuration
COMMENT ON DATABASE postgres IS 'The admin email is configured via app.admin_email GUC setting';

-- Create an alternative admin delete function that doesn't rely on settings
CREATE OR REPLACE FUNCTION direct_admin_delete_meeting(meeting_id UUID, admin_email TEXT)
RETURNS SETOF meetings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_email TEXT;
BEGIN
  -- Get the email from the JWT
  caller_email := auth.jwt()->>'email';
  
  -- Check if the caller is the admin
  IF caller_email = admin_email THEN
    -- Only proceed if admin
    RETURN QUERY
    DELETE FROM meetings
    WHERE id = meeting_id
    RETURNING *;
  ELSE
    -- Raise an exception if not admin
    RAISE EXCEPTION 'Permission denied: only admin can delete meetings';
  END IF;
END;
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION direct_admin_delete_meeting(UUID, TEXT) TO authenticated; 
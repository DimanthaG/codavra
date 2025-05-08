-- Create a function to set the admin email
CREATE OR REPLACE FUNCTION set_admin_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Store the admin email in database settings
  PERFORM set_config('app.admin_email', email, false);
  RETURN true;
END;
$$;

-- Grant execution permission to the service role
GRANT EXECUTE ON FUNCTION set_admin_email(TEXT) TO service_role; 
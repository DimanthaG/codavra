-- Set the admin email from environment variable
DO $$
BEGIN
  -- Try to update the setting if it exists
  BEGIN
    PERFORM set_config('app.admin_email', current_setting('NEXT_PUBLIC_ADMIN_EMAIL', true), false);
  EXCEPTION
    WHEN undefined_object THEN
      -- If the setting doesn't exist, create it
      PERFORM set_config('app.admin_email', current_setting('NEXT_PUBLIC_ADMIN_EMAIL', true), false);
  END;
END $$; 
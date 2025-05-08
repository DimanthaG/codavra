-- Create meetings table
CREATE TABLE meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_by_image TEXT NOT NULL,
    allow_join BOOLEAN DEFAULT false NOT NULL,
    participants JSONB DEFAULT '[]' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON meetings FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON meetings FOR INSERT 
WITH CHECK (auth.jwt() IS NOT NULL);

CREATE POLICY "Enable update for owner and admin" ON meetings FOR UPDATE 
USING (auth.jwt() IS NOT NULL AND (auth.jwt()->>'email' = created_by OR auth.jwt()->>'email' = current_setting('app.admin_email', true)))
WITH CHECK (auth.jwt() IS NOT NULL AND (auth.jwt()->>'email' = created_by OR auth.jwt()->>'email' = current_setting('app.admin_email', true)));

-- Add policy for participants to update participants array
CREATE POLICY "Enable participants update" ON meetings FOR UPDATE 
USING (auth.jwt() IS NOT NULL AND allow_join = true);

CREATE POLICY "Enable delete for owner and admin" ON meetings FOR DELETE 
USING (auth.jwt() IS NOT NULL AND (auth.jwt()->>'email' = created_by OR auth.jwt()->>'email' = current_setting('app.admin_email', true))); 

-- Create a function to delete a meeting by ID that checks permissions internally
CREATE OR REPLACE FUNCTION admin_delete_meeting(meeting_id UUID)
RETURNS SETOF meetings
LANGUAGE plpgsql
SECURITY DEFINER -- This makes it run with DB owner privileges, bypassing RLS
AS $$
DECLARE
  caller_email TEXT;
  admin_email TEXT;
BEGIN
  -- Get the email from the JWT
  caller_email := auth.jwt()->>'email';
  
  -- Get the admin email from app settings
  admin_email := current_setting('app.admin_email', true);
  
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

-- Grant execution permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_delete_meeting(UUID) TO authenticated;
/*
  # Fix User Permissions

  1. Changes
    - Update RLS policies for users table to allow proper authentication flows
    - Add policies for public profile access
    - Fix permission issues with user details fetching

  2. Security
    - Maintain data privacy while allowing necessary access
    - Enable proper authentication flows
    - Allow public profile viewing
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Policies can be dropped without schema qualification
    EXECUTE 'DROP POLICY IF EXISTS "Users can read their own data" ON auth.users';
    EXECUTE 'DROP POLICY IF EXISTS "Users can read basic info of others" ON auth.users';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create their own record" ON auth.users';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own record" ON auth.users';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Create new policies for the users table
CREATE POLICY "Users can read own profile"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read public profile data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON auth.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to safely get user details
CREATE OR REPLACE FUNCTION auth.get_user_details(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'id', id,
      'full_name', full_name,
      'role', role,
      'avatar_url', avatar_url,
      'availability_status', availability_status
    )
    FROM auth.users
    WHERE id = user_id
  );
END;
$$;

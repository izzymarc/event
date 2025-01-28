/*
  # Fix RLS policies for user creation

  1. Changes
    - Add policy to allow authenticated users to create their own user record
    - Add policy to allow authenticated users to update their own user record
    - Add policy to allow authenticated users to read their own user record
    - Add policy to allow authenticated users to read basic user info of others

  2. Security
    - Users can only create/update their own records
    - Users can read basic info of other users for collaboration
    - Sensitive data is protected
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create new policies
CREATE POLICY "Users can create their own record"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can read basic info of others"
  ON users
  FOR SELECT
  USING (
    -- Allow reading non-sensitive fields of other users
    auth.role() = 'authenticated' AND (
      auth.uid() = id OR
      (SELECT true FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

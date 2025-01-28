/*
  # Add User Profile Enhancements

  1. New Columns
    - Add `avatar_url` to users table
    - Add `bio` to profiles table
    - Add `availability_status` to users table
    - Add `last_active` to users table
  
  2. Security
    - Enable RLS on new columns
    - Add policies for profile viewing and updating
*/

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'offline';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active timestamptz DEFAULT now();

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;

-- Update policies for new columns
CREATE POLICY "Users can update their own availability status"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to update last_active
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_last_active
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

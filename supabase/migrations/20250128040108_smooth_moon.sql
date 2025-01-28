/*
  # User Role Management Implementation

  1. Changes
    - First drop existing policies that depend on the role column
    - Create role permissions system
    - Re-create policies with role checks
    - Add role validation

  2. Security
    - Enable RLS on new tables
    - Add role-based policies
*/

-- First drop existing policies that depend on the role column
DROP POLICY IF EXISTS "Clients can create jobs" ON jobs;
DROP POLICY IF EXISTS "Vendors can create proposals" ON proposals;

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('client', 'vendor');

-- Create a temporary column for the role conversion
ALTER TABLE users ADD COLUMN role_new user_role;

-- Copy data to the new column
UPDATE users SET role_new = role::user_role;

-- Drop the old column and rename the new one
ALTER TABLE users DROP COLUMN role;
ALTER TABLE users RENAME COLUMN role_new TO role;

-- Make role NOT NULL
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Create role permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission)
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create default permissions
INSERT INTO role_permissions (role, permission) VALUES
  ('client', 'create:jobs'),
  ('client', 'manage:jobs'),
  ('client', 'view:proposals'),
  ('vendor', 'create:proposals'),
  ('vendor', 'view:jobs'),
  ('vendor', 'manage:proposals');

-- Create function to check user role
CREATE OR REPLACE FUNCTION check_user_role(required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS TABLE (permission text) AS $$
BEGIN
  RETURN QUERY
  SELECT rp.permission
  FROM users u
  JOIN role_permissions rp ON u.role = rp.role
  WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies with role checks
CREATE POLICY "Clients can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (check_user_role('client'));

-- Add policy for vendors to view jobs
CREATE POLICY "Vendors can view jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    check_user_role('vendor') OR
    client_id = auth.uid()
  );

-- Add policy for vendors to create proposals
CREATE POLICY "Vendors can create proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (check_user_role('vendor'));

-- Add policy for clients to view proposals
CREATE POLICY "Clients can view proposals"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = proposals.job_id
      AND jobs.client_id = auth.uid()
    ) OR
    vendor_id = auth.uid()
  );

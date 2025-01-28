/*
  # Dynamic Permissions Implementation

  1. New Tables
    - `permissions` table to store all available permissions
    - `role_permissions` table to link roles to permissions

  2. Changes
    - Remove hardcoded permissions from `role_permissions` table
    - Update functions to use new tables

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies for data access
*/

-- Drop existing role_permissions table
DROP TABLE IF EXISTS role_permissions;

-- Create permissions table
CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Enable RLS
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Add default permissions
INSERT INTO permissions (name, description) VALUES
  ('create:jobs', 'Allows users to create new jobs'),
  ('manage:jobs', 'Allows users to manage their jobs'),
  ('view:proposals', 'Allows users to view proposals'),
  ('create:proposals', 'Allows users to create proposals'),
  ('view:jobs', 'Allows users to view jobs'),
  ('manage:proposals', 'Allows users to manage proposals');

-- Add default role permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'client', id FROM permissions WHERE name IN ('create:jobs', 'manage:jobs', 'view:proposals');

INSERT INTO role_permissions (role, permission_id)
SELECT 'vendor', id FROM permissions WHERE name IN ('create:proposals', 'view:jobs', 'manage:proposals');

-- Update function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS TABLE (permission text) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name
  FROM users u
  JOIN role_permissions rp ON u.role = rp.role
  JOIN permissions p ON rp.permission_id = p.id
  WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies with role checks
CREATE OR REPLACE FUNCTION check_user_permission(required_permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM get_user_permissions()
    WHERE permission = required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies with role checks
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

-- Recreate policies with role checks
CREATE OR REPLACE FUNCTION check_user_permission(required_permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM get_user_permissions()
    WHERE permission = required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies with role checks
DROP POLICY IF EXISTS "Clients can create jobs" ON jobs;
DROP POLICY IF EXISTS "Vendors can create proposals" ON proposals;

CREATE POLICY "Clients can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (check_user_permission('create:jobs'));

CREATE POLICY "Vendors can create proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (check_user_permission('create:proposals'));

-- Add policy for vendors to view jobs
CREATE POLICY "Vendors can view jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    check_user_permission('view:jobs') OR
    client_id = auth.uid()
  );

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

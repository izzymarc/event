/*
  # Enhance Jobs and Proposals

  1. New Tables
    - Add `job_categories` table for standardized categories
    - Add `job_skills` table for required skills
    - Add `job_attachments` for job-related files
  
  2. Enhancements
    - Add status tracking
    - Add deadline field
    - Add visibility control
  
  3. Security
    - Enable RLS on all new tables
    - Add appropriate access policies
*/

-- Create job categories table
CREATE TABLE IF NOT EXISTS job_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create job skills table
CREATE TABLE IF NOT EXISTS job_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  skill text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create job attachments table
CREATE TABLE IF NOT EXISTS job_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level text;

-- Enable RLS on new tables
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_attachments ENABLE ROW LEVEL SECURITY;

-- Add policies for new tables
CREATE POLICY "Anyone can read job categories"
  ON job_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read job skills"
  ON job_skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Job owners can manage job skills"
  ON job_skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_skills.job_id
      AND jobs.client_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read job attachments"
  ON job_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_attachments.job_id
      AND jobs.is_visible = true
    )
  );

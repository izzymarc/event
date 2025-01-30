/*
  # Functional Enhancements Migration

  1. New Tables
    - `search_indexes` - For advanced search capabilities
    - `portfolio_items` - For user portfolios
    - `milestones` - For project management
    - `time_entries` - For time tracking
    - `file_attachments` - For file sharing
    - `message_attachments` - For messaging attachments

  2. Functions
    - Full-text search functions
    - Project management functions
    - File handling functions

  3. Indexes
    - Search optimization indexes
    - Performance-related indexes
*/

-- Enable the pg_trgm extension for better search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search_indexes table
CREATE TABLE search_indexes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  searchable_id uuid NOT NULL,
  searchable_type text NOT NULL,
  search_vector tsvector,
  created_at timestamptz DEFAULT now()
);

-- Create portfolio_items table
CREATE TABLE portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  project_url text,
  technologies text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_entries table
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create file_attachments table
CREATE TABLE file_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attachable_id uuid NOT NULL,
  attachable_type text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create message_attachments table
CREATE TABLE message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add search vector column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS jobs_search_idx ON jobs USING gin(search_vector);

-- Add search vector column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS users_search_idx ON users USING gin(search_vector);

-- Create function to update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'jobs' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  ELSIF TG_TABLE_NAME = 'users' THEN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for search vector updates
CREATE TRIGGER jobs_search_vector_update
  BEFORE INSERT OR UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER users_search_vector_update
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- Enable RLS on new tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own portfolio"
  ON portfolio_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public portfolios"
  ON portfolio_items
  FOR SELECT
  USING (true);

CREATE POLICY "Project members can view milestones"
  ON milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = milestones.project_id
      AND (
        jobs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM proposals
          WHERE proposals.job_id = jobs.id
          AND proposals.vendor_id = auth.uid()
          AND proposals.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Project owners can manage milestones"
  ON milestones
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = milestones.project_id
      AND jobs.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own time entries"
  ON time_entries
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Project members can view time entries"
  ON time_entries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = time_entries.project_id
      AND (
        jobs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM proposals
          WHERE proposals.job_id = jobs.id
          AND proposals.vendor_id = auth.uid()
          AND proposals.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can manage their own file attachments"
  ON file_attachments
  FOR ALL
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can view related file attachments"
  ON file_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = file_attachments.attachable_id
      AND file_attachments.attachable_type = 'job'
      AND (
        jobs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM proposals
          WHERE proposals.job_id = jobs.id
          AND proposals.vendor_id = auth.uid()
        )
      )
    ) OR
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = file_attachments.attachable_id
      AND file_attachments.attachable_type = 'message'
      AND (
        messages.sender_id = auth.uid() OR
        messages.receiver_id = auth.uid()
      )
    )
  );

CREATE POLICY "Message participants can view attachments"
  ON message_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_attachments.message_id
      AND (
        messages.sender_id = auth.uid() OR
        messages.receiver_id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_portfolio_items_user ON portfolio_items(user_id);
CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_file_attachments_attachable ON file_attachments(attachable_id, attachable_type);
CREATE INDEX idx_message_attachments_message ON message_attachments(message_id);

-- Update triggers for updated_at timestamps
CREATE TRIGGER portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

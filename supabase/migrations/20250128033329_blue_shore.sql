/*
  # Add Dynamic Features

  1. New Tables
    - `user_preferences` - Stores user-specific settings and preferences
    - `job_status_history` - Tracks job status changes over time
    - `notifications` - Handles system notifications
    - `user_ratings` - Stores user ratings and feedback
    - `skill_endorsements` - Tracks skill endorsements between users
    - `user_activity_log` - Logs important user actions

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
    - Ensure proper data isolation between users

  3. Changes
    - Add dynamic configuration columns to existing tables
    - Create tracking and analytics functions
*/

-- User Preferences Table
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  preferences jsonb NOT NULL DEFAULT '{}',
  theme text DEFAULT 'light',
  notification_settings jsonb DEFAULT '{"email": true, "push": true, "desktop": true}',
  dashboard_layout jsonb DEFAULT '{"widgets": [], "layout": "default"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Job Status History
CREATE TABLE job_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  changed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Notifications System
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Ratings and Feedback
CREATE TABLE user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rated_id uuid REFERENCES users(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(rater_id, rated_id, job_id)
);

-- Skill Endorsements
CREATE TABLE skill_endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill text NOT NULL,
  endorser_id uuid REFERENCES users(id) ON DELETE CASCADE,
  endorsed_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(skill, endorser_id, endorsed_id)
);

-- User Activity Log
CREATE TABLE user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Preferences Policies
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Job Status History Policies
CREATE POLICY "Users can view job status history"
  ON job_status_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_status_history.job_id
      AND (
        jobs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM proposals
          WHERE proposals.job_id = jobs.id
          AND proposals.vendor_id = auth.uid()
        )
      )
    )
  );

-- Notifications Policies
CREATE POLICY "Users can manage their own notifications"
  ON notifications
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Ratings Policies
CREATE POLICY "Users can read all ratings"
  ON user_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create ratings for completed jobs"
  ON user_ratings
  FOR INSERT
  WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_id
      AND jobs.status = 'completed'
      AND (
        jobs.client_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM proposals
          WHERE proposals.job_id = jobs.id
          AND proposals.vendor_id = auth.uid()
          AND proposals.status = 'completed'
        )
      )
    )
  );

-- Skill Endorsements Policies
CREATE POLICY "Users can read all endorsements"
  ON skill_endorsements
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create endorsements"
  ON skill_endorsements
  FOR INSERT
  WITH CHECK (
    auth.uid() = endorser_id AND
    endorser_id != endorsed_id
  );

-- User Activity Log Policies
CREATE POLICY "Users can view their own activity"
  ON user_activity_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Functions

-- Function to log job status changes
CREATE OR REPLACE FUNCTION log_job_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status != OLD.status THEN
    INSERT INTO job_status_history (job_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_activity_type text,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_activity_log (user_id, activity_type, metadata)
  VALUES (p_user_id, p_activity_type, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate user rating
CREATE OR REPLACE FUNCTION calculate_user_rating(p_user_id uuid)
RETURNS numeric AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM user_ratings
  WHERE rated_id = p_user_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers

-- Trigger for job status changes
CREATE TRIGGER job_status_change_trigger
  AFTER UPDATE OF status ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION log_job_status_change();

-- Trigger for updating timestamps
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_ratings_updated_at
  BEFORE UPDATE ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes for better performance
CREATE INDEX idx_notifications_user_unread ON notifications (user_id) WHERE NOT is_read;
CREATE INDEX idx_job_status_history_job ON job_status_history (job_id);
CREATE INDEX idx_user_ratings_rated ON user_ratings (rated_id);
CREATE INDEX idx_skill_endorsements_endorsed ON skill_endorsements (endorsed_id);
CREATE INDEX idx_user_activity_log_user ON user_activity_log (user_id);

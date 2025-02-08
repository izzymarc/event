/*
    EventWork Relational Database Schema - SQL Migration Script (Corrected Order)
*/

-- Enable pg_trgm extension for enhanced search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create user_role ENUM type
CREATE TYPE user_role AS ENUM ('client', 'vendor');

-- 18. permissions Table (CREATE THIS TABLE FIRST)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- 17. role_permissions Table (CREATE THIS TABLE AFTER PERMISSIONS)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role, permission_id)
);
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    availability_status TEXT DEFAULT 'offline',
    last_active TIMESTAMPTZ DEFAULT now(),
    rating NUMERIC,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read basic info of others" ON users FOR SELECT USING (auth.role() = 'authenticated' AND (auth.uid() = id OR (SELECT true FROM auth.users WHERE auth.users.id = auth.uid())));
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can create their own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    hourly_rate NUMERIC CHECK (hourly_rate >= 0),
    availability TEXT,
    skills TEXT[],
    portfolio_url TEXT,
    portfolio_website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    business_details JSONB DEFAULT '{}'::jsonb,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 3. jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    event_type TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    budget NUMERIC NOT NULL CHECK (budget > 0),
    deadline TIMESTAMPTZ,
    is_visible BOOLEAN DEFAULT TRUE,
    experience_level TEXT,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read jobs" ON jobs FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Clients can create jobs" ON jobs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'client'));

-- 4. proposals Table
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price > 0),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors can read own proposals" ON proposals FOR SELECT TO authenticated USING (vendor_id = auth.uid());
CREATE POLICY "Clients can read proposals for their jobs" ON proposals FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid()));

-- 5. messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    read_at TIMESTAMPTZ
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their messages" ON messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- 6. payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID UNIQUE NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read related payments" ON payments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM proposals JOIN jobs ON proposals.job_id = jobs.id WHERE payments.proposal_id = proposals.id AND (proposals.vendor_id = auth.uid() OR jobs.client_id = auth.uid())));

-- 7. milestones Table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    payment_amount NUMERIC CHECK (payment_amount >= 0),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Milestones are viewable by project members" ON milestones FOR SELECT USING (TRUE);
CREATE POLICY "Clients can create milestones for their jobs" ON milestones FOR INSERT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = milestones.job_id AND jobs.client_id = auth.uid()));

-- 8. service_packages Table
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price > 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service packages are viewable by everyone" ON service_packages FOR SELECT USING (TRUE);
CREATE POLICY "Vendors can manage their own service packages" ON service_packages FOR ALL USING (auth.uid() = vendor_id);

-- 9. job_categories Table
CREATE TABLE IF NOT EXISTS job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read job categories" ON job_categories FOR SELECT TO authenticated USING (TRUE);

-- 10. job_skills Table
CREATE TABLE IF NOT EXISTS job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read job skills" ON job_skills FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Job owners can manage job skills" ON job_skills FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_skills.job_id AND jobs.client_id = auth.uid()));

-- 11. job_attachments Table
CREATE TABLE IF NOT EXISTS job_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE job_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read job attachments" ON job_attachments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_attachments.job_id AND jobs.is_visible = true));

-- 12. message_attachments Table
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Message participants can view attachments" ON message_attachments FOR SELECT USING (EXISTS (SELECT 1 FROM messages WHERE messages.id = message_attachments.message_id AND (messages.sender_id = auth.uid() OR messages.receiver_id = auth.uid())));

-- 13. user_preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
    theme TEXT DEFAULT 'light',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "desktop": true}'::jsonb,
    dashboard_layout JSONB DEFAULT '{"widgets": [], "layout": "default"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 14. user_ratings Table
CREATE TABLE IF NOT EXISTS user_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rated_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(rater_id, rated_id, job_id)
);
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all ratings" ON user_ratings FOR SELECT USING (TRUE);
CREATE POLICY "Users can create ratings for completed jobs" ON user_ratings FOR INSERT WITH CHECK (auth.uid() = rater_id AND EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.status = 'completed' AND (jobs.client_id = auth.uid() OR EXISTS (SELECT 1 FROM proposals WHERE proposals.job_id = jobs.id AND proposals.vendor_id = auth.uid() AND proposals.status = 'completed'))));

-- 15. skill_endorsements Table
CREATE TABLE IF NOT EXISTS skill_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill TEXT NOT NULL,
    endorser_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endorsed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(skill, endorser_id, endorsed_id)
);
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all endorsements" ON skill_endorsements FOR SELECT USING (TRUE);
CREATE POLICY "Users can create endorsements" ON skill_endorsements FOR INSERT WITH CHECK (auth.uid() = endorser_id AND endorser_id != endorsed_id);

-- 16. user_activity_log Table
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);


-- Functions (no change in order)
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$ BEGIN IF TG_TABLE_NAME = 'jobs' THEN NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') || setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') || setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C'); ELSIF TG_TABLE_NAME = 'users' THEN NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A') || setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B'); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION log_job_status_change() RETURNS TRIGGER AS $$ BEGIN IF OLD.status IS NULL OR NEW.status != OLD.status THEN INSERT INTO job_status_history (job_id, status, changed_by) VALUES (NEW.id, NEW.status, auth.uid()); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION log_user_activity(p_user_id uuid, p_activity_type text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void AS $$ BEGIN INSERT INTO user_activity_log (user_id, activity_type, metadata) VALUES (p_user_id, p_activity_type, p_metadata); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION calculate_user_rating(p_user_id uuid) RETURNS numeric AS $$ DECLARE avg_rating numeric; BEGIN SELECT COALESCE(AVG(rating), 0) INTO avg_rating FROM user_ratings WHERE rated_id = p_user_id; RETURN avg_rating; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION get_user_permissions() RETURNS TABLE (permission text) AS $$ BEGIN RETURN QUERY SELECT p.name FROM users u JOIN role_permissions rp ON u.role = rp.role JOIN permissions p ON rp.permission_id = p.id WHERE u.id = auth.uid(); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION check_user_role(required_role user_role) RETURNS boolean AS $$ BEGIN RETURN EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = required_role); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION check_user_permission(required_permission text) RETURNS boolean AS $$ BEGIN RETURN EXISTS (SELECT 1 FROM get_user_permissions() WHERE permission = required_permission); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION auth.get_user_details(user_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth AS $$ BEGIN RETURN ( SELECT jsonb_build_object( 'id', id, 'full_name', full_name, 'role', role, 'avatar_url', avatar_url, 'availability_status', availability_status ) FROM auth.users WHERE id = user_id ); END; $$;


-- Triggers (no change in order)
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER service_packages_updated_at BEFORE UPDATE ON service_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_ratings_updated_at BEFORE UPDATE ON user_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_search_vector_update BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_search_vector();
CREATE TRIGGER jobs_search_vector_update BEFORE INSERT OR UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_search_vector();
CREATE TRIGGER job_status_change_trigger AFTER UPDATE OF status ON jobs FOR EACH ROW EXECUTE FUNCTION log_job_status_change();


-- Indexes (no change in order)
CREATE INDEX idx_notifications_user_unread ON notifications (user_id) WHERE NOT is_read;
CREATE INDEX idx_job_status_history_job ON job_status_history (job_id);
CREATE INDEX idx_user_ratings_rated ON user_ratings (rated_id);
CREATE INDEX idx_skill_endorsements_endorsed ON skill_endorsements (endorsed_id);
CREATE INDEX idx_user_activity_log_user ON user_activity_log (user_id);
CREATE INDEX idx_portfolio_items_user ON portfolio_items(user_id);
CREATE INDEX idx_milestones_project ON milestones(job_id);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_file_attachments_attachable ON file_attachments(attachable_id, attachable_type);
CREATE INDEX idx_message_attachments_message ON message_attachments(message_id);
CREATE INDEX jobs_search_idx ON jobs USING gin(search_vector);
CREATE INDEX users_search_idx ON users USING gin(search_vector);

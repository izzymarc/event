-- Enable Row Level Security (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_indexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users Table
DROP POLICY IF EXISTS "Users can read their own data" ON users;
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read basic info of others" ON users;
CREATE POLICY "Users can read basic info of others" ON users FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can update their own record" ON users;
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create their own record" ON users;
CREATE POLICY "Users can create their own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for profiles Table
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for jobs Table
DROP POLICY IF EXISTS "Anyone can read jobs" ON jobs;
CREATE POLICY "Anyone can read jobs" ON jobs FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Clients can create jobs" ON jobs;
CREATE POLICY "Clients can create jobs" ON jobs FOR INSERT TO authenticated WITH CHECK (check_user_permission('create:jobs'));

-- RLS Policies for proposals Table
DROP POLICY IF EXISTS "Vendors can read own proposals" ON proposals;
CREATE POLICY "Vendors can read own proposals" ON proposals FOR SELECT TO authenticated USING (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Clients can view proposals for their jobs" ON proposals;
CREATE POLICY "Clients can view proposals for their jobs" ON proposals FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid()));

-- RLS Policies for messages Table
DROP POLICY IF EXISTS "Users can read their messages" ON messages;
CREATE POLICY "Users can read their messages" ON messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- RLS Policies for payments Table
DROP POLICY IF EXISTS "Users can read related payments" ON payments;
CREATE POLICY "Users can read related payments" ON payments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM proposals JOIN jobs ON proposals.job_id = jobs.id WHERE payments.proposal_id = proposals.id AND (proposals.vendor_id = auth.uid() OR jobs.client_id = auth.uid())));

-- RLS Policies for milestones Table
DROP POLICY IF EXISTS "Milestones are viewable by project members" ON milestones;
CREATE POLICY "Milestones are viewable by project members" ON milestones FOR SELECT USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = milestones.job_id AND (jobs.client_id = auth.uid() OR EXISTS (SELECT 1 FROM proposals WHERE proposals.job_id = jobs.id AND proposals.vendor_id = auth.uid() AND proposals.status = 'accepted'))));

DROP POLICY IF EXISTS "Clients can create milestones for their jobs" ON milestones;
CREATE POLICY "Clients can create milestones for their jobs" ON milestones FOR INSERT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = milestones.job_id AND jobs.client_id = auth.uid()));

-- RLS Policies for service_packages Table
DROP POLICY IF EXISTS "Service packages are viewable by everyone" ON service_packages;
CREATE POLICY "Service packages are viewable by everyone" ON service_packages FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Vendors can manage their own service packages" ON service_packages;
CREATE POLICY "Vendors can manage their own service packages" ON service_packages FOR ALL USING (auth.uid() = vendor_id);

-- RLS Policies for job_categories Table
-- Anyone can read job categories
CREATE POLICY "Anyone can read job categories" ON job_categories FOR SELECT TO authenticated USING (TRUE);

-- RLS Policies for job_skills Table
-- Anyone can read job skills
CREATE POLICY "Anyone can read job skills" ON job_skills FOR SELECT TO authenticated USING (TRUE);

-- Job owners can manage job skills
CREATE POLICY "Job owners can manage job skills" ON job_skills FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_skills.job_id AND jobs.client_id = auth.uid()));

-- RLS Policies for job_attachments Table
-- Anyone can read job attachments
CREATE POLICY "Anyone can read job attachments" ON job_attachments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_attachments.job_id AND jobs.is_visible = true));

-- RLS Policies for message_attachments Table
-- Message participants can view attachments
CREATE POLICY "Message participants can view attachments" ON message_attachments FOR SELECT USING (EXISTS (SELECT 1 FROM messages WHERE messages.id = message_attachments.message_id AND (messages.sender_id = auth.uid() OR messages.receiver_id = auth.uid())));

-- RLS Policies for user_preferences Table
-- Users can manage their own preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_ratings Table
-- Users can read all ratings
CREATE POLICY "Users can read all ratings" ON user_ratings FOR SELECT USING (TRUE);

-- Users can create ratings for completed jobs
CREATE POLICY "Users can create ratings for completed jobs" ON user_ratings FOR INSERT WITH CHECK (auth.uid() = rater_id AND EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.status = 'completed' AND (jobs.client_id = auth.uid() OR EXISTS (SELECT 1 FROM proposals WHERE proposals.job_id = jobs.id AND proposals.vendor_id = auth.uid() AND proposals.status = 'completed'))));

-- RLS Policies for skill_endorsements Table
-- Users can read all endorsements
CREATE POLICY "Users can read all endorsements" ON skill_endorsements FOR SELECT USING (TRUE);

-- Users can create endorsements
CREATE POLICY "Users can create endorsements" ON skill_endorsements FOR INSERT WITH CHECK (auth.uid() = endorser_id AND endorser_id != endorsed_id);

-- RLS Policies for user_activity_log Table
-- Users can view their own activity
CREATE POLICY "Users can view their own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for role_permissions Table
-- Only admins can manage role permissions (adjust as needed)
-- This requires an 'admin' role or similar, which is not yet implemented
-- For now, allow authenticated users to read role permissions
CREATE POLICY "Allow authenticated users to read role permissions" ON role_permissions FOR SELECT TO authenticated USING (TRUE);

-- RLS Policies for permissions Table
-- Only admins can manage permissions (adjust as needed)
-- This requires an 'admin' role or similar, which is not yet implemented
-- For now, allow authenticated users to read permissions
CREATE POLICY "Allow authenticated users to read permissions" ON permissions FOR SELECT TO authenticated USING (TRUE);

-- RLS Policies for search_indexes Table
-- Allow authenticated users to read search indexes
CREATE POLICY "Allow authenticated users to read search indexes" ON search_indexes FOR SELECT TO authenticated USING (TRUE);

-- RLS Policies for time_entries Table
CREATE POLICY "Users can manage their own time entries" ON time_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Project members can view time entries" ON time_entries FOR SELECT USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = time_entries.project_id AND (jobs.client_id = auth.uid() OR EXISTS (SELECT 1 FROM proposals WHERE proposals.job_id = jobs.id AND proposals.vendor_id = auth.uid() AND proposals.status = 'accepted'))));

-- Add event_type to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Add milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    payment_amount NUMERIC,
    status TEXT DEFAULT 'pending'
);
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Milestones are viewable by project members" ON milestones FOR SELECT USING (TRUE); -- Adjust as needed

-- Add hourly_rate and availability to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability TEXT;

-- Add rating to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC;

-- Add service packages table (if needed for vendor profiles)
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service packages are viewable by everyone" ON service_packages FOR SELECT USING (TRUE); -- Adjust as needed
CREATE POLICY "Vendors can manage their own service packages" ON service_packages FOR ALL USING (auth.uid() = vendor_id);

-- Add columns for social links and verification status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add columns for proposal attachments (if needed, or handle in storage)
-- Consider using supabase storage for attachments instead of a direct column

-- Update RLS policies as needed to accommodate new features and roles
-- Example: Policy for milestone creation (adjust as needed)
CREATE POLICY "Clients can create milestones for their jobs" ON milestones FOR INSERT TO authenticated USING (
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = milestones.job_id AND jobs.client_id = auth.uid())
);

-- Update triggers or functions if necessary for new columns/tables
-- Example: Update function to recalculate user rating when a new rating is added
-- (Implementation of rating calculation function would be more complex and is omitted for brevity)

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'vendor');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    avatar_url TEXT,
    availability_status TEXT DEFAULT 'offline',
    last_active TIMESTAMPTZ DEFAULT NOW(),
    role user_role NOT NULL,
    search_vector TSVECTOR,
    rating NUMERIC
);

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    budget NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ,
    is_visible BOOLEAN DEFAULT true,
    experience_level TEXT,
    search_vector TSVECTOR,
    event_type TEXT
);

-- Create proposals table
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hourly_rate NUMERIC,
    skills TEXT[],
    portfolio_url TEXT,
    business_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    bio TEXT,
    availability TEXT,
    portfolio_website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    is_verified BOOLEAN DEFAULT false
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX jobs_search_idx ON jobs USING gin(search_vector);
CREATE INDEX users_search_idx ON users USING gin(search_vector);

-- Create functions
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
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

-- Create triggers
CREATE TRIGGER jobs_search_vector_update
  BEFORE INSERT OR UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER users_search_vector_update
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read jobs" ON jobs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Clients can create jobs" ON jobs
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Job owners can update jobs" ON jobs
  FOR UPDATE USING (client_id = auth.uid());

CREATE POLICY "Users can read their messages" ON messages
  FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can read their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

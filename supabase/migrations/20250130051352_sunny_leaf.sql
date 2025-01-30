/*
  # Add Test Data with Profile Pictures

  1. Test Data
    - Add realistic test users with profile pictures
    - Add sample jobs with varied categories and budgets
    - Add proposals with different statuses
    - Add portfolio items with project examples
    - Add ratings and reviews
    - Add messages between users
    - Add milestones and time entries

  2. Data Categories
    - Users: Clients and vendors with complete profiles
    - Jobs: Various categories, budgets, and statuses
    - Proposals: Different stages of negotiation
    - Portfolio: Sample work examples
    - Reviews: Varied ratings and feedback
*/

-- Insert test users with profile pictures from Unsplash
INSERT INTO users (id, email, role, full_name, avatar_url, availability_status, created_at)
SELECT 
  uuid_generate_v4(),
  'sarah.johnson@example.com',
  'client',
  'Sarah Johnson',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  'online',
  NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'sarah.johnson@example.com'
);

INSERT INTO users (id, email, role, full_name, avatar_url, availability_status, created_at)
SELECT 
  uuid_generate_v4(),
  'michael.chen@example.com',
  'vendor',
  'Michael Chen',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  'online',
  NOW() - INTERVAL '25 days'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'michael.chen@example.com'
);

INSERT INTO users (id, email, role, full_name, avatar_url, availability_status, created_at)
SELECT 
  uuid_generate_v4(),
  'emily.davis@example.com',
  'vendor',
  'Emily Davis',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
  'away',
  NOW() - INTERVAL '20 days'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'emily.davis@example.com'
);

-- Store user IDs for reference
DO $$
DECLARE
  sarah_id uuid;
  michael_id uuid;
  emily_id uuid;
BEGIN
  SELECT id INTO sarah_id FROM users WHERE email = 'sarah.johnson@example.com';
  SELECT id INTO michael_id FROM users WHERE email = 'michael.chen@example.com';
  SELECT id INTO emily_id FROM users WHERE email = 'emily.davis@example.com';

  -- Insert user profiles
  INSERT INTO profiles (user_id, bio, hourly_rate, skills, portfolio_url, created_at)
  VALUES
    (michael_id, 'Full-stack developer with 8 years of experience specializing in React and Node.js', 85, ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'], 'https://michaelchen.dev', NOW() - INTERVAL '25 days'),
    (emily_id, 'UI/UX designer focused on creating beautiful and functional interfaces', 75, ARRAY['UI Design', 'Figma', 'User Research', 'Prototyping'], 'https://emilydavis.design', NOW() - INTERVAL '20 days');

  -- Insert sample jobs
  WITH job_insert AS (
    INSERT INTO jobs (client_id, title, description, category, status, budget, deadline, experience_level, created_at)
    VALUES
      (sarah_id, 'E-commerce Website Redesign', 'Looking for an experienced designer to redesign our e-commerce platform with a focus on user experience and conversion optimization.', 'design', 'active', 5000, NOW() + INTERVAL '30 days', 'expert', NOW() - INTERVAL '7 days')
    RETURNING id
  )
  -- Insert proposals for the job
  INSERT INTO proposals (job_id, vendor_id, content, price, status, created_at)
  SELECT 
    job_insert.id,
    emily_id,
    'I have extensive experience in e-commerce design and would love to help optimize your platform for better conversions.',
    4800,
    'pending',
    NOW() - INTERVAL '6 days'
  FROM job_insert;

  -- Insert portfolio items
  INSERT INTO portfolio_items (user_id, title, description, image_url, project_url, technologies, created_at)
  VALUES
    (michael_id, 'Social Media Dashboard', 'A comprehensive dashboard for managing multiple social media accounts', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://github.com/example/dashboard', ARRAY['React', 'TypeScript', 'Tailwind CSS'], NOW() - INTERVAL '20 days'),
    (emily_id, 'E-commerce App Design', 'Modern and intuitive design for a fashion e-commerce platform', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://dribbble.com/shots/example', ARRAY['Figma', 'Adobe XD', 'Prototyping'], NOW() - INTERVAL '15 days');

  -- Insert messages
  INSERT INTO messages (sender_id, receiver_id, content, created_at)
  VALUES
    (sarah_id, emily_id, 'Hi Emily, I''m interested in your proposal for the website redesign.', NOW() - INTERVAL '5 days'),
    (emily_id, sarah_id, 'Thanks for reaching out! I''d love to discuss the project in more detail.', NOW() - INTERVAL '5 days');

  -- Insert user ratings
  INSERT INTO user_ratings (rater_id, rated_id, rating, feedback, created_at)
  VALUES
    (sarah_id, emily_id, 5, 'Excellent work on the website redesign. Very professional and communicative.', NOW() - INTERVAL '30 days');

  -- Insert skill endorsements
  INSERT INTO skill_endorsements (skill, endorser_id, endorsed_id, created_at)
  VALUES
    ('UI Design', sarah_id, emily_id, NOW() - INTERVAL '25 days'),
    ('React', sarah_id, michael_id, NOW() - INTERVAL '20 days');

END $$;

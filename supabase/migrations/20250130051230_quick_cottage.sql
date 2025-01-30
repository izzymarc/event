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
INSERT INTO users (id, email, role, full_name, avatar_url, availability_status, created_at) VALUES
  ('a1b2c3d4-e5f6-4321-8901-abcdef123456', 'sarah.johnson@example.com', 'client', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'online', NOW() - INTERVAL '30 days'),
  ('b2c3d4e5-f6a7-5432-9012-bcdef234567', 'michael.chen@example.com', 'vendor', 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'online', NOW() - INTERVAL '25 days'),
  ('c3d4e5f6-a7b8-6543-0123-cdefg345678', 'emily.davis@example.com', 'vendor', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'away', NOW() - INTERVAL '20 days'),
  ('d4e5f6a7-b8c9-7654-1234-defgh456789', 'james.wilson@example.com', 'client', 'James Wilson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'online', NOW() - INTERVAL '15 days'),
  ('e5f6a7b8-c9d0-8765-2345-efghi567890', 'sophia.martinez@example.com', 'vendor', 'Sophia Martinez', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'online', NOW() - INTERVAL '10 days');

-- Insert user profiles with skills and portfolio links
INSERT INTO profiles (user_id, bio, hourly_rate, skills, portfolio_url, created_at) VALUES
  ('b2c3d4e5-f6a7-5432-9012-bcdef234567', 'Full-stack developer with 8 years of experience specializing in React and Node.js', 85, ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'], 'https://michaelchen.dev', NOW() - INTERVAL '25 days'),
  ('c3d4e5f6-a7b8-6543-0123-cdefg345678', 'UI/UX designer focused on creating beautiful and functional interfaces', 75, ARRAY['UI Design', 'Figma', 'User Research', 'Prototyping'], 'https://emilydavis.design', NOW() - INTERVAL '20 days'),
  ('e5f6a7b8-c9d0-8765-2345-efghi567890', 'Digital marketing specialist with expertise in SEO and content strategy', 65, ARRAY['SEO', 'Content Marketing', 'Social Media', 'Analytics'], 'https://sophiamartinez.com', NOW() - INTERVAL '10 days');

-- Insert sample jobs
INSERT INTO jobs (id, client_id, title, description, category, status, budget, deadline, experience_level, created_at) VALUES
  ('f6a7b8c9-d0e1-9876-3456-fghij678901', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'E-commerce Website Redesign', 'Looking for an experienced designer to redesign our e-commerce platform with a focus on user experience and conversion optimization.', 'design', 'active', 5000, NOW() + INTERVAL '30 days', 'expert', NOW() - INTERVAL '7 days'),
  ('g7b8c9d0-e1f2-0987-4567-ghijk789012', 'd4e5f6a7-b8c9-7654-1234-defgh456789', 'Mobile App Development', 'Need a React Native developer to build a social networking app with real-time messaging and media sharing capabilities.', 'development', 'active', 12000, NOW() + INTERVAL '60 days', 'expert', NOW() - INTERVAL '5 days'),
  ('h8c9d0e1-f2g3-1098-5678-hijkl890123', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'Content Marketing Strategy', 'Seeking a content strategist to develop and execute a comprehensive marketing plan for our SaaS product.', 'marketing', 'active', 3000, NOW() + INTERVAL '45 days', 'intermediate', NOW() - INTERVAL '3 days');

-- Insert proposals
INSERT INTO proposals (id, job_id, vendor_id, content, price, status, created_at) VALUES
  ('i9d0e1f2-g3h4-2109-6789-ijklm901234', 'f6a7b8c9-d0e1-9876-3456-fghij678901', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', 'I have extensive experience in e-commerce design and would love to help optimize your platform for better conversions.', 4800, 'pending', NOW() - INTERVAL '6 days'),
  ('j0e1f2g3-h4i5-3210-7890-jklmn012345', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'As a full-stack developer with React Native expertise, I can deliver a high-quality social networking app.', 11500, 'accepted', NOW() - INTERVAL '4 days'),
  ('k1f2g3h4-i5j6-4321-8901-klmno123456', 'h8c9d0e1-f2g3-1098-5678-hijkl890123', 'e5f6a7b8-c9d0-8765-2345-efghi567890', 'I specialize in SaaS content marketing and can help you reach your target audience effectively.', 2900, 'pending', NOW() - INTERVAL '2 days');

-- Insert portfolio items
INSERT INTO portfolio_items (id, user_id, title, description, image_url, project_url, technologies, created_at) VALUES
  ('l2g3h4i5-j6k7-5432-9012-lmnop234567', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'Social Media Dashboard', 'A comprehensive dashboard for managing multiple social media accounts', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://github.com/example/dashboard', ARRAY['React', 'TypeScript', 'Tailwind CSS'], NOW() - INTERVAL '20 days'),
  ('m3h4i5j6-k7l8-6543-0123-mnopq345678', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', 'E-commerce App Design', 'Modern and intuitive design for a fashion e-commerce platform', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://dribbble.com/shots/example', ARRAY['Figma', 'Adobe XD', 'Prototyping'], NOW() - INTERVAL '15 days');

-- Insert milestones for accepted proposal
INSERT INTO milestones (id, project_id, title, description, due_date, status, amount, created_at) VALUES
  ('n4i5j6k7-l8m9-7654-1234-nopqr456789', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'Project Setup & Design', 'Initial project setup, design system, and basic app structure', NOW() + INTERVAL '15 days', 'in_progress', 3000, NOW() - INTERVAL '4 days'),
  ('o5j6k7l8-m9n0-8765-2345-opqrs567890', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'Core Features Development', 'Implement core features including authentication and messaging', NOW() + INTERVAL '30 days', 'pending', 5000, NOW() - INTERVAL '4 days'),
  ('p6k7l8m9-n0o1-9876-3456-pqrst678901', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'Testing & Deployment', 'Comprehensive testing and app deployment to stores', NOW() + INTERVAL '45 days', 'pending', 3500, NOW() - INTERVAL '4 days');

-- Insert messages between users
INSERT INTO messages (id, sender_id, receiver_id, content, created_at) VALUES
  ('q7l8m9n0-o1p2-0987-4567-qrstu789012', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', 'Hi Emily, I''m interested in your proposal for the website redesign.', NOW() - INTERVAL '5 days'),
  ('r8m9n0o1-p2q3-1098-5678-rstuv890123', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'Thanks for reaching out! I''d love to discuss the project in more detail.', NOW() - INTERVAL '5 days'),
  ('s9n0o1p2-q3r4-2109-6789-stuvw901234', 'd4e5f6a7-b8c9-7654-1234-defgh456789', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'Great proposal! When can you start on the mobile app?', NOW() - INTERVAL '3 days'),
  ('t0o1p2q3-r4s5-3210-7890-tuvwx012345', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'd4e5f6a7-b8c9-7654-1234-defgh456789', 'I can start next week. Shall we schedule a kick-off meeting?', NOW() - INTERVAL '3 days');

-- Insert time entries for the active project
INSERT INTO time_entries (id, project_id, user_id, description, start_time, end_time, duration, created_at) VALUES
  ('u1p2q3r4-s5t6-4321-8901-uvwxy123456', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'Project setup and initial configuration', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day 16 hours', INTERVAL '8 hours', NOW() - INTERVAL '2 days'),
  ('v2q3r4s5-t6u7-5432-9012-vwxyz234567', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'Design system implementation', NOW() - INTERVAL '1 day', NOW() - INTERVAL '16 hours', INTERVAL '6 hours', NOW() - INTERVAL '1 day');

-- Insert user ratings
INSERT INTO user_ratings (id, rater_id, rated_id, job_id, rating, feedback, created_at) VALUES
  ('w3r4s5t6-u7v8-6543-0123-wxyza345678', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', 'g7b8c9d0-e1f2-0987-4567-ghijk789012', 5, 'Excellent work on the mobile app development. Very professional and communicative.', NOW() - INTERVAL '30 days'),
  ('x4s5t6u7-v8w9-7654-1234-xyzab456789', 'd4e5f6a7-b8c9-7654-1234-defgh456789', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', 'f6a7b8c9-d0e1-9876-3456-fghij678901', 4, 'Great design work and attention to detail. Would hire again.', NOW() - INTERVAL '45 days');

-- Insert skill endorsements
INSERT INTO skill_endorsements (id, skill, endorser_id, endorsed_id, created_at) VALUES
  ('y5t6u7v8-w9x0-8765-2345-yzabc567890', 'React', 'a1b2c3d4-e5f6-4321-8901-abcdef123456', 'b2c3d4e5-f6a7-5432-9012-bcdef234567', NOW() - INTERVAL '25 days'),
  ('z6u7v8w9-x0y1-9876-3456-zabcd678901', 'UI Design', 'd4e5f6a7-b8c9-7654-1234-defgh456789', 'c3d4e5f6-a7b8-6543-0123-cdefg345678', NOW() - INTERVAL '20 days');

-- Update search vectors for the new data
UPDATE jobs SET search_vector = to_tsvector('english', title || ' ' || description || ' ' || category);
UPDATE users SET search_vector = to_tsvector('english', full_name || ' ' || email);

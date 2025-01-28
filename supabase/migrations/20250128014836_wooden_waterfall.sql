/*
  # Add test data for dashboard

  1. Test Data
    - Sample users (client and vendor)
    - Sample jobs
    - Sample proposals
    - Sample messages
    - Sample payments
    - Sample activities
  
  2. Changes
    - Insert test data into existing tables
    - Add sample data matching dashboard UI
*/

-- Insert sample users first
DO $$ 
BEGIN
  -- Only insert if users don't exist
  IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    INSERT INTO users (id, email, role, full_name, created_at)
    VALUES
      ('11111111-1111-1111-1111-111111111111', 'client@example.com', 'client', 'John Client', NOW()),
      ('22222222-2222-2222-2222-222222222222', 'vendor@example.com', 'vendor', 'Sarah Vendor', NOW());
  END IF;
END $$;

-- Insert sample jobs with explicit IDs
INSERT INTO jobs (
  id, client_id, title, description, category, 
  status, budget, deadline, is_visible, experience_level
)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Website Redesign Project',
    'Looking for a skilled designer to redesign our company website...',
    'design',
    'open',
    2000,
    NOW() + INTERVAL '5 days',
    true,
    'intermediate'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'E-commerce Platform Development',
    'Need an experienced developer for building a React-based e-commerce platform...',
    'development',
    'in_progress',
    5000,
    NOW() + INTERVAL '20 days',
    true,
    'senior'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Mobile App UI Design',
    'Looking for a UI designer for our mobile app...',
    'design',
    'open',
    3000,
    NOW() + INTERVAL '15 days',
    true,
    'intermediate'
  );

-- Insert sample proposals with explicit IDs
INSERT INTO proposals (
  id, job_id, vendor_id, content, price, status
)
VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'I would love to help with your website redesign...',
    2000,
    'pending'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'I have extensive experience in website redesign...',
    2500,
    'pending'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'I can help build your e-commerce platform...',
    5000,
    'accepted'
  );

-- Insert sample messages with explicit IDs
INSERT INTO messages (
  id, sender_id, receiver_id, content
)
VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Hi, I saw your proposal for the website redesign project.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Yes, I would love to discuss the details further.'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'When can you start?'
  );

-- Insert sample payments with explicit IDs
INSERT INTO payments (
  id, proposal_id, amount, status
)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '88888888-8888-8888-8888-888888888888',
    800,
    'completed'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '88888888-8888-8888-8888-888888888888',
    1500,
    'pending'
  );

-- Update timestamps for recent activity
UPDATE jobs
SET updated_at = NOW() - INTERVAL '2 hours'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE jobs
SET updated_at = NOW() - INTERVAL '4 hours'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE proposals
SET updated_at = NOW() - INTERVAL '1 day'
WHERE id = '66666666-6666-6666-6666-666666666666';

UPDATE messages
SET created_at = NOW() - INTERVAL '2 hours'
WHERE id = '99999999-9999-9999-9999-999999999999';

UPDATE messages
SET created_at = NOW() - INTERVAL '4 hours'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE payments
SET updated_at = NOW() - INTERVAL '1 day'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

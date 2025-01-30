-- Add authentication records for test users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
)
SELECT
  id, -- Use the same ID as in the public.users table
  '00000000-0000-0000-0000-000000000000', -- instance_id
  email,
  crypt('password123', gen_salt('bf')), -- Default password for testing
  NOW(), -- email_confirmed_at
  jsonb_build_object('provider', 'email', 'providers', ARRAY['email']), -- raw_app_meta_data
  jsonb_build_object('full_name', full_name, 'role', role), -- raw_user_meta_data
  created_at,
  updated_at,
  'authenticated',
  'authenticated'
FROM public.users
WHERE email IN ('michael.chen@example.com', 'sarah.johnson@example.com', 'emily.davis@example.com')
AND NOT EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.email = public.users.email
);

-- Add identities for the users
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  id, -- Use the same ID as the user
  id, -- user_id is the same as id for email provider
  jsonb_build_object('sub', id::text, 'email', email), -- identity_data
  'email', -- provider
  NOW(), -- last_sign_in_at
  created_at,
  updated_at
FROM public.users
WHERE email IN ('michael.chen@example.com', 'sarah.johnson@example.com', 'emily.davis@example.com')
AND NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE auth.identities.user_id = public.users.id
);

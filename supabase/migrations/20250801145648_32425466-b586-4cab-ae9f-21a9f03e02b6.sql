-- Create a default admin user (you can change the email/password later)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}'
);

-- Insert corresponding profile
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@example.com';
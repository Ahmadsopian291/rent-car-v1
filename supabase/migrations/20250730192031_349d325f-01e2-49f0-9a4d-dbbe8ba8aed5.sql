-- Fix infinite recursion in profiles RLS policies
-- First, create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing problematic admin policy and recreate with the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL
USING (public.get_current_user_role() IN ('admin', 'sub_admin'));

-- Create similar function for blog posts and bookings
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts 
FOR ALL
USING (public.get_current_user_role() IN ('admin', 'sub_admin'));

CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL
USING (public.get_current_user_role() IN ('admin', 'sub_admin'));
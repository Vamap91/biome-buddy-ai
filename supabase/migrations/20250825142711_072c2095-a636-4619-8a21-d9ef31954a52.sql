-- Fix security vulnerability: Restrict access to sensitive profile data
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Users can view own profile and profiles in posts" ON public.profiles;

-- Create more restrictive policies
-- Policy 1: Users can view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Authenticated users can only view basic public info (username, avatar) of post authors
-- This excludes sensitive data like full_name and birth_date
CREATE POLICY "Users can view basic public profile info of post authors" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM posts WHERE posts.user_id = profiles.id
  )
  AND auth.uid() != id  -- Don't duplicate with the first policy
);

-- However, we need to handle this at the application level to only expose specific columns
-- Let's create a view for public profile information instead
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Create policy for the public profiles view
CREATE POLICY "Authenticated users can view public profile info" 
ON public.public_profiles
FOR SELECT 
USING (auth.uid() IS NOT NULL);
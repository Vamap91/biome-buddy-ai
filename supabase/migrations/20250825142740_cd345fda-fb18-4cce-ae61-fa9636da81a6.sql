-- Fix security vulnerability: Restrict access to sensitive profile data
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Users can view own profile and profiles in posts" ON public.profiles;

-- Create more restrictive policy: Users can only view their own complete profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a separate function to get safe public profile info for posts display
CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.username,
    p.avatar_url
  FROM public.profiles p
  WHERE p.id = profile_user_id
  AND EXISTS (SELECT 1 FROM public.posts WHERE user_id = p.id);
$$;
-- Fix security issue: Restrict profile visibility to authenticated users only
DROP POLICY IF EXISTS "Users can view own profile and profiles in posts" ON public.profiles;

-- Create new secure policy that requires authentication to view other users' profiles
CREATE POLICY "Users can view own profile and profiles in posts" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = id) OR 
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM posts WHERE posts.user_id = profiles.id
  ))
);
-- Fix search path security warning for the function
CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT 
    p.id,
    p.username,
    p.avatar_url
  FROM public.profiles p
  WHERE p.id = profile_user_id
  AND EXISTS (SELECT 1 FROM public.posts WHERE user_id = p.id);
$$;
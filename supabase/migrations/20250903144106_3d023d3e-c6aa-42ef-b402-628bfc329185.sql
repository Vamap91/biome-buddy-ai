-- Fix the remaining function security issue
-- Update the get_public_profile_info function to set proper search_path

CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_user_id uuid)
 RETURNS TABLE(id uuid, username text, avatar_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.username,
    p.avatar_url
  FROM public.profiles p
  WHERE p.id = profile_user_id
  AND EXISTS (SELECT 1 FROM public.posts WHERE user_id = p.id);
$function$;
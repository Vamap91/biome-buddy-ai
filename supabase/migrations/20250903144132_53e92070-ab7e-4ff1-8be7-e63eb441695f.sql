-- Fix the last function security issue
-- Update the cleanup_old_failed_attempts function to set proper search_path

CREATE OR REPLACE FUNCTION public.cleanup_old_failed_attempts()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.failed_login_attempts 
  WHERE attempted_at < (now() - interval '24 hours');
END;
$function$;
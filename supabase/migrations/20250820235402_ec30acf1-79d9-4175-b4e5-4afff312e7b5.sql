-- Fix security issue: Remove conflicting policy and secure failed login attempts table

-- 1. Drop the problematic policy that allows unauthenticated inserts
DROP POLICY IF EXISTS "Secure failed login logging" ON public.failed_login_attempts;

-- 2. Ensure the log_failed_login_attempt function has proper security
-- Update function to include search_path for security
CREATE OR REPLACE FUNCTION public.log_failed_login_attempt(
    p_email text,
    p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Only allow during authentication (no authenticated user)
    IF auth.uid() IS NOT NULL THEN
        RAISE EXCEPTION 'This function can only be called during authentication';
    END IF;
    
    INSERT INTO public.failed_login_attempts (email, user_agent, ip_address)
    VALUES (p_email, p_user_agent, inet_client_addr());
    
EXCEPTION
    WHEN OTHERS THEN
        -- Silently ignore errors to not break auth flow
        NULL;
END;
$$;

-- 3. Grant execute permission to public for the logging function only
GRANT EXECUTE ON FUNCTION public.log_failed_login_attempt TO public;
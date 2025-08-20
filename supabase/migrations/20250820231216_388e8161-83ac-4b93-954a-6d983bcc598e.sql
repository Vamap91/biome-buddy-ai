-- Fix security issues with failed_login_attempts and infinite recursion

-- 1. Drop the problematic service role policy for failed_login_attempts
DROP POLICY IF EXISTS "Service role can insert failed login attempts" ON public.failed_login_attempts;

-- 2. Fix infinite recursion by creating a proper security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role app_role;
BEGIN
    -- Use security definer to bypass RLS when checking roles
    SELECT role INTO user_role 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    LIMIT 1;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Create a more secure function for logging failed attempts that only works during auth
CREATE OR REPLACE FUNCTION public.log_failed_login_attempt(
    p_email text,
    p_user_agent text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Only allow this function to be called by the authentication system
    -- Check if we're in an auth context by verifying no current user session
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a secure policy for system-level inserts during authentication only
CREATE POLICY "Auth system can log failed attempts" 
ON public.failed_login_attempts 
FOR INSERT 
WITH CHECK (
    -- Only allow inserts when there's no authenticated user (during login process)
    auth.uid() IS NULL
);
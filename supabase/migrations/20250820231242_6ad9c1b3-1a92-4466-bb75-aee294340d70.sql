-- Fix security issues with failed_login_attempts and infinite recursion

-- 1. Drop existing policies for failed_login_attempts
DROP POLICY IF EXISTS "Service role can insert failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Auth system can log failed attempts" ON public.failed_login_attempts;

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

-- 3. Create a more secure function for logging failed attempts
CREATE OR REPLACE FUNCTION public.log_failed_login_attempt(
    p_email text,
    p_user_agent text DEFAULT NULL
)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create secure policy for authenticated logging only
CREATE POLICY "Secure failed login logging" 
ON public.failed_login_attempts 
FOR INSERT 
WITH CHECK (auth.uid() IS NULL);
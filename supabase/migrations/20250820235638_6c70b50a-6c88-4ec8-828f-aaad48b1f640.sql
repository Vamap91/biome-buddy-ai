-- Strengthen security for failed_login_attempts table

-- 1. Update the is_admin function to be more secure and explicit
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    user_role app_role;
    current_user_id uuid;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- If no user is authenticated, definitely not admin
    IF current_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check user role with explicit security context
    SELECT role INTO user_role 
    FROM public.user_roles 
    WHERE user_id = current_user_id 
    AND role = 'admin'::app_role
    LIMIT 1;
    
    -- Only return true if we found an admin role
    RETURN user_role = 'admin'::app_role;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error for debugging but always return false for security
        RETURN FALSE;
END;
$$;

-- 2. Create a stricter admin check function for failed login access
CREATE OR REPLACE FUNCTION public.can_access_security_logs()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    current_user_id uuid;
    admin_exists boolean;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Must be authenticated
    IF current_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if this specific user has admin role
    SELECT EXISTS(
        SELECT 1 FROM public.user_roles 
        WHERE user_id = current_user_id 
        AND role = 'admin'::app_role
    ) INTO admin_exists;
    
    RETURN admin_exists;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- 3. Drop existing policies and create more restrictive ones
DROP POLICY IF EXISTS "Only admins can view failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Only admins can insert failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Only admins can update failed login attempts" ON public.failed_login_attempts;
DROP POLICY IF EXISTS "Only admins can delete failed login attempts" ON public.failed_login_attempts;

-- 4. Create new, more restrictive policies
CREATE POLICY "Restricted admin access to security logs" 
ON public.failed_login_attempts 
FOR ALL
TO authenticated
USING (can_access_security_logs())
WITH CHECK (can_access_security_logs());

-- 5. Ensure only the logging function can insert during auth
-- (This was already handled in previous migration, but let's be explicit)
REVOKE ALL ON public.failed_login_attempts FROM public;
REVOKE ALL ON public.failed_login_attempts FROM authenticated;

-- 6. Grant minimal necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_failed_login_attempt TO public;
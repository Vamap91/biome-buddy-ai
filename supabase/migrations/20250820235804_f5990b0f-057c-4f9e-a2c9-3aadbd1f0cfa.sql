
-- Remover completamente a tabela failed_login_attempts e funções relacionadas por segurança

-- 1. Remover a tabela com dados sensíveis
DROP TABLE IF EXISTS public.failed_login_attempts CASCADE;

-- 2. Remover as funções relacionadas
DROP FUNCTION IF EXISTS public.cleanup_old_failed_attempts();
DROP FUNCTION IF EXISTS public.log_failed_login_attempt(text, text);
DROP FUNCTION IF EXISTS public.can_access_security_logs();

-- 3. Manter apenas as funções básicas de role sem referência à tabela removida
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
        RETURN FALSE;
END;
$$;

-- 4. Manter a função has_role para uso futuro
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = _role
    );
$$;


-- First, create an enum for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table to manage role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Create a security definer function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    );
$$;

-- Create a security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = _role
    );
$$;

-- Drop the existing restrictive policy on failed_login_attempts
DROP POLICY IF EXISTS "Only admins can view failed login attempts" ON public.failed_login_attempts;

-- Create proper admin-only policies for failed_login_attempts table
CREATE POLICY "Only admins can view failed login attempts"
ON public.failed_login_attempts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can insert failed login attempts"
ON public.failed_login_attempts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update failed login attempts"
ON public.failed_login_attempts
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can delete failed login attempts"
ON public.failed_login_attempts
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Allow service role to insert failed login attempts (for logging from edge functions)
CREATE POLICY "Service role can insert failed login attempts"
ON public.failed_login_attempts
FOR INSERT
TO service_role
WITH CHECK (true);

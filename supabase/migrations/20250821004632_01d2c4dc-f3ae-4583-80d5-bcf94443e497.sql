
-- Fix the posts table RLS policy to require authentication
DROP POLICY IF EXISTS "Authenticated users can view posts" ON public.posts;
CREATE POLICY "Authenticated users can view posts" 
  ON public.posts 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Add missing trigger for profile creation on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate security definer functions with proper search_path
DROP FUNCTION IF EXISTS public.has_role(app_role);
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = _role
    );
$$;

DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role app_role;
BEGIN
    SELECT role INTO user_role 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    LIMIT 1;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Make storage buckets private and add proper RLS policies
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('post-images', 'post-videos');

-- Create RLS policies for storage objects
CREATE POLICY "Authenticated users can view images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'post-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own videos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'post-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own videos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'post-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

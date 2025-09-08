-- Add RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Add RLS policy for admins to view all conversations
CREATE POLICY "Admins can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (is_admin());

-- Add RLS policy for admins to view all messages
CREATE POLICY "Admins can view all messages" 
ON public.messages 
FOR SELECT 
USING (is_admin());

-- Add RLS policy for admins to view all blog posts
CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_admin());
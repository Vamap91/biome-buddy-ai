
-- Remove a política que permite acesso anônimo aos posts
DROP POLICY IF EXISTS "Anonymous users can view recent posts" ON public.posts;

-- Garante que RLS está habilitado na tabela posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;


-- Corrige a política de visualização de likes para exigir autenticação
DROP POLICY IF EXISTS "Users can view all likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes" 
  ON public.post_likes 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Corrige a política de visualização de comentários para exigir autenticação  
DROP POLICY IF EXISTS "Users can view all comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments" 
  ON public.post_comments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

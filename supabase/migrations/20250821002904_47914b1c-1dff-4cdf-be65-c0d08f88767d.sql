
-- Criar tabela para os posts do blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para curtidas dos posts do blog
CREATE TABLE IF NOT EXISTS public.blog_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.blog_posts ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Criar tabela para comentários dos posts do blog
CREATE TABLE IF NOT EXISTS public.blog_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.blog_posts ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para blog_posts (todos podem visualizar, só o autor pode editar/deletar)
CREATE POLICY "Authenticated users can view all blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts" 
  ON public.blog_posts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts" 
  ON public.blog_posts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para blog_post_likes
CREATE POLICY "Authenticated users can view all blog post likes" 
  ON public.blog_post_likes 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own blog post likes" 
  ON public.blog_post_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog post likes" 
  ON public.blog_post_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para blog_post_comments
CREATE POLICY "Authenticated users can view all blog post comments" 
  ON public.blog_post_comments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own blog post comments" 
  ON public.blog_post_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog post comments" 
  ON public.blog_post_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog post comments" 
  ON public.blog_post_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_post_comments_updated_at BEFORE UPDATE ON public.blog_post_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Corrigir problema: "User Profile Data Exposed to All Visitors"
-- A tabela profiles atualmente permite que qualquer pessoa veja todos os perfis
-- Vamos restringir para que usuários só vejam perfis necessários

-- Remover a política atual que permite qualquer um ver perfis
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Criar nova política mais restritiva para visualização de perfis
CREATE POLICY "Users can view own profile and profiles in posts" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.user_id = profiles.id
    )
  );

-- Corrigir problema: "All User Posts Accessible Without Authentication" 
-- Atualmente posts são públicos, vamos manter mas com mais controle
-- Remover política atual
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

-- Criar política que requer autenticação para ver posts
CREATE POLICY "Authenticated users can view posts" 
  ON public.posts 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Adicionar política para usuários não autenticados verem apenas posts recentes (últimos 30 dias)
CREATE POLICY "Anonymous users can view recent posts" 
  ON public.posts 
  FOR SELECT 
  TO anon
  USING (created_at >= (now() - interval '30 days'));

-- Corrigir problema: "Auth OTP long expiry"
-- Isso precisa ser configurado no painel do Supabase, mas vamos adicionar algumas medidas de segurança

-- Adicionar tabela para rastrear tentativas de login falhadas
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT
);

-- Habilitar RLS na tabela de tentativas de login
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem ver tentativas de login falhadas
CREATE POLICY "Only admins can view failed login attempts" 
  ON public.failed_login_attempts 
  FOR SELECT 
  USING (false); -- Por enquanto, ninguém pode ver até implementarmos roles de admin

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_failed_login_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_time ON public.failed_login_attempts(attempted_at);

-- Função para limpar tentativas antigas (mais de 24 horas)
CREATE OR REPLACE FUNCTION public.cleanup_old_failed_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.failed_login_attempts 
  WHERE attempted_at < (now() - interval '24 hours');
END;
$$;

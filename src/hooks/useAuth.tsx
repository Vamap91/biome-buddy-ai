
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Verificando sessão inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Erro ao obter sessão:', error);
          } else {
            setUser(session?.user ?? null);
            console.log('Sessão inicial carregada:', session?.user?.email || 'Nenhum usuário');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro inesperado ao obter sessão:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Estado de autenticação mudou:', event, session?.user?.email || 'Nenhum usuário');
        
        // Only update state for meaningful changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
        }
        
        // Only set loading to false after initial session is processed
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Iniciando processo de login para:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erro no login:', error);
      setLoading(false);
    } else {
      console.log('Login realizado com sucesso');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Iniciando processo de cadastro para:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      console.error('Erro no cadastro:', error);
    } else {
      console.log('Cadastro realizado com sucesso');
    }
    
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      console.log('Logout realizado com sucesso');
    } else {
      console.error('Erro no logout:', error);
      setLoading(false);
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    console.log('Iniciando login com Google...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Erro no login com Google:', error);
        setLoading(false);
        return { error };
      }

      console.log('Login com Google iniciado');
      return { error: null };
    } catch (err) {
      console.error('Erro inesperado no login com Google:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};


import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Estado de autenticação mudou:', event, session?.user?.email || 'Nenhum usuário');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Verificando sessão inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Erro ao obter sessão:', error);
          } else {
            setSession(session);
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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Iniciando processo de login para:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro no login:', error);
        setLoading(false);
        return { error };
      } else {
        console.log('Login realizado com sucesso para:', data.user?.email);
        return { error: null };
      }
    } catch (err) {
      console.error('Erro inesperado no login:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Iniciando processo de cadastro para:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error('Erro no cadastro:', error);
        setLoading(false);
        return { error };
      } else {
        console.log('Cadastro realizado com sucesso para:', data.user?.email);
        setLoading(false);
        return { error: null };
      }
    } catch (err) {
      console.error('Erro inesperado no cadastro:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        console.log('Logout realizado com sucesso');
      } else {
        console.error('Erro no logout:', error);
        setLoading(false);
      }
      
      return { error };
    } catch (err) {
      console.error('Erro inesperado no logout:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
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

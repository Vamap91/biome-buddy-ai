
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
        
        console.log('Auth state changed:', event, session ? 'User authenticated' : 'No user');
        
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
        console.log('Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            console.log('Initial session loaded:', session ? 'User found' : 'No user');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
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
    console.log('Starting login process');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        setLoading(false);
        return { error };
      } else {
        console.log('Login successful');
        return { error: null };
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Starting signup process');
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
        console.error('Signup error:', error.message);
        setLoading(false);
        return { error };
      } else {
        console.log('Signup successful');
        setLoading(false);
        return { error: null };
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setLoading(false);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    console.log('Logging out...');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        console.log('Logout successful');
      } else {
        console.error('Logout error:', error.message);
        setLoading(false);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected logout error:', err);
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

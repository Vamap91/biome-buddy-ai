
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'failed_login' | 'suspicious_activity' | 'unauthorized_access';
  email?: string;
  details?: string;
}

export function useSecurityLogger() {
  const [isLogging, setIsLogging] = useState(false);

  const logFailedLoginAttempt = async (email: string, userAgent?: string) => {
    try {
      setIsLogging(true);
      
      // Log failed login attempt - this will use the service role policy
      // or admin policy if the user is an admin
      const { error } = await supabase
        .from('failed_login_attempts')
        .insert([
          {
            email,
            ip_address: null, // IP will be captured server-side
            user_agent: userAgent || navigator.userAgent,
          }
        ]);

      if (error) {
        console.error('Error logging failed login attempt:', error);
        // Don't throw error to avoid breaking login flow
      } else {
        console.log('Failed login attempt logged successfully');
      }
    } catch (err) {
      console.error('Unexpected error logging failed login:', err);
      // Don't throw error to avoid breaking login flow
    } finally {
      setIsLogging(false);
    }
  };

  const cleanupOldAttempts = async () => {
    try {
      // Only admins can call this function
      const { error } = await supabase.rpc('cleanup_old_failed_attempts');
      if (error) {
        console.error('Error cleaning up old failed attempts:', error);
      } else {
        console.log('Old failed attempts cleaned up successfully');
      }
    } catch (err) {
      console.error('Unexpected error cleaning up attempts:', err);
    }
  };

  const getFailedLoginAttempts = async () => {
    try {
      // Only admins can view failed login attempts
      const { data, error } = await supabase
        .from('failed_login_attempts')
        .select('*')
        .order('attempted_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching failed login attempts:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching failed login attempts:', err);
      return [];
    }
  };

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) {
        console.error('Error checking user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (err) {
      console.error('Unexpected error checking user role:', err);
      return null;
    }
  };

  // Clean up old attempts on component mount (only for admins)
  useEffect(() => {
    const initCleanup = async () => {
      const role = await checkUserRole();
      if (role === 'admin') {
        cleanupOldAttempts();
      }
    };
    
    initCleanup();
  }, []);

  return {
    logFailedLoginAttempt,
    cleanupOldAttempts,
    getFailedLoginAttempts,
    checkUserRole,
    isLogging,
  };
}

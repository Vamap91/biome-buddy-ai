
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
      
      // Log failed login attempt
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
      }
    } catch (err) {
      console.error('Unexpected error logging failed login:', err);
    } finally {
      setIsLogging(false);
    }
  };

  const cleanupOldAttempts = async () => {
    try {
      const { error } = await supabase.rpc('cleanup_old_failed_attempts');
      if (error) {
        console.error('Error cleaning up old failed attempts:', error);
      }
    } catch (err) {
      console.error('Unexpected error cleaning up attempts:', err);
    }
  };

  // Clean up old attempts on component mount
  useEffect(() => {
    cleanupOldAttempts();
  }, []);

  return {
    logFailedLoginAttempt,
    cleanupOldAttempts,
    isLogging,
  };
}

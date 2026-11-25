import type { Session } from '@supabase/supabase-js';
import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { AuthContext } from './useAuth';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Supabase sends the initial session and any later auth changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInUser = async (email: string, password: string) => {
    try {
      // supabase method
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // handle supabase error explicity
      if (error) {
        console.error('Supabase sign-in error:', error.message);
        return error.message;
      }

      //success
      console.log('Supabase sign-in success', data.session);
      return data.session;
    } catch (error) {
      // unexpected error
      console.error('Unexpected error during sign-in:', error);
      return 'Failed to sign in. Please try again.';
    }
  };

  return (
    <AuthContext.Provider value={{ session, signInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

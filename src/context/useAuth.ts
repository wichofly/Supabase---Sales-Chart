import type { AuthTokenResponsePassword, Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

type AuthContextValue = {
  // undefined: loading, null: signed out, Session: signed in.
  session: Session | null | undefined;
  signInUser: (
    email: string,
    password: string,
  ) => Promise<AuthTokenResponsePassword>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }

  return context;
};

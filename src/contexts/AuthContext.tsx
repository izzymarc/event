import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { AUTH_ERROR_MESSAGES } from '../lib/constants';
import { useToast } from '../lib/hooks/useToast';

type UserWithRole = User & {
  role?: 'client' | 'vendor';
  full_name?: string;
  avatar_url?: string | null;
  availability_status?: string;
};

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'client' | 'vendor', fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: UserWithRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUserDetails = async (userId: string) => {
    try {
      console.log('Fetching user details for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('role, full_name, avatar_url, availability_status')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      console.log('User details fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: any) => {
    try {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        localStorage.removeItem(CACHE_KEY);
        return;
      }

      if (session?.user) {
        const details = await fetchUserDetails(session.user.id);
        const userData = details ? { ...session.user, ...details } : session.user;
        setUser(userData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem(CACHE_KEY);
      }
    } catch (error) {
      console.error('Error handling auth state change:', error);
      setUser(null);
      localStorage.removeItem(CACHE_KEY);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        console.log('Initializing auth state');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (sessionError instanceof AuthError && sessionError.status === 400) {
            localStorage.removeItem(CACHE_KEY);
            setUser(null);
          }
          throw sessionError;
        }

        if (!mounted) return;

        if (session?.user) {
          const details = await fetchUserDetails(session.user.id);
          const userData = details ? { ...session.user, ...details } : session.user;
          setUser(userData);
          localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem(CACHE_KEY);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (error instanceof AuthError && error.status === 400) {
          addToast('Session expired. Please sign in again.', 'info');
        }
        setUser(null);
        localStorage.removeItem(CACHE_KEY);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Auth initialization complete, loading set to false');
        }
      }
    }

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [addToast]);

  const value = useMemo(() => ({
    user,
    loading,
    updateUser: (userData: UserWithRole) => {
      setUser(userData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
    },
    signUp: async (email: string, password: string, role: 'client' | 'vendor', fullName: string) => {
      try {
        console.log('Signing up user:', email, role);
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role }
          }
        });

        if (authError) {
          console.error('Signup error:', authError);
          throw authError;
        }
        if (!authData.user) throw new Error(AUTH_ERROR_MESSAGES.GENERIC_ERROR);

        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            role,
            full_name: fullName,
            availability_status: 'online'
          }]);

        if (profileError) {
          console.error('Error inserting user profile:', profileError);
          throw profileError;
        }

        const userData = { ...authData.user, role, full_name: fullName, availability_status: 'online' };
        setUser(userData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
        addToast('Account created successfully!', 'success');
      } catch (error: any) {
        console.error('Signup error:', error);
        addToast(error.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR, 'error');
        throw error;
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        console.log('Signing in user:', email);
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Signin error:', signInError);
          throw signInError;
        }
        if (!data.user) throw new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);

        const details = await fetchUserDetails(data.user.id);
         if (!details) throw new Error('Failed to fetch user details');

        const userData = { ...data.user, ...details };
        setUser(userData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
        addToast('Welcome back!', 'success');
      } catch (error: any) {
        console.error('Signin error:', error);
        addToast(error.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS, 'error');
        throw error;
      }
    },
    signOut: async () => {
      try {
        console.log('Signing out user');
        await supabase.auth.signOut();
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        addToast('You have been signed out successfully', 'info');
      } catch (error: any) {
        console.error('Signout error:', error);
        addToast(error.message || 'Error signing out', 'error');
        throw error;
      }
    }
  }), [user, loading, addToast]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Client-side configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Server-side configuration
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY 
  || (typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : null);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase client environment variables');
}

if (typeof window === 'undefined' && !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase service role key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Admin client for server-side operations
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

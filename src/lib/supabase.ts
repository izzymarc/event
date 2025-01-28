// Import the createClient function from the Supabase client library
import { createClient } from '@supabase/supabase-js';
// Import the Database interface from the database types file
import { Database } from './database.types';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if Supabase URL or anon key is missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the provided URL and anon key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

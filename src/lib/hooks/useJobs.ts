// Import necessary React hooks and Supabase client
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { useAuth } from '../../contexts/AuthContext';

// Define a custom hook for fetching and managing jobs
export function useJobs(options = { limit: 10, page: 0 }) {
  // State variables for jobs, loading, error, and total count
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  // Get user from AuthContext
  const { user } = useAuth();
  // Get addToast function from useToast hook
  const { addToast } = useToast();

  // Function to fetch jobs from Supabase
  const fetchJobs = async () => {
    try {
      // Set loading state to true and clear any previous errors
      setLoading(true);
      setError(null);

      // Build the Supabase query
      let query = supabase
        .from('jobs')
        .select('*, users!jobs_client_id_fkey(full_name)', { count: 'exact' });

      // If user is a client, only show their jobs
      if (user?.role === 'client') {
        query = query.eq('client_id', user.id);
      }

      // Add pagination
      const from = options.page * options.limit;
      query = query
        .range(from, from + options.limit - 1)
        .order('created_at', { ascending: false });

      // Execute the query
      const { data, error, count } = await query;

      // Throw error if query fails
      if (error) throw error;

      // Update state with fetched data
      setJobs(data || []);
      if (count !== null) setTotalCount(count);
    } catch (err: any) {
      // Log the error, set error state, and display a toast
      console.error('Error fetching jobs:', err);
      setError(err.message);
      addToast('Failed to load jobs', 'error');
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // useEffect hook to fetch jobs and set up real-time subscription
  useEffect(() => {
    // Fetch jobs on mount
    fetchJobs();

    // Set up real-time subscription
    const subscription = supabase
      .channel('jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setJobs(prev => [payload.new, ...prev]);
            setTotalCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(job => job.id !== payload.old.id));
            setTotalCount(prev => prev - 1);
          } else if (payload.eventType === 'UPDATE') {
            setJobs(prev => prev.map(job => 
              job.id === payload.new.id ? { ...job, ...payload.new } : job
            ));
          }
        }
      )
      .subscribe();

    // Unsubscribe from the channel on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, options.page, options.limit]);

  // Function to refresh jobs
  const refresh = () => {
    fetchJobs();
  };

  // Return the state variables and refresh function
  return {
    jobs,
    loading,
    error,
    totalCount,
    refresh
  };
}

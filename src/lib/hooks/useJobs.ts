import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { useAuth } from '../../contexts/AuthContext';

// Custom hook to fetch and manage jobs
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
      setLoading(true);
      setError(null);

      // Create a base query for jobs
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

      if (error) throw error;

      // Update state with fetched data
      setJobs(data || []);
      if (count !== null) setTotalCount(count);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      addToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on mount and when options or user changes
  useEffect(() => {
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

  // Return jobs, loading, error, total count, and refresh function
  return {
    jobs,
    loading,
    error,
    totalCount,
    refresh
  };
}

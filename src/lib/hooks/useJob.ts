import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { useAuth } from '../../contexts/AuthContext';

export function useJob(jobId: string) {
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_client_id_fkey (
            full_name,
            avatar_url
          ),
          job_skills (
            skill
          ),
          milestones (*)
        `)
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        setError(error.message);
        addToast('Failed to load job details', 'error');
        throw error;
      }

      setJob(data);
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError(err.message);
      addToast('Failed to load job details', 'error');
    } finally {
      setLoading(false);
    }
  }, [jobId, addToast]);

  // New function to check if the current user has submitted a proposal
  const hasUserSubmittedProposal = useCallback(async () => {
    if (!user || user.role !== 'vendor' || !jobId) {
      return false; // Not a vendor or no job ID
    }

    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('id')
        .eq('job_id', jobId)
        .eq('vendor_id', user.id)
        .maybeSingle(); // Use maybeSingle

      if (error) {
        console.error("Error checking for existing proposal:", error);
        addToast('Failed to check for existing proposal', 'error');
        return false; // Assume no proposal on error
      }

      return !!data; // Return true if data exists (proposal found)
    } catch (error) {
      console.error("Error checking for existing proposal:", error);
      addToast('Failed to check for existing proposal', 'error');
      return false; // Assume no proposal on error
    }
  }, [user, jobId, addToast]);

  useEffect(() => {
    fetchJob();

    const subscription = supabase
      .channel(`job_${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `id=eq.${jobId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setJob(prev => ({ ...prev, ...payload.new }));
          } else if (payload.eventType === 'DELETE') {
            setJob(null);
            addToast('This job has been deleted', 'info');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchJob, jobId, addToast]);

  const refresh = useCallback(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refresh,
    hasUserSubmittedProposal // Expose the new function
  };
}

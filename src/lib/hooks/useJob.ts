import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';

export function useJob(jobId: string) {
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

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

  useEffect(() => {
    fetchJob();

    // Set up real-time subscription for job updates (no changes needed here)
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
  }, [fetchJob, jobId]);

  const refresh = useCallback(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refresh
  };
}

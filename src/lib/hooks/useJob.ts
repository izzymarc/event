import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';

export function useJob(jobId: string) {
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchJob = async () => {
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
          )
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;

      setJob(data);
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError(err.message);
      addToast('Failed to load job details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();

    // Set up real-time subscription for job updates
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
  }, [jobId]);

  const refresh = () => {
    fetchJob();
  };

  return {
    job,
    loading,
    error,
    refresh
  };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export function useProposals(jobId: string) {
  const [proposals, setProposals] = useState<any[] | null>(null); // Use any for now, refine later
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          vendor:users!proposals_vendor_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) throw error;
      setProposals(data);
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchProposals();

    // Set up real-time subscription for new/updated/deleted proposals
    const subscription = supabase
      .channel(`proposals_for_job_${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProposals(prev => [...(prev || []), payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setProposals(prev =>
              prev
                ? prev.map(p => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
                : []
            );
          } else if (payload.eventType === 'DELETE') {
            setProposals(prev => prev ? prev.filter(p => p.id !== payload.old.id) : []);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProposals, jobId]);

  return {
    proposals,
    loading,
    error,
    refresh: fetchProposals, // Expose a refresh function
  };
}

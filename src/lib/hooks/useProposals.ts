import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { useAuth } from '../../contexts/AuthContext';

export function useProposals(jobId?: string) {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('proposals')
        .select(`
          *,
          users!proposals_vendor_id_fkey (
            full_name,
            avatar_url
          ),
          jobs (
            title,
            budget,
            client_id
          )
        `);

      // Filter by job if jobId is provided
      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      // Filter based on user role
      if (user?.role === 'client') {
        query = query.eq('jobs.client_id', user.id);
      } else if (user?.role === 'vendor') {
        query = query.eq('vendor_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching proposals:', error);
        setError(error.message);
        addToast('Failed to load proposals', 'error');
        throw error;
      }

      setProposals(data || []);
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
      setError(err.message);
      addToast('Failed to load proposals', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, jobId, addToast]);

  useEffect(() => {
    fetchProposals();

    // Set up real-time subscription
    const subscription = supabase
      .channel('proposals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: jobId ? `job_id=eq.${jobId}` : undefined
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProposals(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setProposals(prev => prev.filter(p => p.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setProposals(prev => prev.map(p => 
              p.id === payload.new.id ? { ...p, ...payload.new } : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProposals, user?.id, jobId]);

  const refresh = useCallback(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    proposals,
    loading,
    error,
    refresh
  };
}

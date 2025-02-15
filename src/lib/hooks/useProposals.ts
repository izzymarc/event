import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export function useProposals(jobId: string) {
  const [proposals, setProposals] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableExistsTest, setTableExistsTest] = useState<boolean | null>(null); // State for table existence test

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Call RPC function to test if table exists
      const { data: existsData, error: existsError } = await supabase.rpc('test_table_exists', {
        table_name: 'proposal_portfolio_items',
      });

      if (existsError) {
        console.error('Error testing table existence:', existsError);
        setError(existsError.message);
        setLoading(false);
        return; // Exit early if table existence test fails
      }

      setTableExistsTest(existsData); // Set the result of the table existence test

      // Original query - commented out for now during testing
      /* const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          vendor:users!proposals_vendor_id_fkey (
            full_name,
            avatar_url
          ),
          portfolio_items:proposal_portfolio_items!inner(
            portfolio_items(*)
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data); */


      // For now, just set proposals to null or empty array for testing
      setProposals(existsData ? [] : null);


    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchProposals();

    // Set up real-time subscription - Keeping it, but might not be relevant for this test
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
          } // ... (rest of the subscription logic)
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
    refresh: fetchProposals,
    tableExistsTest // Expose the table existence test result
  };
}

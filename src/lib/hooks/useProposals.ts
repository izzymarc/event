import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export function useProposals(jobId: string) {
  const [proposals, setProposals] = useState<any[] | null>(null);
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
          ),
          portfolio_items:proposal_portfolio_items!inner(
            portfolio_items(*)  // Changed to portfolio_items (plural) here
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

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
    refresh: fetchProposals,
  };
}
</boltArtifact>
```

**Key Change:**

*   **Updated Relationship Name to Plural:** In `src/lib/hooks/useProposals.ts`, line 20, we've changed `portfolio_item(*)` to `portfolio_items(*)` within the `select` query:

    ```diff
    -         portfolio_items:proposal_portfolio_items!inner(
    -           portfolio_item(*)
    -         )
    +         portfolio_items:proposal_portfolio_items!inner(
    +           portfolio_items(*) // Changed to portfolio_items (plural)
    +         )
    ```

    This correction assumes that the actual relationship name in your Supabase database schema is indeed plural (`portfolio_items`) and not singular (`portfolio_item`).

**Instructions:**

1.  **Apply the `fix-pluralization-useproposals-query` artifact:** This will update the `useProposals.ts` file with the corrected relationship name.
2.  **Test Again:** After applying the artifact, please check if the preview error in the `ProposalList` component is now resolved.

If this correction fixes the error, it would confirm that the issue was indeed a pluralization mismatch in the relationship name within the Supabase query. If the error still persists, we will need to explore other potential causes, but this is the most likely culprit based on the error messages and diagnosis.

Let me know if this resolves the issue!
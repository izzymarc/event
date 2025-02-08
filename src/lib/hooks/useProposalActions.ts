import { useState } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { proposalSchema } from '../validation/schemas';

export function useProposalActions() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const createProposal = async (proposalData: any) => {
    setLoading(true);
    try {
      // Validate proposal data (using the existing schema, though we might need to adjust it)
      const validatedData = proposalSchema.parse(proposalData);

      const { data, error } = await supabase
        .from('proposals')
        .insert([validatedData])
        .select() // Add .select() to get the inserted row
        .single(); // Add .single() because we expect only one row

      if (error) throw error;

      addToast('Proposal submitted successfully!', 'success');
      return true; // Indicate success
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      addToast(error.message || 'Failed to submit proposal', 'error');
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  // Add other proposal-related actions here (update, delete, etc.) as needed

  return {
    loading,
    createProposal,
    // Add other actions here
  };
}

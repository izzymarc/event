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
      // Validate proposal data (using the existing schema, though we might need to adjust it later)
      const validatedData = proposalSchema.parse(proposalData);

      const { data: proposal, error } = await supabase // Renamed data to proposal to avoid shadowing
        .from('proposals')
        .insert([
          {
            job_id: validatedData.job_id,
            vendor_id: validatedData.vendor_id,
            content: validatedData.content,
            price: validatedData.price,
            cover_letter: proposalData.cover_letter // Include cover_letter
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Handle portfolio item IDs separately after proposal creation
      if (proposalData.portfolio_item_ids && proposalData.portfolio_item_ids.length > 0) {
        const portfolioItemsInsert = proposalData.portfolio_item_ids.map((portfolioId: string) => ({
          proposal_id: proposal.id,
          portfolio_item_id: portfolioId,
        }));
        const { error: portfolioItemsError } = await supabase
          .from('proposal_portfolio_items')
          .insert(portfolioItemsInsert);

        if (portfolioItemsError) throw portfolioItemsError;
      }


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

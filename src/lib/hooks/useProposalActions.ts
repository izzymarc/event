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
      const validatedData = proposalSchema.parse(proposalData);
      
      const { error } = await supabase
        .from('proposals')
        .insert(validatedData);

      if (error) throw error;
      
      addToast('Proposal submitted successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      addToast(error.message || 'Failed to submit proposal', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (proposalId: string, proposalData: any) => {
    setLoading(true);
    try {
      const validatedData = proposalSchema.parse(proposalData);
      
      const { error } = await supabase
        .from('proposals')
        .update(validatedData)
        .eq('id', proposalId);

      if (error) throw error;
      
      addToast('Proposal updated successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error updating proposal:', error);
      addToast(error.message || 'Failed to update proposal', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const withdrawProposal = async (proposalId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);

      if (error) throw error;
      
      addToast('Proposal withdrawn successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error withdrawing proposal:', error);
      addToast(error.message || 'Failed to withdraw proposal', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProposal,
    updateProposal,
    withdrawProposal
  };
}

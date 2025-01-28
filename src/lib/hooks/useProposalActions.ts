
import { useState } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { proposalSchema } from '../validation/schemas';

// Custom hook to manage proposal actions
export function useProposalActions() {
  // State variable for loading state
  const [loading, setLoading] = useState(false);
  // Get addToast function from useToast hook
  const { addToast } = useToast();

  // Function to create a new proposal
  const createProposal = async (proposalData: any) => {
    setLoading(true);
    try {
      // Validate proposal data using Zod schema
      const validatedData = proposalSchema.parse(proposalData);
      
      // Insert the validated data into the 'proposals' table
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

  // Function to update an existing proposal
  const updateProposal = async (proposalId: string, proposalData: any) => {
    setLoading(true);
    try {
      // Validate proposal data using Zod schema
      const validatedData = proposalSchema.parse(proposalData);
      
      // Update the proposal in the 'proposals' table
      const { error } = await supabase
        .from('proposals')
        .update(validatedData)
        .eq('id', proposalId);

      if (error) throw error;
      
      addToast('Proposal updated successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error updating proposal:', error);
      addToast(error.message || '
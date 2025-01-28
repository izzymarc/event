import { useState } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';
import { jobSchema } from '../validation/schemas';

export function useJobActions() {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const createJob = async (jobData: any) => {
    setLoading(true);
    try {
      const validatedData = jobSchema.parse(jobData);
      
      const { error } = await supabase
        .from('jobs')
        .insert(validatedData);

      if (error) throw error;
      
      addToast('Job created successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error creating job:', error);
      addToast(error.message || 'Failed to create job', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (jobId: string, jobData: any) => {
    setLoading(true);
    try {
      const validatedData = jobSchema.parse(jobData);
      
      const { error } = await supabase
        .from('jobs')
        .update(validatedData)
        .eq('id', jobId);

      if (error) throw error;
      
      addToast('Job updated successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error updating job:', error);
      addToast(error.message || 'Failed to update job', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      addToast('Job deleted successfully', 'success');
      return true;
    } catch (error: any) {
      console.error('Error deleting job:', error);
      addToast(error.message || 'Failed to delete job', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createJob,
    updateJob,
    deleteJob
  };
}

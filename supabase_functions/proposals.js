// supabase_functions/proposals.js
import { supabase } from '../lib/supabase';
import { handleApiError } from './utils';

// Submit a proposal
export async function createProposal(req, res) {
  try {
    const proposalData = req.body; // Assuming proposal data is in the request body
    const { data, error } = await supabase
      .from('proposals')
      .insert([proposalData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data); // 201 Created
  } catch (error) {
    handleApiError(error, res);
  }
}

// Get a proposal by ID
export async function getProposal(req, res) {
  try {
    const proposalId = req.params.id; // Assuming proposal ID is in the URL params
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// List proposals for a job
export async function listProposalsForJob(req, res) {
  try {
    const jobId = req.params.jobId; // Assuming job ID is in the URL params
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('job_id', jobId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Update a proposal
export async function updateProposal(req, res) {
  try {
    const proposalId = req.params.id; // Assuming proposal ID is in the URL params
    const proposalData = req.body; // Assuming updated proposal data is in the request body

    const { data, error } = await supabase
      .from('proposals')
      .update(proposalData)
      .eq('id', proposalId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Delete a proposal
export async function deleteProposal(req, res) {
  try {
    const proposalId = req.params.id; // Assuming proposal ID is in the URL params

    const { data, error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    handleApiError(error, res);
  }
}

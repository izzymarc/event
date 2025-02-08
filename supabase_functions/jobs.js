// supabase_functions/jobs.js
import { supabase } from '../lib/supabase';
import { handleApiError } from './utils';

// Create a new job
export async function createJob(req, res) {
  try {
    const jobData = req.body; // Assuming job data is in the request body
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data); // 201 Created
  } catch (error) {
    handleApiError(error, res);
  }
}

// Get a job by ID
export async function getJob(req, res) {
  try {
    const jobId = req.params.id; // Assuming job ID is in the URL params
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// List jobs with pagination and filters
export async function listJobs(req, res) {
  try {
    const { page = 1, limit = 10, category, experience_level } = req.query; // Assuming query parameters for pagination and filters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = supabase.from('jobs').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (experience_level) {
      query = query.eq('experience_level', experience_level);
    }

    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({ data, total: count });
  } catch (error) {
    handleApiError(error, res);
  }
}

// Update a job
export async function updateJob(req, res) {
  try {
    const jobId = req.params.id; // Assuming job ID is in the URL params
    const jobData = req.body; // Assuming updated job data is in the request body

    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Delete a job
export async function deleteJob(req, res) {
  try {
    const jobId = req.params.id; // Assuming job ID is in the URL params

    const { data, error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    handleApiError(error, res);
  }
}

// supabase_functions/users.js
import { supabase } from '../lib/supabase';
import { handleApiError } from './utils';

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const userId = req.params.id; // Assuming user ID is in the URL params
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id; // Assuming user ID is in the authenticated user object
    const profileData = req.body; // Assuming profile data is in the request body

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, ...profileData })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res);
  }
}

// Add more user-related API endpoints as needed (e.g., list users, delete user)

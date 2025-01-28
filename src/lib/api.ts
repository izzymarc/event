// Import supabase client
import { supabase } from './supabase';

// Function to update user profile
export async function updateProfile(userId: string, data: any) {
  try {
    // Update user data in the 'users' table
    const { error: userError } = await supabase
      .from('users')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      })
      .eq('id', userId);

    if (userError) throw userError;

    // Update profile data in the 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        bio: data.bio,
        hourly_rate: data.hourly_rate,
        skills: data.skills,
        portfolio_url: data.portfolio_url,
      });

    if (profileError) throw profileError;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
}

// Function to update user settings
export async function updateUserSettings(userId: string, settings: any) {
  try {
    // Update user settings in the 'user_settings' table
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        theme: settings.theme,
        language: settings.language,
        notifications: settings.notifications,
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating settings:', error);
    throw new Error(error.message || 'Failed to update settings');
  }
}

// Rate limiting for auth attempts
let authAttempts = new Map<string, { count: number; timestamp: number }>();

// Function to check rate limit for authentication attempts
export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempt = authAttempts.get(email);
  
  // If no previous attempt, create a new entry
  if (!attempt) {
    authAttempts.set(email, { count: 1, timestamp: now });
    return true;
  }

  // If last attempt was more than 15 minutes ago, reset the count
  if (now - attempt.timestamp > 15 * 60 * 1000) { // 15 minutes
    authAttempts.set(email, { count: 1, timestamp: now });
    return true;
  }

  // If the attempt count is greater than or equal to 5, return false
  if (attempt.count >= 5) {
    return false;
  }

  // Increment the attempt count and update the timestamp
  attempt.count++;
  authAttempts.set(email, attempt);
  return true;
}

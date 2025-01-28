// Add to existing api.ts file
export async function updateProfile(userId: string, data: any) {
  try {
    const { error: userError } = await supabase
      .from('users')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      })
      .eq('id', userId);

    if (userError) throw userError;

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

export async function updateUserSettings(userId: string, settings: any) {
  try {
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

// Add rate limiting for auth attempts
let authAttempts = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempt = authAttempts.get(email);
  
  if (!attempt) {
    authAttempts.set(email, { count: 1, timestamp: now });
    return true;
  }

  if (now - attempt.timestamp > 15 * 60 * 1000) { // 15 minutes
    authAttempts.set(email, { count: 1, timestamp: now });
    return true;
  }

  if (attempt.count >= 5) {
    return false;
  }

  attempt.count++;
  authAttempts.set(email, attempt);
  return true;
}

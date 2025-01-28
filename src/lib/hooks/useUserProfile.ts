import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useToast } from './useToast';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profiles (
            bio,
            hourly_rate,
            skills,
            portfolio_url
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        addToast('Failed to load user profile', 'error');
        throw error;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      addToast('Failed to load user profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, addToast]);

  useEffect(() => {
    fetchProfile();

    // Set up real-time subscription for profile updates
    const subscription = supabase
      .channel(`profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          setProfile(prev => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, userId]);

  const refresh = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refresh
  };
}

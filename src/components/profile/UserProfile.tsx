import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Briefcase,
  Mail,
  MapPin,
  Edit2,
  X,
  Check,
  Link as LinkIcon,
  Plus,
  Trash2,
  Award,
  GraduationCap,
  Star,
  Calendar,
  Building,
  FileText,
  ExternalLink,
  Clock,
  DollarSign,
  Globe
} from 'lucide-react';
import { useToast } from '../../lib/hooks/useToast';
import { profileSchema } from '../../lib/validation/schemas';

// ... (interfaces)

export default function UserProfile() {
  const { user } = useAuth(); // Use useAuth hook to get current user
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setLoading] = useState(false);
  const [profile, setProfile] = useState({ // Profile state
    full_name: user?.full_name || '', // Default from auth context
    title: '',
    location: '',
    bio: '',
    avatar_url: user?.avatar_url || '', // Default from auth context
    hourly_rate: 0,
    availability: 'available',
    languages: [] as string[],
    skills: [] as string[],
    portfolio_website_url: '',
    github_url: '',
    linkedin_url: ''
  });

  // ... (editingExperience, editingEducation, etc., newExperience, newEducation, etc.)

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return; // Exit if user or user.id is not available yet

    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id) // Fetch profile for the current user.id
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(prev => ({
          ...prev,
          ...profileData,
          hourly_rate: profileData.hourly_rate || 0,
          availability: profileData.availability || 'available',
          portfolio_website_url: profileData.portfolio_website_url || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || ''
        }));
      } else {
        setProfile(prev => ({ // Initialize with defaults if no profile data
          ...prev,
          hourly_rate: 0,
          availability: 'available',
          portfolio_website_url: '',
          linkedin_url: '',
          github_url: ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      addToast(error.message || 'Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, addToast]); // Dependency on user?.id

  useEffect(() => {
    fetchProfileData(); // Fetch profile data on component mount and when user?.id changes
  }, [fetchProfileData]);

  // ... (handleSave, handleAddExperience, etc. - no changes needed here)
  // ... (rest of the component - render function)

  return (
    <div className="max-w-7xl mx-auto">
      {/* ... (rest of the component) */}
    </div>
  );
}

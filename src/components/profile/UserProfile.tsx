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
import { profileSchema } from '../../lib/validation/schemas'; // Import profileSchema

// ... (interfaces: WorkExperience, Education, Certification, PortfolioItem)

export default function UserProfile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setLoading] = useState(false);

  // Basic Profile Information
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    title: '',
    location: '',
    bio: '',
    avatar_url: user?.avatar_url || '',
    hourly_rate: 0,
    availability: 'available',
    languages: [] as string[],
    skills: [] as string[],
    portfolio_website_url: '',
    github_url: '',
    linkedin_url: ''
  });

  // ... (workExperience, education, certifications, portfolioItems, editingStates, newItemStates, fetchProfileData - no changes needed here)


  async function handleSave() {
    setSaving(true);
    try {
      // Validate profile data against schema
      profileSchema.parse(profile); // Will throw error if invalid

      // Update basic profile - Include new fields in upsert
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
          hourly_rate: parseFloat(String(profile.hourly_rate)), // Ensure saving as number
        });

      if (profileError) throw profileError;

      // Update user data - Keep existing user data update
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        })
        .eq('id', user?.id);

      if (userError) throw userError;

      setIsEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }


  // ... (handleAddExperience, handleAddEducation, handleAddCertification, handleAddPortfolioItem - no changes needed here)
  // ... (rest of the component - render function remains mostly the same from previous step)
  // ... (JSX - no changes needed as UI was updated in previous step)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header - No changes needed here */}
      {/* ... */}

      {/* Profile Content - About, Experience, Education, etc. */}
      {/* ... */}

      {/* Modals for editing items - No changes needed here yet */}
      {/* ... */}
    </div>
  );
}

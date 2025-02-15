import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import ChangePasswordForm from '../auth/ChangePasswordForm';
import ServicePackages from './ServicePackages';
import { Rating } from '../ui/Rating';
import { formatDate, formatCurrency } from '../../lib/utils';

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId: profileUserId }) => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setLoading] = useState(false);
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
  const [vendorServicePackages, setVendorServicePackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileData = useCallback(async () => {
    const uid = profileUserId || user?.id;
    if (!uid) return;

    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (profileError) throw profileError;

      // Fetch user rating
      const { data: ratingData, error: ratingError } = await supabase.rpc('calculate_user_rating', {
        p_user_id: uid,
      });

      if (ratingError) {
        console.error('Error fetching user rating:', ratingError);
      }

       // Fetch review count
      const { data: countData, error: countError } = await supabase
        .from('user_ratings')
        .select('*', { count: 'exact', head: true })
        .eq('rated_id', uid);

      if (countError) {
        console.error('Error fetching review count:', countError);
      }


      if (profileData) {
        setProfile(prev => ({
          ...prev,
          ...profileData,
          rating: ratingData,
          hourly_rate: profileData.hourly_rate || 0,
          availability: profileData.availability || 'available',
          portfolio_website_url: profileData.portfolio_website_url || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          skills: profileData.skills || []
        }));
      }
      if (countData) {
        setReviewCount(countData);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      addToast(error.message || 'Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  }, [profileUserId, user?.id, addToast]);

  const fetchVendorServicePackages = useCallback(async () => {
    const uid = profileUserId || user?.id;
    if (!uid) return;

    setPackagesLoading(true);
    try {
      const { data: packagesData, error: packagesError } = await supabase
        .from('service_packages')
        .select('*')
        .eq('vendor_id', uid);

      if (packagesError) throw packagesError;
      setVendorServicePackages(packagesData || []);
    } catch (error: any) {
      console.error('Error fetching service packages:', error);
      addToast(error.message || 'Failed to load service packages', 'error');
    } finally {
      setPackagesLoading(false);
    }
  }, [profileUserId,  user?.id, addToast]);


  useEffect(() => {
    fetchProfileData();
    fetchVendorServicePackages();
  }, [fetchProfileData, fetchVendorServicePackages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setProfile(prevState => ({
      ...prevState,
      skills: skillsArray,
    }));
  };


  const handleSave = async () => {
    setLoading(true);
    setIsEditing(false);
    try {
      const validatedData = profileSchema.parse({
        ...profile,
        hourlyRate: parseFloat(String(profile.hourly_rate))
      });

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          full_name: validatedData.fullName,
          title: validatedData.title,
          bio: validatedData.bio,
          location: validatedData.location,
          hourly_rate: validatedData.hourlyRate,
          availability: validatedData.availability,
          skills: validatedData.skills,
          portfolio_website_url: validatedData.portfolio_website_url,
          linkedin_url: validatedData.linkedin_url,
          github_url: validatedData.github_url
        });

      if (updateError) throw updateError;

      if (user) {
        updateUser({ ...user, full_name: validatedData.fullName });
      }

      addToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Profile update error:', error);
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSaving(true); // Start saving/loading state
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${user?.id}/${Math.random()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const imageUrl = data.path

        // Update profile with avatar URL
        await supabase
          .from('profiles')
          .update({ avatar_url: imageUrl })
          .eq('user_id', user?.id);

        // Update user object in AuthContext and local state
        const updatedUser = { ...user, avatar_url: imageUrl };
        updateUser(updatedUser as any); // Explicitly cast to UserWithRole to avoid type issues
        setProfile(prevProfile => ({ ...prevProfile, avatar_url: imageUrl }));


        addToast('Profile picture updated!', 'success');
      } catch (uploadError: any) {
        console.error("Error uploading file: ", uploadError);
        addToast('Failed to upload profile picture.', 'error');
      } finally {
        setSaving(false); // End saving/loading state
      }
    }
  };


  const handleDeleteProfilePicture = async () => {
     setSaving(true); // Start saving/loading state
    try {
      const { error: deleteError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user?.id)

      if (deleteError) {
        throw deleteError;
      }

      // Update user object in AuthContext and local state
      const updatedUser = { ...user, avatar_url: null };
      updateUser(updatedUser as any); // Explicitly cast to UserWithRole
      setProfile(prevProfile => ({ ...prevProfile, avatar_url: null }));


      addToast('Profile picture deleted!', 'success');
    } catch (error: any) {
      console.error("Error deleting profile picture: ", error);
      addToast('Failed to delete profile picture.', 'error');
    } finally {
      setSaving(false); // End saving/loading state
    }
  };


  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 relative">
            <div className="h-20 w-20 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <Briefcase className="h-full w-full p-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            {isEditing && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                onClick={triggerFileInput}
                aria-label="Change profile picture" // Added aria-label for accessibility
              >
                <Camera className="h-4 w-4 text-white" />
              </motion.button>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.full_name || 'No Name'}</h2>
              <div className="mt-1 flex items-center">
                <Rating rating={profile.rating || 0} starSize={16} />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{profile.title || 'No title set'}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">{profile.bio || 'No bio available.'}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.location && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.availability && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Availability: {profile.availability}</span>
                </div>
              )}
              {profile.hourly_rate && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Hourly Rate: {formatCurrency(profile.hourly_rate)}</span>
                </div>
              )}
              {user && user.created_at && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since: {formatDate(user.created_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
         {isEditing && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                aria-label="Upload new profile picture" // Added aria-label for accessibility
              />
              {profile.avatar_url && (
                <motion.button
                  onClick={handleDeleteProfilePicture}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="Delete profile picture" // Added aria-label for accessibility
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Profile Picture
                </motion.button>
              )}
            </div>
          )}
        </div>

      {/* ... rest of the component */}
      <section className="mt-8">
        <ServicePackages vendorId={profileUserId || user?.id} isOwnProfile={!profileUserId} packages={vendorServicePackages} loading={packagesLoading} />
      </section>

       {/* Change Password Form */}
       <section className="mt-8">
          <ChangePasswordForm />
        </section>
    </div>
  );
};

export default UserProfile;

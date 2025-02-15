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
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input


  const fetchProfileData = useCallback(async () => {
    // ... (rest of fetchProfileData function remains the same)
  }, [profileUserId, user?.id, addToast]);

  const fetchVendorServicePackages = useCallback(async () => {
    // ... (rest of fetchVendorServicePackages function remains the same)
  }, [profileUserId,  user?.id, addToast]);


  useEffect(() => {
    fetchProfileData();
    fetchVendorServicePackages();
  }, [fetchProfileData, fetchVendorServicePackages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // ... (rest of handleInputChange function remains the same)
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (rest of handleSkillsChange function remains the same)
  };


  const handleSave = async () => {
    // ... (rest of handleSave function remains the same)
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here (next steps)
      console.log("Selected file:", file); // Placeholder for upload logic
      // For now, just set the profile avatar URL to a temporary value for testing UI
      const tempURL = URL.createObjectURL(file);
      setProfile(prevProfile => ({ ...prevProfile, avatar_url: tempURL }));
    }
  };

  const handleDeleteProfilePicture = () => {
    // Handle profile picture deletion logic here (next steps)
    console.log("Delete profile picture"); // Placeholder for delete logic
    // For now, just clear the profile avatar URL for testing UI
    setProfile(prevProfile => ({ ...prevProfile, avatar_url: null }));
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                onClick={triggerFileInput}
              >
                <Camera className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div>
              {/* ... name, rating, title ... */}
            </div>
            <div className="mt-4">
              {/* ... bio ... */}
            </div>

            {/* ... profile details grid ... */}
          </div>
        </div>
         {isEditing && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                className="hidden" // Hide the file input
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
              />
              {profile.avatar_url && (
                <motion.button
                  onClick={handleDeleteProfilePicture}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

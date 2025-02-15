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
import ChangePasswordForm from '../auth/ChangePasswordForm';
import ServicePackages from './ServicePackages'; // Keep ServicePackages import for now
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


  const fetchProfileData = useCallback(async () => {
    // We will add back the data fetching logic in the next step
  }, [profileUserId, user?.id, addToast]);

  const fetchVendorServicePackages = useCallback(async () => {
     // We will add back the data fetching logic in the next step
  }, [profileUserId,  user?.id, addToast]);


  useEffect(() => {
    // We will add back the data fetching logic in the next step
  }, [fetchProfileData, fetchVendorServicePackages]);


  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <Briefcase className="h-full w-full p-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
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
          </div>
        </div>
      </div>

      {/* We are keeping ServicePackages section out for now */}
      {/* <section className="mt-8">
        <ServicePackages vendorId={profileUserId || user?.id} isOwnProfile={!profileUserId} packages={vendorServicePackages} loading={packagesLoading} />
      </section> */}

       {/* Change Password Form - Keep this at the bottom */}
       <section className="mt-8">
          <ChangePasswordForm />
        </section>
    </div>
  );
};

export default UserProfile;

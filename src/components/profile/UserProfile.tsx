import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
    linkedin_url: '',
    rating: 0
  });
  const [vendorServicePackages, setVendorServicePackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // Destructure user object
  const userId = user?.id;

  const fetchProfileData = async () => { // Removed useCallback
    // We will add back the data fetching logic in the next step
  };

  const fetchVendorServicePackages = async () => { // Removed useCallback
     // We will add back the data fetching logic in the next step
  };


  return (
    <div className="max-w-7xl mx-auto">
      {/* Modern Profile Header */}
      <div className="bg-gray-100 dark:bg-gray-900 shadow rounded-lg overflow-hidden"> {/* Background color */}
        <div className="px-6 py-8"> {/* Increased padding */}
          <div className="relative">
            <div className="absolute top-0 left-0 -mt-16"> {/* Adjusted position and margin */}
              <div className="h-32 w-32 rounded-full border-4 border-accent-500 dark:border-accent-400 overflow-hidden"> {/* Larger avatar and accent border */}
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <Briefcase className="h-full w-full p-8 text-gray-500 dark:text-gray-400"></Briefcase>
                )}
              </div>
            </div>
            <div className="pl-40"> {/* Adjusted padding to align with larger avatar */}
              <div className="pt-4"> {/* Adjusted padding */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{profile.full_name || 'No Name'}</h2> {/* Larger font and heading font */}
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{profile.title || 'No title set'}</p> {/* Slightly larger title and margin */}
                <div className="mt-3 flex items-center"> {/* Increased margin */}
                  <Rating rating={profile.rating || 0} starSize={20} /> {/* Larger stars */}
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span> {/* Increased margin */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700"> {/* Increased padding */}
          <p className="text-lg text-gray-700 dark:text-gray-300">{profile.bio || 'No bio available.'}</p> {/* Slightly larger bio text */}
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

import React, { useState, useEffect } from 'react';
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
  DollarSign
} from 'lucide-react';
import { useToast } from '../../lib/hooks/useToast';

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies: string[];
}

export default function UserProfile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    portfolio_url: '',
    github_url: '',
    linkedin_url: ''
  });

  // Professional Information
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  // Editing States
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingCertification, setEditingCertification] = useState<string | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null);

  // New Item States
  const [newExperience, setNewExperience] = useState<Partial<WorkExperience>>({});
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({});
  const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({});

  useEffect(() => {
    fetchProfileData();
  }, [user?.id]);

  async function fetchProfileData() {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(prev => ({
          ...prev,
          ...profileData
        }));
      }

      // Fetch work experience
      const { data: experienceData, error: experienceError } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_date', { ascending: false });

      if (experienceError) throw experienceError;
      setWorkExperience(experienceData || []);

      // Fetch education
      const { data: educationData, error: educationError } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_date', { ascending: false });

      if (educationError) throw educationError;
      setEducation(educationData || []);

      // Fetch certifications
      const { data: certificationData, error: certificationError } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('issue_date', { ascending: false });

      if (certificationError) throw certificationError;
      setCertifications(certificationData || []);

      // Fetch portfolio items
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user?.id);

      if (portfolioError) throw portfolioError;
      setPortfolioItems(portfolioData || []);

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      addToast(error.message || 'Failed to load profile data', 'error');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Update basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile
        });

      if (profileError) throw profileError;

      // Update user data
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

  async function handleAddExperience() {
    try {
      const { data, error } = await supabase
        .from('work_experience')
        .insert({
          user_id: user?.id,
          ...newExperience
        })
        .select()
        .single();

      if (error) throw error;

      setWorkExperience(prev => [...prev, data]);
      setNewExperience({});
      addToast('Work experience added successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to add work experience', 'error');
    }
  }

  async function handleAddEducation() {
    try {
      const { data, error } = await supabase
        .from('education')
        .insert({
          user_id: user?.id,
          ...newEducation
        })
        .select()
        .single();

      if (error) throw error;

      setEducation(prev => [...prev, data]);
      setNewEducation({});
      addToast('Education added successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to add education', 'error');
    }
  }

  async function handleAddCertification() {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          user_id: user?.id,
          ...newCertification
        })
        .select()
        .single();

      if (error) throw error;

      setCertifications(prev => [...prev, data]);
      setNewCertification({});
      addToast('Certification added successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to add certification', 'error');
    }
  }

  async function handleAddPortfolioItem() {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          user_id: user?.id,
          ...newPortfolioItem
        })
        .select()
        .single();

      if (error) throw error;

      setPortfolioItems(prev => [...prev, data]);
      setNewPortfolioItem({});
      addToast('Portfolio item added successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to add portfolio item', 'error');
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg relative">
          {isEditing && (
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
              <Camera className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="-mt-16 relative">
                <div className="h-32 w-32 rounded-full ring-4 ring-white dark:ring-gray-800 bg-indigo-600 flex items-center justify-center relative">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {profile.full_name.charAt(0)}
                    </span>
                  )}
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg">
                      <Camera className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        className="text-2xl font-bold text-gray-900 dark:text-white w-full border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                        className="text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 bg-transparent"
                        placeholder="Your title"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {profile.full_name}
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400">{profile.title || 'Add your title'}</p>
                    </>
                  )}
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 bg-transparent"
                          placeholder="Your location"
                        />
                      ) : (
                        profile.location || 'Add your location'
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {user?.email}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <input
                          type="number"
                          value={profile.hourly_rate}
                          onChange={(e) => setProfile(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                          className="text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 bg-transparent"
                          placeholder="Your hourly rate"
                        />
                      ) : (
                        `$${profile.hourly_rate}/hr`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              {isEditing ? (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(false)}
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit2 className="h-5 w-5 mr-2" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* About */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{profile.bio || 'Add your bio'}</p>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Work Experience</h2>
              {isEditing && (
                <button
                  onClick={() => setEditingExperience('new')}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-6">
              {workExperience.map((experience) => (
                <div key={experience.id} className="relative">
                  {isEditing && (
                    <div className="absolute top-0 right-0 flex space-x-2">
                      <button
                        onClick={() => setEditingExperience(experience.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {experience.title} at {experience.company}
                    </h3>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(experience.startDate).toLocaleDateString()} -{' '}
                      {experience.current
                        ? 'Present'
                        : new Date(experience.endDate!).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Education</h2>
              {isEditing && (
                <button
                  onClick={() => setEditingEducation('new')}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </button>
              )}
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="relative">
                  {isEditing && (
                    <div className="absolute top-0 right-0 flex space-x-2">
                      <button
                        onClick={() => setEditingEducation(edu.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{edu.school}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {new Date(edu.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills</h2>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Add skills (comma separated)"
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    skills: e.target.value.split(',').map(s => s.trim())
                  }))}
                  className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Languages</h2>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Add languages (comma separated)"
                  value={profile.languages.join(', ')}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(l => l.trim())
                  }))}
                  className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Certifications</h2>
              {isEditing && (
                <button
                  onClick={() => setEditingCertification('new')}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </button>
              )}
            </div>
            <div className="space-y-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="relative">
                  {isEditing && (
                    <div className="absolute top-0 right-0 flex space-x-2">
                      <button
                        onClick={() => setEditingCertification(cert.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {cert.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{cert.issuer}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      {cert.expiryDate && ` - Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio</h2>
              {isEditing && (
                <button
                  onClick={() => setEditingPortfolio('new')}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex space-x-2 z-10">
                      <button
                        onClick={() => setEditingPortfolio(item.id)}
                        className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h -4 w-4" />
                      </button>
                    </div>
                  )}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h2>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio Website</label>
                    <input
                      type="url"
                      value={profile.portfolio_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
                    <input
                      type="url"
                      value={profile.github_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, github_url: e.target.value }))}
                      className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
                    <input
                      type="url"
                      value={profile.linkedin_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      className="mt-1 w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Portfolio Website
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals for editing items */}
      <AnimatePresence>
        {/* Work Experience Modal */}
        {editingExperience && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingExperience === 'new' ? 'Add Experience' : 'Edit Experience'}
              </h3>
              {/* Add form fields for work experience */}
            </motion.div>
          </div>
        )}

        {/* Education Modal */}
        {editingEducation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingEducation === 'new' ? 'Add Education' : 'Edit Education'}
              </h3>
              {/* Add form fields for education */}
            </motion.div>
          </div>
        )}

        {/* Certification Modal */}
        {editingCertification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingCertification === 'new' ? 'Add Certification' : 'Edit Certification'}
              </h3>
              {/* Add form fields for certification */}
            </motion.div>
          </div>
        )}

        {/* Portfolio Item Modal */}
        {editingPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingPortfolio === 'new' ? 'Add Portfolio Item' : 'Edit Portfolio Item'}
              </h3>
              {/* Add form fields for portfolio item */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

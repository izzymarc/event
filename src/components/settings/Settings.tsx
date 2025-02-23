import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase'; // Import supabase client
import {
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  LogOut,
  Save,
  Lock,
  Eye,
  BellRing,
  Smartphone,
  Keyboard,
  Monitor,
  Languages,
  Clock,
  MapPin,
  Trash2
} from 'lucide-react';
import ChangePasswordForm from '../auth/ChangePasswordForm';
import { useToast } from '../../lib/hooks/useToast';

export default function Settings() {
  const { user, signOut, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    avatar: user?.avatar_url || '/default-avatar.png'
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessagesFrom: 'everyone'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newMessages: true,
      jobUpdates: true,
      securityAlerts: true,
      marketingEmails: false
    },
    push: {
      newMessages: true,
      jobUpdates: true,
      securityAlerts: true
    },
    desktop: {
      enabled: true,
      sound: true,
      preview: true
    }
  });

  // Accessibility Settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save account settings
      const { error: accountError } = await supabase
        .from('users')
        .update({
          full_name: accountSettings.fullName,
          language: accountSettings.language,
          timezone: accountSettings.timezone
        })
        .eq('id', user?.id);

      if (accountError) throw accountError;

      // Save user preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          privacy: privacySettings,
          notifications: notificationSettings,
          accessibility: accessibilitySettings
        });

      if (preferencesError) throw preferencesError;

      addToast('Settings saved successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', user?.id);

        if (error) throw error;

        await signOut();
        navigate('/');
      } catch (error: any) {
        addToast(error.message || 'Failed to delete account', 'error');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              className="h-24 w-24 rounded-full border-4 border-white/20 shadow-lg"
              src={user?.avatar_url || '/default-avatar.png'}
              alt="User avatar"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.full_name || 'User Profile'}</h1>
            <p className="text-indigo-100 mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90">
          Account Settings
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Navigation */}
        <div className="hidden lg:block space-y-1">
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <User className="h-5 w-5 mr-3 inline-block" />
            Profile
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <Shield className="h-5 w-5 mr-3 inline-block" />
            Security
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <BellRing className="h-5 w-5 mr-3 inline-block" />
            Notifications
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <Globe className="h-5 w-5 mr-3 inline-block" />
            Privacy
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <Monitor className="h-5 w-5 mr-3 inline-block" />
            Appearance
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition-all hover:shadow-2xl">
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-2 flex items-center">
                <User className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your personal information to control your presence on EventWork.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="space-y-2">
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5 mr-1 inline-block align-middle text-gray-500 dark:text-gray-400" /> Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="full-name"
                    value={accountSettings.fullName}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="h-5 w-5 mr-1 inline-block align-middle text-gray-500 dark:text-gray-400" /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={accountSettings.email}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="h-5 w-5 mr-1 inline-block align-middle text-gray-500 dark:text-gray-400" /> Time Zone
                </label>
                <div className="relative">
                  <select
                    id="timezone"
                    value={accountSettings.timezone}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                  >
                    {/* {Intl.supportedValuesOf('timeZone').map((zone: string) => ( // Commented out to avoid error */}
                    {Intl.supportedValuesOf('timeZone').slice(0, 5).map((zone: string) => ( // Showing only first 5 for now
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Languages className="h-5 w-5 mr-1 inline-block align-middle text-gray-500 dark:text-gray-400" /> Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={accountSettings.language}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Privacy Settings
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control who can see your profile and activity on EventWork.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Visibility</label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show Online Status</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.showOnlineStatus}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show Last Seen</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.showLastSeen}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, showLastSeen: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Settings</h2>

            {/* Email Notifications */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Email Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, [key]: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Push Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.push).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          push: { ...prev.push, [key]: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Notifications */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Desktop Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.desktop).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          desktop: { ...prev.desktop, [key]: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Appearance
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customize the look and feel of EventWork to match your preferences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <div className="flex space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center px-4 py-2 rounded-md ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <Sun className="h-5 w-5 mr-2" />
                    Light
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <Moon className="h-5 w-5 mr-2" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                <select
                  value={accessibilitySettings.fontSize}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contrast</label>
                <select
                  value={accessibilitySettings.contrast}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, contrast: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Reduced Motion</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessibilitySettings.reducedMotion}
                    onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, reducedMotion: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security</h2>
            <div className="space-y-4">
              <ChangePasswordForm />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-200 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Delete Account</h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

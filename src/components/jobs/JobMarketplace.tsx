import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, DollarSign, Clock, MapPin, Star, ChevronDown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES, EVENT_TYPES } from '../../lib/constants';
import { supabase } from '../../lib/supabase'; // Import supabase
import { JobType } from '../../lib/types'; // Import JobType
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { fetchJobs } from '../../features/jobs/jobsSlice'; // Import fetchJobs thunk
import { RootState, AppDispatch } from '../../app/store'; // Import RootState and AppDispatch


export default function JobMarketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('testing');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); // Get dispatch with explicit type

  const jobs = useSelector((state: RootState) => state.jobs.jobs); // Get jobs from Redux state
  const loading = useSelector((state: RootState) => state.jobs.loading === 'pending'); // Get loading state from Redux

  useEffect(() => {
    dispatch(fetchJobs()); // Dispatch fetchJobs action on component mount
  }, [dispatch]); // Removed searchTerm from dependency array


  const categories = [
    { id: 'all', name: 'All Categories' },
    ...SERVICE_CATEGORIES
  ];

  const eventTypes = [
    { id: 'all', name: 'All Event Types' },
    ...EVENT_TYPES
  ];

  const experienceLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'entry', name: 'Entry Level' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' }
  ];

  const budgetRanges = [
    { id: 'all', name: 'All Budgets' },
    { id: '0-1000', name: 'Under $1,000' },
    { id: '1000-5000', name: '$1,000 - $5,000' },
    { id: '5000-10000', name: '$5,000 - $10,000' },
    { id: '10000+', name: '$10,000+' }
  ];

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch, searchTerm]); // Dispatch fetchJobs action on component mount


  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Marketplace</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Find the perfect job opportunity that matches your skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        {/* ... rest of the component */}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h2>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'active' // Corrected status comparison
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center  text-sm text-gray-500 dark:text-gray-400">
                      <div className="inline-flex items-center mr-4">
                        <Users className="h-4 w-4 mr-1" />
                        {job.client?.full_name}
                      </div>
                      <div className="inline-flex items-center mr-4">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {/* Optional chaining */}
                        {job.client?.rating !== undefined && job.client?.rating !== null ? `${job.client.rating}/5` : 'N/A'}
                      </div>
                      <div className="inline-flex items-center mr-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        Remote
                      </div>
                      <div className="inline-flex items-center mr-4">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.category}
                      </div>
                      <div className="inline-flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(job.created_at || '')} {/* Optional chaining and fallback */}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(job.budget)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Fixed Price
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {job.description.substring(0, 200)}...
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {job.experience_level}
                  </span>
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {job.event_type}
                  </span>
                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Proposals: {job.proposals_count}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

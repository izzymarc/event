import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, DollarSign, Clock, MapPin, Star, Award, ChevronDown, Users, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES, EVENT_TYPES } from '../../lib/constants';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  event_type: string;
  budget: number;
  deadline: string;
  status: string;
  experience_level: string;
  proposals_count: number;
  client: {
    full_name: string;
    rating: number;
  };
  created_at: string;
  milestones: any[];
}

// ... (rest of JobMarketplace component - no changes to state, filters, fetchJobs, filteredJobs)


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ... (Header, Search and Filters) */}

      {/* Job List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            {/* ... */}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {/* ... */}
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
                {/* ... (Job Title, Status, Client Info, Budget, Description, Categories) */}


                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {job.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {job.event_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {job.experience_level}
                  </span>
                </div>

                {/* Milestones Display - No changes here, keep brief display if needed or remove */}
                {job.milestones && job.milestones.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Milestones:</h4>
                    <ul className="list-disc pl-5">
                      {job.milestones.slice(0, 2).map((milestone: any) => ( // Display only first 2 milestones here
                        <li key={milestone.id} className="text-gray-600 dark:text-gray-300 truncate">
                          {milestone.title} - {formatCurrency(milestone.payment_amount)}
                        </li>
                      ))}
                      {job.milestones.length > 2 && (
                        <li className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer">
                          + {job.milestones.length - 2} more milestones
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {/* ... (Posted Date, Proposals Count) */}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`} // Updated link to navigate to JobDetailsPage
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

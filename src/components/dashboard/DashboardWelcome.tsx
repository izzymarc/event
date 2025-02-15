import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const DashboardWelcome = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-400 opacity-20 rounded-2xl"></div> {/* More vibrant, softer gradient */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white"> {/* Darker text color for better contrast */}
          Welcome back, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg"> {/* Darker text color for description */}
          {user?.role === 'client'
            ? "Here's what's happening with your projects today"
            : "Here's your professional overview for today"}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to={user?.role === 'client' ? '/jobs/new' : '/jobs'}
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors",
              "bg-white text-indigo-700 font-medium" // More prominent button style
            )}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            {user?.role === 'client' ? 'Post New Job' : 'Find Jobs'}
          </Link>
          <Link
            to="/messages"
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors",
              "bg-indigo-600 text-white font-medium" // More prominent button style
            )}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Messages
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

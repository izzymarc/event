import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface DashboardWelcomeProps {
  user: any; // TODO: Define User type
  titleFontClass: string;
  textFontClass: string;
}

export const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ user, titleFontClass, textFontClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        <h1 className={`text-3xl mb-2 ${titleFontClass}`}>
          Welcome back, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className={`text-lg ${textFontClass}`}>
          {user?.role === 'client'
            ? "Here's what's happening with your projects today"
            : "Here's your professional overview for today"}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to={user?.role === 'client' ? '/jobs/new' : '/jobs'}
            className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            {user?.role === 'client' ? 'Post New Job' : 'Find Jobs'}
          </Link>
          <Link
            to="/messages"
            className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Messages
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

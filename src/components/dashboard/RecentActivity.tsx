import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, MessageSquare } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'job' | 'proposal' | 'message' | 'deadline';
  title: string;
  time: string;
  status?: string;
  budget?: string;
  clientName?: string;
  vendorName?: string;
}

export const RecentActivity = ({ recentActivity }: { recentActivity: ActivityItem[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'job'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    : activity.type === 'proposal'
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {activity.type === 'job' ? (
                    <Briefcase className="h-5 w-5" />
                  ) : activity.type === 'proposal' ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.clientName && <span>Client: {activity.clientName}</span>}
                    {activity.vendorName && <span>Vendor: {activity.vendorName}</span>}
                    {activity.time && <span> - {activity.time}</span>}
                  </p>
                </div>
              </div>
              {activity.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

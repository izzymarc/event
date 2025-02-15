import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface DeadlineItem {
  id: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'in_progress' | 'pending' | 'overdue';
  deadline: string;
}

export const UpcomingDeadlines = ({ upcomingDeadlines }: { upcomingDeadlines: DeadlineItem[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
          <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            View Calendar
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {upcomingDeadlines.map((deadline) => (
          <div key={deadline.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {deadline.project}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deadline.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {deadline.priority} Priority
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deadline.status === 'in_progress'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {deadline.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(deadline.deadline)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

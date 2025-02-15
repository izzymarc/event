import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Star, ArrowUpRight } from 'lucide-react';

interface PerformanceMetrics {
  completionRate: number;
  responseTime: string;
  clientSatisfaction: number;
  activeProjects: number;
}

export const KeyMetrics = ({ performanceMetrics }: { performanceMetrics: PerformanceMetrics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Key Metrics</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {performanceMetrics.completionRate}%
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-green-500" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {performanceMetrics.responseTime}
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-green-500" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Client Satisfaction</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {performanceMetrics.clientSatisfaction}/5.0
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-green-500" />
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react'; // Changed import to Activity

export const PerformanceChart = ({ selectedPeriod, setSelectedPeriod }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center text-gray-500">
        {/* Placeholder for chart - Using Activity icon as placeholder */}
        <Activity className="h-32 w-32" />  {/* Changed to Activity icon */}
      </div>
    </motion.div>
  );
};

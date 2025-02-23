import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface PerformanceChartProps {
  selectedPeriod: string;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<string>>;
  cardClass: string;
  titleFontClass: string;
  textFontClass: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ selectedPeriod, setSelectedPeriod, cardClass, titleFontClass, textFontClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lg:col-span-2 ${cardClass}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg ${titleFontClass}`}>Performance Overview</h2>
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
      <div className="h-64">
        {/* Placeholder chart using inline SVG */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M10,90 L30,10 L50,80 L70,20 L90,70 L110,30 L130,60 L150,40 L170,50 L190,20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-indigo-500"
          />
        </svg>
      </div>
    </motion.div>
  );
};

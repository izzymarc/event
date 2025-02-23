import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Briefcase, Star, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

interface KeyMetricsProps {
  earningsThisMonth: number;
  earningsChange: number; // Percentage
  activeJobs: number;
  activeJobsChange: number;
  successRate: number;
  successRateChange: number;
  cardClass: string;
  titleFontClass: string;
  textFontClass: string;
  valueFontClass: string;
}

const getTrendIcon = (change: number) => {
    return change >= 0 ? <ArrowUpRight className="h-5 w-5 text-green-500" /> : <ArrowDownRight className="h-5 w-5 text-red-500" />;
};

const formatPercentageChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({
    earningsThisMonth,
    earningsChange,
    activeJobs,
    activeJobsChange,
    successRate,
    successRateChange,
    cardClass,
    titleFontClass,
    textFontClass,
    valueFontClass
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cardClass}
    >
      <h2 className={`text-lg ${titleFontClass} mb-6`}>Key Metrics</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${textFontClass}`}>Earnings this month</p>
              <p className={valueFontClass}>
                ${earningsThisMonth.toFixed(2)}
              </p>
            </div>
          </div>
          {getTrendIcon(earningsChange)}
          <span className='text-sm'>{formatPercentageChange(earningsChange)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${textFontClass}`}>Active Jobs</p>
              <p className={valueFontClass}>
                {activeJobs}
              </p>
            </div>
          </div>
          {getTrendIcon(activeJobsChange)}
          <span className='text-sm'>{formatPercentageChange(activeJobsChange)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${textFontClass}`}>Success Rate</p>
              <p className={valueFontClass}>
                {successRate}%
              </p>
            </div>
          </div>
           {getTrendIcon(successRateChange)}
          <span className='text-sm'>{formatPercentageChange(successRateChange)}</span>
        </div>
      </div>
    </motion.div>
  );
};

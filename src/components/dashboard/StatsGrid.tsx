import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stat {
  name: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
  color: string;
  metric?: string;
  comparison?: string;
}

interface StatsGridProps {
  stats: Stat[];
  cardClass: string;
  valueFontClass: string;
  statFontClass: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, cardClass, valueFontClass, statFontClass }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cardClass}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/${stat.name.toLowerCase().replace(/ /g, '-')}`}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-lg p-3 ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium truncate ${statFontClass}`}>
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="flex flex-col">
                          <span className={valueFontClass}>
                            {stat.value}
                            {stat.metric && (
                              <span className="text-sm font-normal ml-1">{stat.metric}</span>
                            )}
                          </span>
                          {stat.comparison && (
                            <span className="text-xs text-muted-foreground mt-1">
                              vs {stat.comparison} last month
                            </span>
                          )}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${statFontClass} ${
                            stat.changeType === 'increase'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {stat.changeType === 'increase' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

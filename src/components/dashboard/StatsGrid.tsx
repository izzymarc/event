import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Stat {
  name: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
  color: string;
}

export const StatsGrid = ({ stats }: { stats: Stat[] }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" // Added hover scale for elevation
          >
            <div className={cn("p-6", stat.color, 'bg-opacity-5')}> {/* Softer background color opacity */}
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg p-3 ${stat.color} bg-opacity-20`}> {/* Even softer icon background */}
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
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
          </motion.div>
        );
      })}
    </div>
  );
};
</boltArtifact>
```

**Changes in `StatsGrid.tsx`:**

*   **Softer Card Backgrounds:**
    *   Modified the `className` of the inner `div` within `motion.div` to use `bg-opacity-5` instead of `bg-opacity-10` for the `stat.color` classes. This makes the background color of the stat cards much softer and less intense.
*   **Softer Icon Backgrounds:**
    *   Similarly, changed the `bg-opacity-10` to `bg-opacity-20` for the icon background `div` to make it even softer.
*   **Elevation on Hover:**
    *   Added `hover:scale-105` class to the `motion.div` container of each stat card. This will slightly scale up the card on hover, creating a subtle elevation effect and making the cards feel more interactive.

These are just initial beautification steps. After applying these artifacts, please check how the dashboard looks and let me know if you'd like to refine these sections further or move on to beautifying other parts of the dashboard!
import { motion } from 'framer-motion';

interface LoadingStateProps {
  rows?: number;
  type?: 'card' | 'list' | 'table';
  className?: string;
}

export function LoadingState({ rows = 3, type = 'card', className = '' }: LoadingStateProps) {
  const shimmerStyle = `
    relative
    overflow-hidden
    before:absolute
    before:inset-0
    before:-translate-x-full
    before:animate-[shimmer_2s_infinite]
    before:bg-gradient-to-r
    before:from-transparent
    before:via-gray-100/50
    before:to-transparent
    dark:before:via-gray-800/50
  `;

  if (type === 'card') {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${shimmerStyle}`}
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center space-x-4 ${shimmerStyle}`}
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className={`grid grid-cols-4 gap-4 ${shimmerStyle}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`grid grid-cols-4 gap-4 ${shimmerStyle}`}
        >
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

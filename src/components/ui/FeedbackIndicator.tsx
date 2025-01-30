import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FeedbackIndicatorProps {
  type: 'success' | 'error' | 'loading' | 'info';
  message: string;
  className?: string;
}

export function FeedbackIndicator({ type, message, className = '' }: FeedbackIndicatorProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    loading: Loader2,
    info: AlertCircle
  };

  const colors = {
    success: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    error: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    loading: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`rounded-lg p-4 ${colors[type]} ${className}`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${type === 'loading' ? 'animate-spin' : ''}`} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../lib/hooks/useToast';

interface ReviewFormProps {
  jobId: string;
  vendorId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ jobId, vendorId, onSubmitSuccess, onCancel }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      addToast('Please select a rating.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_ratings')
        .insert([
          {
            rater_id: user?.id,
            rated_id: vendorId,
            job_id: jobId,
            rating: rating,
            feedback: feedback,
          },
        ]);

      if (error) throw error;

      addToast('Review submitted successfully!', 'success');
      if (onSubmitSuccess) {
        onSubmitSuccess(); // Callback to handle successful submission
      }
      // Reset form fields after successful submission
      setRating(null);
      setFeedback('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      addToast(error.message || 'Failed to submit review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (index: number) => {
    setHoveredRating(index);
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  const currentRating = hoveredRating !== null ? hoveredRating : rating;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <motion.button
                key={index}
                type="button"
                className="focus:outline-none"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => handleStarHover(index)}
                onHoverEnd={handleStarLeave}
                onClick={() => handleRatingChange(index)}
              >
                <Star className={`h-6 w-6 ${index <= currentRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} fill={index <= currentRating ? "currentColor" : "none"} />
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback (Optional)</label>
          <textarea
            id="feedback"
            name="feedback"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Share your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <motion.button
            onClick={(e) => {e.preventDefault(); if(onCancel) onCancel()}}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

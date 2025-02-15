import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  className?: string;
  displayValue?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  starSize = 20,
  className = '',
  displayValue = false
}) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-${starSize} w-${starSize} ${i <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} ${className}`}
        fill={i <= rating ? "currentColor" : "none"}
      />
    );
  }

  return (
    <div className="flex items-center">
      {stars}
      {displayValue && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}
    </div>
  );
};

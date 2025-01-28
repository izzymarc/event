import { useCallback } from 'react';

interface ErrorHandler {
  captureError: (error: Error) => void;
  reportError: (error: Error) => void;
}

export function useErrorBoundary(): ErrorHandler {
  const captureError = useCallback((error: Error) => {
    console.error('Error captured:', error);
    // Here you would typically send to your error reporting service
  }, []);

  const reportError = useCallback((error: Error) => {
    console.error('Error reported:', error);
    // Here you would implement error reporting logic
  }, []);

  return { captureError, reportError };
}

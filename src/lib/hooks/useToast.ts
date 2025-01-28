// Import necessary React hooks
import { useState, useCallback } from 'react';

// Define a type for toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define an interface for toast objects
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Define a custom hook for managing toasts
export function useToast() {
  // State variable to store the list of toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to add a new toast
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    // Generate a unique ID for the toast
    const id = Math.random().toString(36).substring(7);
    // Add the new toast to the list
    setToasts(prev => [...prev, { id, message, type }]);

    // Set a timeout to remove the toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  // Function to remove a toast by its ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Return the state variable and functions
  return {
    toasts,
    addToast,
    removeToast
  };
}

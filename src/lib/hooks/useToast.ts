import { useState, useCallback } from 'react';

// Define types for toast messages
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Custom hook to manage toast messages
export function useToast() {
  // State variable to store toast messages
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to add a new toast message
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    // Generate a unique ID for the toast
    const id = Math.random().toString(36).substring(7);
    // Add the new toast to the state
    setToasts(prev => [...prev, { id, message, type }]);

    // Remove the toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  // Function to remove a toast message by ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Return toasts, addToast, and removeToast functions
  return {
    toasts,
    addToast,
    removeToast
  };
}

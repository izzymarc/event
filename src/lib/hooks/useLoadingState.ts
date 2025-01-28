import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export function useLoadingState(initialState: LoadingState = {}) {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const startLoading = useCallback((key: string) => {
    setLoadingState(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingState(prev => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback((key: string) => loadingState[key] || false, [loadingState]);

  return { startLoading, stopLoading, isLoading };
}

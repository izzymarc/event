import { useAuth } from '../../contexts/AuthContext';
import { useCallback } from 'react';

export function useRoleAccess() {
  const { user } = useAuth();

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.role) return false;

    // Check if the user has the required permission
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const isClient = useCallback(() => user?.role === 'client', [user]);
  const isVendor = useCallback(() => user?.role === 'vendor', [user]);

  return {
    hasPermission,
    isClient,
    isVendor
  };
}

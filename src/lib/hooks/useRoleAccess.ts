import { useAuth } from '../../contexts/AuthContext';

type Permission = 'create:jobs' | 'manage:jobs' | 'view:proposals' | 'create:proposals' | 'view:jobs' | 'manage:proposals';

export function useRoleAccess() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;

    const rolePermissions = {
      client: ['create:jobs', 'manage:jobs', 'view:proposals'],
      vendor: ['create:proposals', 'view:jobs', 'manage:proposals']
    };

    return rolePermissions[user.role].includes(permission);
  };

  const isClient = (): boolean => user?.role === 'client';
  const isVendor = (): boolean => user?.role === 'vendor';

  return {
    hasPermission,
    isClient,
    isVendor
  };
}

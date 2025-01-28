import { Navigate } from 'react-router-dom';
import { useRoleAccess } from '../lib/hooks/useRoleAccess';
import type { Permission } from '../lib/types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallbackPath?: string;
}

export default function RoleProtectedRoute({
  children,
  requiredPermission,
  fallbackPath = '/dashboard'
}: RoleProtectedRouteProps) {
  const { hasPermission } = useRoleAccess();

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

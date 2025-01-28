import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Briefcase } from 'lucide-react';

interface RoleBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export default function RoleBadge({ className = '', showIcon = true }: RoleBadgeProps) {
  const { user } = useAuth();

  if (!user?.role) return null;

  const roleConfig = {
    client: {
      icon: Briefcase,
      label: 'Client',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    vendor: {
      icon: UserPlus,
      label: 'Vendor',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  };

  const config = roleConfig[user.role];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </span>
  );
}

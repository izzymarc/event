// Define a type for permissions
export type Permission = 'create:jobs' | 'manage:jobs' | 'view:proposals' | 'create:proposals' | 'view:jobs' | 'manage:proposals';

// Define a type for user roles
export type UserRole = 'client' | 'vendor';

// Define an interface for user data
export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  availability_status?: string;
}

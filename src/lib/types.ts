export type Permission = 'create:jobs' | 'manage:jobs' | 'view:proposals' | 'create:proposals' | 'view:jobs' | 'manage:proposals';

export type UserRole = 'client' | 'vendor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  availability_status?: string;
}

export type Permission = string;

export type UserRole = 'client' | 'vendor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  availability_status?: string;
}

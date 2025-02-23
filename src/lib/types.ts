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

export interface ProfileData {
  full_name: string;
  avatar_url?: string | null;
  bio: string;
  hourly_rate: number;
  skills: string[];
  portfolio_url?: string | null;
}

export interface UserSettings {
  theme?: string;
  language?: string;
  notifications?: boolean;
}

export interface JobType {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'active' | 'closed'; // Updated status type
  experience_level: string; // Added experience_level
  category: string;
  event_type: string; // Added event_type
  deadline?: string;
  client_id: string;
  vendor_id?: string;
  client: { // Nested client object
    full_name: string;
    rating: number | null;
  };
  milestones: Milestone[]; // Nested milestones array
  proposals_count: number; 
}

interface Milestone { // Define Milestone interface
  id: string;
  job_id: string;
  title: string;
  description: string;
  due_date: string;
  payment_amount: number;
}

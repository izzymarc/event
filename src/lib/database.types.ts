// Define a type for JSON data
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define an interface for the database schema
export interface Database {
  public: {
    Tables: {
      // Define the structure of the 'users' table
      users: {
        Row: {
          id: string
          email: string
          role: 'client' | 'vendor'
          full_name: string
          avatar_url: string | null
          availability_status: string
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'client' | 'vendor'
          full_name: string
          avatar_url?: string | null
          availability_status?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'client' | 'vendor'
          full_name?: string
          avatar_url?: string | null
          availability_status?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Define the structure of the 'profiles' table
      profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          hourly_rate: number | null
          skills: string[] | null
          portfolio_url: string | null
          business_details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          hourly_rate?: number | null
          skills?: string[] | null
          portfolio_url?: string | null
          business_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          hourly_rate?: number | null
          skills?: string[] | null
          portfolio_url?: string | null
          business_details?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      // Define the structure of the 'jobs' table
      jobs: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          category: string
          status: string
          budget: number
          deadline: string | null
          is_visible: boolean
          experience_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description: string
          category: string
          status?: string
          budget: number
          deadline?: string | null
          is_visible?: boolean
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string
          category?: string
          status?: string
          budget?: number
          deadline?: string | null
          is_visible?: boolean
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Define the structure of the 'job_categories' table
      job_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      // Define the structure of the 'job_skills' table
      job_skills: {
        Row: {
          id: string
          job_id: string
          skill: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          skill: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          skill?: string
          created_at?: string
        }
      }
      // Define the structure of the 'job_attachments' table
      job_attachments: {
        Row: {
          id: string
          job_id: string
          file_name: string
          file_url: string
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          file_name: string
          file_url: string
          file_type: string
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          created_at?: string
        }
      }
    }
  }
}

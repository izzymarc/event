export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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

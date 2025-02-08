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
      file_attachments: {
        Row: {
          attachable_id: string
          attachable_type: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          attachable_id: string
          attachable_type: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          attachable_id?: string
          attachable_type?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string | null
        }
      }
      job_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          job_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          job_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          job_id?: string
        }
      }
      job_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
      }
      job_skills: {
        Row: {
          created_at: string
          id: string
          job_id: string
          skill: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          skill: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          skill?: string
          created_at?: string
        }
      }
      job_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          job_id: string
          notes: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          status?: string
        }
      }
      jobs: {
        Row: {
          budget: number
          category: string
          client_id: string
          created_at: string
          deadline: string | null
          description: string
          event_type: string | null
          experience_level: string | null
          id: string
          is_visible: boolean
          search_vector: any | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget: number
          category: string
          client_id: string
          created_at?: string
          deadline?: string | null
          description: string
          event_type?: string | null
          experience_level?: string | null
          id?: string
          is_visible?: boolean
          search_vector?: any | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number
          category?: string
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          event_type?: string | null
          experience_level?: string | null
          id?: string
          is_visible?: boolean
          search_vector?: any | null
          status?: string
          title?: string
          updated_at?: string
        }
      }
      message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
        }
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
        }
      }
      milestones: {
        Row: {
          description: string | null
          due_date: string | null
          id: string
          job_id: string | null
          payment_amount: number | null
          status: string | null
          title: string
        }
        Insert: {
          description?: string | null
          due_date?: string | null
          id?: string
          job_id?: string | null
          payment_amount?: number | null
          status?: string | null
          title: string
        }
        Update: {
          description?: string | null
          due_date?: string | null
          id?: string
          job_id?: string | null
          payment_amount?: number | null
          status?: string | null
          title?: string
        }
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          proposal_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          proposal_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          proposal_id?: string
          status?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
      }
      portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          portfolio_url: string | null
          project_url: string | null
          technologies: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          portfolio_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          portfolio_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          availability: string | null
          bio: string | null
          business_details: Json | null
          created_at: string
          github_url: string | null
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          linkedin_url: string | null
          portfolio_url: string | null
          portfolio_website_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          business_details?: Json | null
          created_at?: string
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          portfolio_website_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          business_details?: Json | null
          created_at?: string
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          portfolio_website_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
      }
      proposals: {
        Row: {
          content: string
          created_at: string
          id: string
          job_id: string
          price: number
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          job_id: string
          price: number
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          job_id?: string
          price?: number
          status?: string
          updated_at?: string
          vendor_id?: string
        }
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
      }
      search_indexes: {
        Row: {
          created_at: string
          id: string
          search_vector: any | null
          searchable_id: string
          searchable_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          search_vector?: any | null
          searchable_id: string
          searchable_type: string
        }
        Update: {
          created_at?: string
          id?: string
          search_vector?: any | null
          searchable_id?: string
          searchable_type?: string
        }
      }
      service_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          price: number | null
          title: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          title?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          title?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
      }
      skill_endorsements: {
        Row: {
          created_at: string
          endorsed_id: string
          endorser_id: string
          id: string
          skill: string
        }
        Insert: {
          created_at?: string
          endorsed_id: string
          endorser_id: string
          id?: string
          skill: string
        }
        Update: {
          created_at?: string
          endorsed_id?: string
          endorser_id?: string
          id?: string
          skill?: string
        }
      }
      time_entries: {
        Row: {
          created_at: string
          description: string | null
          duration: any | null
          end_time: string | null
          id: string
          project_id: string | null
          start_time: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: any | null
          end_time?: string | null
          id?: string
          project_id?: string | null
          start_time: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: any | null
          end_time?: string | null
          id?: string
          project_id?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      user_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          id: string
          notification_settings: Json | null
          preferences: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_settings?: Json | null
          preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: string
          notification_settings?: Json | null
          preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
      }
      user_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          job_id: string | null
          rated_id: string
          rater_id: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          job_id?: string | null
          rated_id: string
          rater_id: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          job_id?: string | null
          rated_id?: string
          rater_id?: string
          rating?: number | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          availability_status: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_active: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"]
          search_vector: any | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          last_active?: string | null
          rating?: number | null
          role: Database["public"]["Enums"]["user_role"]
          search_vector?: any | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_active?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          search_vector?: any | null
          updated_at?: string
        }
      }
    }
    Views: {
      get_user_permissions: {
        Row: {
          permission: string | null
        }
      }
    }
    Enums: {
      user_role: "client" | "vendor"
    }
    Functions: {
      calculate_user_rating: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      check_user_permission: {
        Args: {
          required_permission: string
        }
        Returns: boolean
      }
      check_user_role: {
        Args: {
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      get_user_details: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_user_permissions: {
        Args?: Record<PropertyKey, never>
        Returns: {
          permission: string
        }[]
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_metadata?: Json
        }
        Returns: undefined
      }
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

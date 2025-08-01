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
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          height: number | null
          weight: number | null
          target_weight: number | null
          date_of_birth: string | null
          gender: string | null
          activity_level: string | null
          fitness_goals: string[] | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          target_weight?: number | null
          date_of_birth?: string | null
          gender?: string | null
          activity_level?: string | null
          fitness_goals?: string[] | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          target_weight?: number | null
          date_of_birth?: string | null
          gender?: string | null
          activity_level?: string | null
          fitness_goals?: string[] | null
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          difficulty: string
          duration: number
          exercises: number
          goal: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          difficulty: string
          duration: number
          exercises: number
          goal: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          difficulty?: string
          duration?: number
          exercises?: number
          goal?: string
          created_at?: string
          updated_at?: string
        }
      }
      progress_logs: {
        Row: {
          id: string
          user_id: string
          weight: number
          body_fat: number | null
          measurements: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          body_fat?: number | null
          measurements?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          body_fat?: number | null
          measurements?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
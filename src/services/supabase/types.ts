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
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          plan_name: string
          exercise_name: string
          duration: number
          sets: number
          reps: number
          completed_sets: number
          calories_burned: number | null
          session_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_name: string
          exercise_name: string
          duration: number
          sets: number
          reps: number
          completed_sets: number
          calories_burned?: number | null
          session_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: string
          exercise_name?: string
          duration?: number
          sets?: number
          reps?: number
          completed_sets?: number
          calories_burned?: number | null
          session_date?: string
          created_at?: string
        }
      }
      body_stats: {
        Row: {
          id: string
          user_id: string
          weight: number
          waist: number
          hip: number
          chest: number
          arm: number
          body_fat: number
          bmi: number
          stats_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          waist: number
          hip: number
          chest: number
          arm: number
          body_fat: number
          bmi: number
          stats_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          waist?: number
          hip?: number
          chest?: number
          arm?: number
          body_fat?: number
          bmi?: number
          stats_date?: string
          created_at?: string
        }
      }
      nutrition_meals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          serving_weight: number
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber: number | null
          sugar: number | null
          sodium: number | null
          meal_type: string
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          serving_weight: number
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          meal_type: string
          logged_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          serving_weight?: number
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          meal_type?: string
          logged_at?: string
          created_at?: string
        }
      }
      nutrition_water_logs: {
        Row: {
          id: string
          user_id: string
          amount: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          logged_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          logged_at?: string
          created_at?: string
        }
      }
      nutrition_goals: {
        Row: {
          id: string
          user_id: string
          daily_calories: number
          daily_protein: number
          daily_carbs: number
          daily_fat: number
          daily_water: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_calories: number
          daily_protein: number
          daily_carbs: number
          daily_fat: number
          daily_water: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_calories?: number
          daily_protein?: number
          daily_carbs?: number
          daily_fat?: number
          daily_water?: number
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
      custom_workout_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          difficulty_level: string
          goal_type: string
          days_per_week: number
          estimated_duration: number
          workout_days: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          difficulty_level: string
          goal_type: string
          days_per_week: number
          estimated_duration: number
          workout_days: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          difficulty_level?: string
          goal_type?: string
          days_per_week?: number
          estimated_duration?: number
          workout_days?: Json
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
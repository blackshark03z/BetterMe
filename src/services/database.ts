import { supabase } from './supabase/client';
import { Database } from './supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
type ProgressLog = Database['public']['Tables']['progress_logs']['Row'];

export class DatabaseService {
  // User methods
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  // Workout plans methods
  static async getWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }

    return data || [];
  }

  static async createWorkoutPlan(workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert(workoutPlan)
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return null;
    }

    return data;
  }

  static async updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>) {
    const { data, error } = await supabase
      .from('workout_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout plan:', error);
      return null;
    }

    return data;
  }

  static async deleteWorkoutPlan(id: string) {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout plan:', error);
      return false;
    }

    return true;
  }

  // Progress logs methods
  static async getProgressLogs(userId: string, limit = 30): Promise<ProgressLog[]> {
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching progress logs:', error);
      return [];
    }

    return data || [];
  }

  static async createProgressLog(progressLog: Omit<ProgressLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('progress_logs')
      .insert(progressLog)
      .select()
      .single();

    if (error) {
      console.error('Error creating progress log:', error);
      return null;
    }

    return data;
  }

  static async updateProgressLog(id: string, updates: Partial<ProgressLog>) {
    const { data, error } = await supabase
      .from('progress_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating progress log:', error);
      return null;
    }

    return data;
  }

  static async deleteProgressLog(id: string) {
    const { error } = await supabase
      .from('progress_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting progress log:', error);
      return false;
    }

    return true;
  }

  // Analytics methods
  static async getWeightProgress(userId: string, days = 30) {
    const { data, error } = await supabase
      .from('progress_logs')
      .select('weight, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching weight progress:', error);
      return [];
    }

    return data || [];
  }

  static async getLatestWeight(userId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('progress_logs')
      .select('weight')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest weight:', error);
      return null;
    }

    return data?.weight || null;
  }
} 
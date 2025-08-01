import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../services/auth';
import { dataSyncService } from '../services/dataSync';
import { useProgressStore } from './progressStore';
import { useNutritionStore } from './nutritionStore';
import { useWorkoutStore } from './workoutStore';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.signIn(email, password);
      
      if (response.success && response.user) {
        // Sync data from database for existing user
        const progressStore = useProgressStore.getState();
        const nutritionStore = useNutritionStore.getState();
        const workoutStore = useWorkoutStore.getState();
        
        try {
          await dataSyncService.syncAllData(response.user.id, {
            onWorkoutSessions: (sessions) => {
              progressStore.sessions = sessions;
              progressStore.updateProgress();
            },
            onBodyStats: (stats) => {
              progressStore.bodyStats = stats;
            },
            onNutritionMeals: (meals) => {
              nutritionStore.meals = meals;
            },
            onWaterLogs: (logs) => {
              nutritionStore.waterLogs = logs;
            },
            onNutritionGoals: (goals) => {
              nutritionStore.goals = {
                dailyCalories: goals.daily_calories,
                dailyProtein: goals.daily_protein,
                dailyCarbs: goals.daily_carbs,
                dailyFat: goals.daily_fat,
                dailyWater: goals.daily_water,
              };
            },
            onCustomWorkoutPlans: (plans) => {
              workoutStore.customPlans = plans;
            },
          });
          console.log('✅ Data synced from database');
        } catch (syncError) {
          console.error('❌ Error syncing data:', syncError);
          // Fallback to clear data if sync fails
          progressStore.clearAllData();
          nutritionStore.resetNutritionData();
          workoutStore.clearAllData();
        }
        
        set({
          user: response.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        console.log('✅ User signed in successfully');
        return { success: true };
      } else {
        set({
          loading: false,
          error: response.error || 'Sign in failed',
        });
        console.error('❌ Sign in failed:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('❌ Sign in error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  },

  signUp: async (email: string, password: string, userData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.signUp(email, password, userData);
      
      if (response.success && response.user) {
        // Clear data for new user and upload initial goals
        const progressStore = useProgressStore.getState();
        const nutritionStore = useNutritionStore.getState();
        const workoutStore = useWorkoutStore.getState();
        
        progressStore.clearAllData();
        nutritionStore.resetNutritionData();
        workoutStore.clearAllData();
        
        // Upload initial nutrition goals to database
        try {
          await dataSyncService.uploadNutritionGoals(response.user.id, nutritionStore.goals);
          console.log('✅ Initial data uploaded to database');
        } catch (uploadError) {
          console.error('❌ Error uploading initial data:', uploadError);
        }
        
        set({
          user: response.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        console.log('✅ User signed up successfully');
        return { success: true };
      } else {
        set({
          loading: false,
          error: response.error || 'Sign up failed',
        });
        console.error('❌ Sign up failed:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('❌ Sign up error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    
    try {
      // Upload all data to database before signing out
      const currentUser = get().user;
      if (currentUser) {
        const progressStore = useProgressStore.getState();
        const nutritionStore = useNutritionStore.getState();
        const workoutStore = useWorkoutStore.getState();
        
        try {
          await dataSyncService.uploadAllData(currentUser.id, {
            workoutSessions: progressStore.sessions,
            bodyStats: progressStore.bodyStats,
            nutritionMeals: nutritionStore.meals,
            nutritionWaterLogs: nutritionStore.waterLogs,
            nutritionGoals: nutritionStore.goals,
            customWorkoutPlans: workoutStore.customPlans,
          });
          console.log('✅ All data uploaded before sign out');
        } catch (uploadError) {
          console.error('❌ Error uploading data before sign out:', uploadError);
        }
      }
      
      const response = await AuthService.signOut();
      
      if (response.success) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
        console.log('✅ User signed out successfully');
      } else {
        set({
          loading: false,
          error: response.error || 'Sign out failed',
        });
        console.error('❌ Sign out failed:', response.error);
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('❌ Sign out error:', error);
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    
    try {
      const response = await AuthService.checkSession();
      
      if (response.success) {
        set({
          user: response.user,
          isAuthenticated: !!response.user,
          loading: false,
          error: null,
        });
        console.log('✅ Auth check completed');
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: response.error || 'Auth check failed',
        });
        console.error('❌ Auth check failed:', response.error);
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('❌ Auth check error:', error);
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.resetPassword(email);
      
      if (response.success) {
        set({
          loading: false,
          error: null,
        });
        console.log('✅ Password reset email sent');
      } else {
        set({
          loading: false,
          error: response.error || 'Password reset failed',
        });
        console.error('❌ Password reset failed:', response.error);
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('❌ Password reset error:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
})); 
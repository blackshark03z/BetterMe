import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './authStore';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  weight?: number;
  notes?: string;
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  exercises: Exercise[];
}

interface CustomWorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  daysPerWeek: number;
  estimatedDuration: number;
  workoutDays: WorkoutDay[];
  createdAt: Date;
}

interface WorkoutStore {
  customPlans: CustomWorkoutPlan[];
  addCustomPlan: (plan: Omit<CustomWorkoutPlan, 'id' | 'createdAt'>) => void;
  removeCustomPlan: (planId: string) => void;
  clearAllData: () => void;
  // Removed syncWithDatabase and uploadToDatabase to avoid require cycles
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      customPlans: [],
      
      addCustomPlan: (plan) => {
        const newPlan: CustomWorkoutPlan = {
          ...plan,
          id: `plan-${Date.now()}`,
          createdAt: new Date(),
        };
        
        set((state) => ({
          customPlans: [...state.customPlans, newPlan],
        }));
        
        // Upload to database if user is authenticated
        const authStore = useAuthStore.getState();
        if (authStore.user?.id) {
          // Upload handled by authStore
        }
      },
      
      removeCustomPlan: (planId) => {
        set((state) => ({
          customPlans: state.customPlans.filter(plan => plan.id !== planId),
        }));
      },

      clearAllData: () => {
        set({
          customPlans: [],
        });
      },

      // Removed syncWithDatabase and uploadToDatabase to avoid require cycles
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
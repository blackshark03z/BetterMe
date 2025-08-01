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
  databaseId?: string; // Database ID for deletion
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
  setCustomPlans: (plans: CustomWorkoutPlan[]) => void;
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
          // Import dataSyncService dynamically to avoid require cycles
          const { dataSyncService } = require('../services/dataSync');
          dataSyncService.uploadCustomWorkoutPlan(authStore.user.id, newPlan).then((databaseId) => {
            if (databaseId) {
              // Update the plan with database ID
              set((state) => ({
                customPlans: state.customPlans.map(p => 
                  p.id === newPlan.id ? { ...p, databaseId } : p
                ),
              }));
            }
          });
        }
      },
      
      removeCustomPlan: (planId) => {
        set((state) => {
          const planToDelete = state.customPlans.find(plan => plan.id === planId);
          console.log('🗑️ Deleting plan:', { planId, planToDelete });
          const authStore = useAuthStore.getState();
          if (authStore.user?.id && planToDelete?.databaseId) {
            console.log('🗑️ Deleting from database:', planToDelete.databaseId);
            const { dataSyncService } = require('../services/dataSync');
            dataSyncService.deleteCustomWorkoutPlan(authStore.user.id, planToDelete.databaseId);
          } else {
            console.log('⚠️ Cannot delete from database:', { userId: authStore.user?.id, databaseId: planToDelete?.databaseId });
          }
          return {
            customPlans: state.customPlans.filter(plan => plan.id !== planId),
          };
        });
      },

      setCustomPlans: (plans) => {
        set({ customPlans: plans });
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
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Meal {
  id: string;
  name: string;
  description?: string;
  servingWeight: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: Date;
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  loggedAt: Date;
}

export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyWater: number; // in ml
}

export interface NutritionData {
  meals: Meal[];
  waterLogs: WaterLog[];
  goals: NutritionGoals;
}

export interface RecommendedMeal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  imageUrl?: string;
}

// Recommended meal plans based on goals
const RECOMMENDED_MEALS: RecommendedMeal[] = [
  // Weight Loss Meals
  {
    id: 'wl-breakfast-1',
    name: 'Oatmeal with Berries',
    description: 'High fiber breakfast to keep you full longer',
    calories: 280,
    protein: 12,
    carbs: 45,
    fat: 8,
    mealType: 'breakfast',
    goal: 'weight_loss',
  },
  {
    id: 'wl-lunch-1',
    name: 'Grilled Chicken Salad',
    description: 'Lean protein with fresh vegetables',
    calories: 320,
    protein: 35,
    carbs: 15,
    fat: 12,
    mealType: 'lunch',
    goal: 'weight_loss',
  },
  {
    id: 'wl-dinner-1',
    name: 'Salmon with Quinoa',
    description: 'Omega-3 rich fish with whole grains',
    calories: 380,
    protein: 28,
    carbs: 35,
    fat: 18,
    mealType: 'dinner',
    goal: 'weight_loss',
  },
  {
    id: 'wl-snack-1',
    name: 'Greek Yogurt with Nuts',
    description: 'Protein-rich snack to curb hunger',
    calories: 180,
    protein: 15,
    carbs: 12,
    fat: 10,
    mealType: 'snack',
    goal: 'weight_loss',
  },

  // Muscle Gain Meals
  {
    id: 'mg-breakfast-1',
    name: 'Protein Pancakes',
    description: 'High protein breakfast for muscle building',
    calories: 420,
    protein: 25,
    carbs: 55,
    fat: 15,
    mealType: 'breakfast',
    goal: 'muscle_gain',
  },
  {
    id: 'mg-lunch-1',
    name: 'Beef Stir Fry with Rice',
    description: 'Protein and carbs for muscle recovery',
    calories: 580,
    protein: 42,
    carbs: 65,
    fat: 22,
    mealType: 'lunch',
    goal: 'muscle_gain',
  },
  {
    id: 'mg-dinner-1',
    name: 'Turkey with Sweet Potato',
    description: 'Lean protein with complex carbs',
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 20,
    mealType: 'dinner',
    goal: 'muscle_gain',
  },
  {
    id: 'mg-snack-1',
    name: 'Protein Shake with Banana',
    description: 'Quick protein boost between meals',
    calories: 280,
    protein: 22,
    carbs: 35,
    fat: 8,
    mealType: 'snack',
    goal: 'muscle_gain',
  },

  // Maintenance Meals
  {
    id: 'mt-breakfast-1',
    name: 'Avocado Toast with Eggs',
    description: 'Balanced breakfast for energy',
    calories: 350,
    protein: 18,
    carbs: 30,
    fat: 20,
    mealType: 'breakfast',
    goal: 'maintenance',
  },
  {
    id: 'mt-lunch-1',
    name: 'Mediterranean Bowl',
    description: 'Fresh and nutritious lunch option',
    calories: 420,
    protein: 25,
    carbs: 40,
    fat: 22,
    mealType: 'lunch',
    goal: 'maintenance',
  },
  {
    id: 'mt-dinner-1',
    name: 'Pasta with Lean Meat',
    description: 'Comforting dinner with balanced macros',
    calories: 480,
    protein: 32,
    carbs: 55,
    fat: 18,
    mealType: 'dinner',
    goal: 'maintenance',
  },
  {
    id: 'mt-snack-1',
    name: 'Mixed Nuts and Dried Fruits',
    description: 'Healthy snack with natural sugars',
    calories: 220,
    protein: 8,
    carbs: 25,
    fat: 12,
    mealType: 'snack',
    goal: 'maintenance',
  },
];

export const useNutritionStore = create<NutritionData & {
  addMeal: (meal: Omit<Meal, 'id' | 'loggedAt'>) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  removeMeal: (id: string) => void;
  addWaterLog: (amount: number) => void;
  updateGoals: (goals: Partial<NutritionGoals>) => void;
  getTodayNutrition: () => {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalWater: number;
    calorieProgress: number;
    waterProgress: number;
  };
  getMealsByType: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => Meal[];
  getRecommendedMeals: (goal: 'weight_loss' | 'muscle_gain' | 'maintenance', mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack') => RecommendedMeal[];
}>()(
  persist(
    (set, get) => ({
      meals: [],
      waterLogs: [],
      goals: {
        dailyCalories: 2000,
        dailyProtein: 150,
        dailyCarbs: 200,
        dailyFat: 65,
        dailyWater: 2500,
      },

      addMeal: (meal) => {
        const newMeal: Meal = {
          ...meal,
          id: Date.now().toString(),
          loggedAt: new Date(),
        };
        set((state) => ({
          meals: [...state.meals, newMeal],
        }));
      },

      updateMeal: (id, updates) => {
        set((state) => ({
          meals: state.meals.map((meal) =>
            meal.id === id ? { ...meal, ...updates } : meal
          ),
        }));
      },

      removeMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
        }));
      },

      addWaterLog: (amount) => {
        const newWaterLog: WaterLog = {
          id: Date.now().toString(),
          amount,
          loggedAt: new Date(),
        };
        set((state) => ({
          waterLogs: [...state.waterLogs, newWaterLog],
        }));
      },

      updateGoals: (newGoals) => {
        set((state) => ({
          goals: { ...state.goals, ...newGoals },
        }));
      },

      getTodayNutrition: () => {
        const { meals, waterLogs, goals } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMeals = meals.filter((meal) => {
          const mealDate = new Date(meal.loggedAt);
          mealDate.setHours(0, 0, 0, 0);
          return mealDate.getTime() === today.getTime();
        });

        const todayWaterLogs = waterLogs.filter((log) => {
          const logDate = new Date(log.loggedAt);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        });

        const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
        const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        const totalFat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);
        const totalWater = todayWaterLogs.reduce((sum, log) => sum + log.amount, 0);

        return {
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalWater,
          calorieProgress: (totalCalories / goals.dailyCalories) * 100,
          waterProgress: (totalWater / goals.dailyWater) * 100,
        };
      },

      getMealsByType: (mealType) => {
        const { meals } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return meals.filter((meal) => {
          const mealDate = new Date(meal.loggedAt);
          mealDate.setHours(0, 0, 0, 0);
          return mealDate.getTime() === today.getTime() && meal.mealType === mealType;
        });
      },

      getRecommendedMeals: (goal, mealType) => {
        let filteredMeals = RECOMMENDED_MEALS.filter((meal) => meal.goal === goal);
        
        if (mealType) {
          filteredMeals = filteredMeals.filter((meal) => meal.mealType === mealType);
        }
        
        return filteredMeals;
      },
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 
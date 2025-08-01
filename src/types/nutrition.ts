export interface Meal {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  is_custom: boolean;
  user_id?: string;
  barcode?: string;
  created_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  meal_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  logged_at: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount: number; // in ml
  logged_at: string;
  created_at: string;
}

export interface NutritionState {
  meals: Meal[];
  mealLogs: MealLog[];
  waterLogs: WaterLog[];
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWater: number;
  meals: {
    breakfast: MealLog[];
    lunch: MealLog[];
    dinner: MealLog[];
    snack: MealLog[];
  };
} 
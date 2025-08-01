export interface ProgressLog {
  id: string;
  user_id: string;
  weight?: number;
  waist_measurement?: number;
  hip_measurement?: number;
  chest_measurement?: number;
  arm_measurement?: number;
  body_fat_percentage?: number;
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface ProgressState {
  progressLogs: ProgressLog[];
  currentStats: {
    weight?: number;
    bmi?: number;
    bodyFat?: number;
    measurements: {
      waist?: number;
      hip?: number;
      chest?: number;
      arm?: number;
    };
  };
  isLoading: boolean;
  error: string | null;
}

export interface ProgressChartData {
  date: string;
  weight?: number;
  bmi?: number;
  bodyFat?: number;
  waist?: number;
  hip?: number;
  chest?: number;
  arm?: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  averageDuration: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  favoriteExercises: string[];
  weeklyProgress: {
    week: string;
    workouts: number;
    duration: number;
  }[];
}

export interface NutritionStats {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWater: number;
  goalAdherence: {
    calories: number; // percentage
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  weeklyProgress: {
    week: string;
    averageCalories: number;
    averageWater: number;
  }[];
} 
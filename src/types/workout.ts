export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group?: string;
  equipment_needed?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  video_url?: string;
  image_url?: string;
  instructions?: string;
  is_custom: boolean;
  user_id?: string;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  goal_type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  is_custom: boolean;
  user_id?: string;
  estimated_duration?: number; // in minutes
  days_per_week?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDay {
  id: string;
  workout_plan_id: string;
  day_number: number;
  day_name?: string;
  rest_day: boolean;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_day_id: string;
  exercise_id: string;
  sets: number;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  rest_time?: number; // in seconds
  order_index: number;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id: string;
  workout_day_id: string;
  started_at: string;
  completed_at?: string;
  total_duration?: number; // in minutes
  notes?: string;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  workout_session_id: string;
  exercise_id: string;
  sets_completed?: number;
  reps_completed?: number;
  weight_used?: number;
  duration_completed?: number; // in seconds
  rest_time_taken?: number; // in seconds
  notes?: string;
  created_at: string;
}

export interface WorkoutState {
  currentPlan: WorkoutPlan | null;
  currentSession: WorkoutSession | null;
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  isLoading: boolean;
  error: string | null;
} 
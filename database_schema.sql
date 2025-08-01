-- BetterMe Database Schema
-- Run this in Supabase SQL Editor

-- 1. Workout Sessions Table - Drop and recreate to ensure all columns exist
DROP TABLE IF EXISTS workout_sessions CASCADE;
CREATE TABLE workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  completed_sets INTEGER NOT NULL,
  calories_burned INTEGER,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Body Stats Table
CREATE TABLE IF NOT EXISTS body_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  waist DECIMAL(5,2) NOT NULL,
  hip DECIMAL(5,2) NOT NULL,
  chest DECIMAL(5,2) NOT NULL,
  arm DECIMAL(5,2) NOT NULL,
  body_fat DECIMAL(5,2) NOT NULL,
  bmi DECIMAL(4,2) NOT NULL,
  stats_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Nutrition Meals Table
CREATE TABLE IF NOT EXISTS nutrition_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  serving_weight INTEGER NOT NULL, -- in grams
  calories INTEGER NOT NULL,
  protein DECIMAL(5,2) NOT NULL,
  carbs DECIMAL(5,2) NOT NULL,
  fat DECIMAL(5,2) NOT NULL,
  fiber DECIMAL(5,2),
  sugar DECIMAL(5,2),
  sodium DECIMAL(5,2),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Nutrition Water Logs Table
CREATE TABLE IF NOT EXISTS nutrition_water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in ml
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Nutrition Goals Table
CREATE TABLE IF NOT EXISTS nutrition_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_calories INTEGER NOT NULL DEFAULT 2000,
  daily_protein DECIMAL(5,2) NOT NULL DEFAULT 150,
  daily_carbs DECIMAL(5,2) NOT NULL DEFAULT 200,
  daily_fat DECIMAL(5,2) NOT NULL DEFAULT 65,
  daily_water INTEGER NOT NULL DEFAULT 2500, -- in ml
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Custom Workout Plans Table
CREATE TABLE IF NOT EXISTS custom_workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'maintenance', 'strength', 'endurance')),
  days_per_week INTEGER NOT NULL,
  estimated_duration INTEGER NOT NULL,
  workout_days JSONB NOT NULL, -- Store workout days as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_body_stats_user_id ON body_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_body_stats_date ON body_stats(stats_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_meals_user_id ON nutrition_meals(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_meals_logged_at ON nutrition_meals(logged_at);
CREATE INDEX IF NOT EXISTS idx_nutrition_water_logs_user_id ON nutrition_water_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_water_logs_logged_at ON nutrition_water_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_custom_workout_plans_user_id ON custom_workout_plans(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workout_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can insert their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can update their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can delete their own workout sessions" ON workout_sessions;

DROP POLICY IF EXISTS "Users can view their own body stats" ON body_stats;
DROP POLICY IF EXISTS "Users can insert their own body stats" ON body_stats;
DROP POLICY IF EXISTS "Users can update their own body stats" ON body_stats;
DROP POLICY IF EXISTS "Users can delete their own body stats" ON body_stats;

DROP POLICY IF EXISTS "Users can view their own nutrition meals" ON nutrition_meals;
DROP POLICY IF EXISTS "Users can insert their own nutrition meals" ON nutrition_meals;
DROP POLICY IF EXISTS "Users can update their own nutrition meals" ON nutrition_meals;
DROP POLICY IF EXISTS "Users can delete their own nutrition meals" ON nutrition_meals;

DROP POLICY IF EXISTS "Users can view their own water logs" ON nutrition_water_logs;
DROP POLICY IF EXISTS "Users can insert their own water logs" ON nutrition_water_logs;
DROP POLICY IF EXISTS "Users can update their own water logs" ON nutrition_water_logs;
DROP POLICY IF EXISTS "Users can delete their own water logs" ON nutrition_water_logs;

DROP POLICY IF EXISTS "Users can view their own nutrition goals" ON nutrition_goals;
DROP POLICY IF EXISTS "Users can insert their own nutrition goals" ON nutrition_goals;
DROP POLICY IF EXISTS "Users can update their own nutrition goals" ON nutrition_goals;
DROP POLICY IF EXISTS "Users can delete their own nutrition goals" ON nutrition_goals;

DROP POLICY IF EXISTS "Users can view their own custom workout plans" ON custom_workout_plans;
DROP POLICY IF EXISTS "Users can insert their own custom workout plans" ON custom_workout_plans;
DROP POLICY IF EXISTS "Users can update their own custom workout plans" ON custom_workout_plans;
DROP POLICY IF EXISTS "Users can delete their own custom workout plans" ON custom_workout_plans;

-- Create RLS policies
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Body Stats policies
CREATE POLICY "Users can view their own body stats" ON body_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body stats" ON body_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body stats" ON body_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body stats" ON body_stats
  FOR DELETE USING (auth.uid() = user_id);

-- Nutrition Meals policies
CREATE POLICY "Users can view their own nutrition meals" ON nutrition_meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition meals" ON nutrition_meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition meals" ON nutrition_meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition meals" ON nutrition_meals
  FOR DELETE USING (auth.uid() = user_id);

-- Nutrition Water Logs policies
CREATE POLICY "Users can view their own water logs" ON nutrition_water_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs" ON nutrition_water_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water logs" ON nutrition_water_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs" ON nutrition_water_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Nutrition Goals policies
CREATE POLICY "Users can view their own nutrition goals" ON nutrition_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition goals" ON nutrition_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals" ON nutrition_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition goals" ON nutrition_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Custom Workout Plans policies
CREATE POLICY "Users can view their own custom workout plans" ON custom_workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom workout plans" ON custom_workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom workout plans" ON custom_workout_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom workout plans" ON custom_workout_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for nutrition_goals (drop first if exists)
DROP TRIGGER IF EXISTS update_nutrition_goals_updated_at ON nutrition_goals;
CREATE TRIGGER update_nutrition_goals_updated_at 
  BEFORE UPDATE ON nutrition_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
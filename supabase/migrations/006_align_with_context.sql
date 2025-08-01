-- Align database schema with CONTEXT.md specification
-- This migration updates the users table to match the specification

-- Add goal column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS goal VARCHAR(50) CHECK (goal IN ('lose_fat', 'gain_muscle', 'maintain'));

-- Update the handle_new_user function to include goal
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, goal, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'goal', 'maintain'),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_profiles table as specified in CONTEXT.md
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    waist_measurement DECIMAL(5,2),
    hip_measurement DECIMAL(5,2),
    chest_measurement DECIMAL(5,2),
    arm_measurement DECIMAL(5,2),
    bmi DECIMAL(4,2),
    body_fat_percentage DECIMAL(4,2),
    daily_calorie_goal INTEGER,
    daily_protein_goal INTEGER,
    daily_carbs_goal INTEGER,
    daily_fat_goal INTEGER,
    daily_water_goal INTEGER, -- in ml
    units_preference VARCHAR(10) DEFAULT 'metric', -- metric/imperial
    theme_preference VARCHAR(10) DEFAULT 'light', -- light/dark
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO anon;
GRANT ALL ON public.user_profiles TO authenticated;

-- Create user_settings table as specified in CONTEXT.md
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    workout_reminders BOOLEAN DEFAULT TRUE,
    meal_reminders BOOLEAN DEFAULT TRUE,
    water_reminders BOOLEAN DEFAULT TRUE,
    motivational_notifications BOOLEAN DEFAULT TRUE,
    reminder_times JSONB, -- {"workout": "08:00", "lunch": "12:00", "dinner": "18:00"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_settings TO service_role;
GRANT ALL ON public.user_settings TO anon;
GRANT ALL ON public.user_settings TO authenticated;

-- Create notifications table as specified in CONTEXT.md
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('workout_reminder', 'meal_reminder', 'water_reminder', 'motivational')),
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.notifications TO anon;
GRANT ALL ON public.notifications TO authenticated; 
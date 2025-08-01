-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
    fitness_goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER NOT NULL, -- in minutes
    exercises INTEGER NOT NULL,
    goal TEXT CHECK (goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_logs table
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    body_fat DECIMAL(4,2),
    measurements JSONB, -- Store measurements as JSON
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Workout plans policies
CREATE POLICY "Users can view own workout plans" ON public.workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans" ON public.workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans" ON public.workout_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans" ON public.workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Progress logs policies
CREATE POLICY "Users can view own progress logs" ON public.progress_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs" ON public.progress_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress logs" ON public.progress_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress logs" ON public.progress_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 
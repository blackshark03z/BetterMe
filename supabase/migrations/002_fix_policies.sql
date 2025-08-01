-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Users can view own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can insert own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can update own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can delete own workout plans" ON public.workout_plans;

DROP POLICY IF EXISTS "Users can view own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can insert own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can update own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can delete own progress logs" ON public.progress_logs;

-- Recreate policies
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
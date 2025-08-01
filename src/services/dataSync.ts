import { supabase } from './supabase/client';

export interface DataSyncService {
  // Progress Data Sync
  syncWorkoutSessions: (userId: string, onSuccess?: (sessions: any[]) => void) => Promise<void>;
  syncBodyStats: (userId: string, onSuccess?: (stats: any[]) => void) => Promise<void>;
  uploadWorkoutSession: (userId: string, session: any) => Promise<void>;
  uploadBodyStats: (userId: string, stats: any) => Promise<void>;

  // Nutrition Data Sync
  syncNutritionMeals: (userId: string, onSuccess?: (meals: any[]) => void) => Promise<void>;
  syncWaterLogs: (userId: string, onSuccess?: (logs: any[]) => void) => Promise<void>;
  syncNutritionGoals: (userId: string, onSuccess?: (goals: any) => void) => Promise<void>;
  uploadNutritionMeal: (userId: string, meal: any) => Promise<void>;
  uploadWaterLog: (userId: string, waterLog: any) => Promise<void>;
  uploadNutritionGoals: (userId: string, goals: any) => Promise<void>;

  // Custom Workout Plans Sync
  syncCustomWorkoutPlans: (userId: string, onSuccess?: (plans: any[]) => void) => Promise<void>;
  uploadCustomWorkoutPlan: (userId: string, plan: any) => Promise<void>;

  // Full Sync
  syncAllData: (userId: string, callbacks: {
    onWorkoutSessions?: (sessions: any[]) => void;
    onBodyStats?: (stats: any[]) => void;
    onNutritionMeals?: (meals: any[]) => void;
    onWaterLogs?: (logs: any[]) => void;
    onNutritionGoals?: (goals: any) => void;
    onCustomWorkoutPlans?: (plans: any[]) => void;
  }) => Promise<void>;
  uploadAllData: (userId: string, data: {
    workoutSessions: any[];
    bodyStats: any[];
    nutritionMeals: any[];
    nutritionWaterLogs: any[];
    nutritionGoals: any;
    customWorkoutPlans: any[];
  }) => Promise<void>;
}

class DataSyncServiceImpl implements DataSyncService {
  // Progress Data Sync
  async syncWorkoutSessions(userId: string, onSuccess?: (sessions: any[]) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false });

      if (error) {
        console.error('❌ Error syncing workout sessions:', error);
        return;
      }

      if (data) {
        const sessions = data.map(row => ({
          id: row.id,
          planName: row.plan_name,
          exerciseName: row.exercise_name,
          duration: row.duration,
          sets: row.sets,
          reps: row.reps,
          completedSets: row.completed_sets,
          caloriesBurned: row.calories_burned,
          date: new Date(row.session_date),
        }));

        onSuccess?.(sessions);
        console.log('✅ Synced workout sessions:', sessions.length);
      }
    } catch (error) {
      console.error('❌ Error syncing workout sessions:', error);
    }
  }

  async syncBodyStats(userId: string, onSuccess?: (stats: any[]) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('body_stats')
        .select('*')
        .eq('user_id', userId)
        .order('stats_date', { ascending: false });

      if (error) {
        console.error('❌ Error syncing body stats:', error);
        return;
      }

      if (data) {
        const bodyStats = data.map(row => ({
          id: row.id,
          weight: row.weight,
          waist: row.waist,
          hip: row.hip,
          chest: row.chest,
          arm: row.arm,
          bodyFat: row.body_fat,
          bmi: row.bmi,
          date: new Date(row.stats_date),
        }));

        onSuccess?.(bodyStats);
        console.log('✅ Synced body stats:', bodyStats.length);
      }
    } catch (error) {
      console.error('❌ Error syncing body stats:', error);
    }
  }

  async uploadWorkoutSession(userId: string, session: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userId,
          plan_name: session.planName,
          exercise_name: session.exerciseName,
          duration: session.duration,
          sets: session.sets,
          reps: session.reps,
          completed_sets: session.completedSets,
          calories_burned: session.caloriesBurned,
          session_date: session.date.toISOString(),
        });

      if (error) {
        console.error('❌ Error uploading workout session:', error);
      } else {
        console.log('✅ Uploaded workout session');
      }
    } catch (error) {
      console.error('❌ Error uploading workout session:', error);
    }
  }

  async uploadBodyStats(userId: string, stats: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('body_stats')
        .insert({
          user_id: userId,
          weight: stats.weight,
          waist: stats.waist,
          hip: stats.hip,
          chest: stats.chest,
          arm: stats.arm,
          body_fat: stats.bodyFat,
          bmi: stats.bmi,
          stats_date: stats.date.toISOString(),
        });

      if (error) {
        console.error('❌ Error uploading body stats:', error);
      } else {
        console.log('✅ Uploaded body stats');
      }
    } catch (error) {
      console.error('❌ Error uploading body stats:', error);
    }
  }

  // Nutrition Data Sync
  async syncNutritionMeals(userId: string, onSuccess?: (meals: any[]) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('nutrition_meals')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('❌ Error syncing nutrition meals:', error);
        return;
      }

      if (data) {
        const meals = data.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          servingWeight: row.serving_weight,
          calories: row.calories,
          protein: row.protein,
          carbs: row.carbs,
          fat: row.fat,
          fiber: row.fiber,
          sugar: row.sugar,
          sodium: row.sodium,
          mealType: row.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
          loggedAt: new Date(row.logged_at),
        }));

        onSuccess?.(meals);
        console.log('✅ Synced nutrition meals:', meals.length);
      }
    } catch (error) {
      console.error('❌ Error syncing nutrition meals:', error);
    }
  }

  async syncWaterLogs(userId: string, onSuccess?: (logs: any[]) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('nutrition_water_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('❌ Error syncing water logs:', error);
        return;
      }

      if (data) {
        const waterLogs = data.map(row => ({
          id: row.id,
          amount: row.amount,
          loggedAt: new Date(row.logged_at),
        }));

        onSuccess?.(waterLogs);
        console.log('✅ Synced water logs:', waterLogs.length);
      }
    } catch (error) {
      console.error('❌ Error syncing water logs:', error);
    }
  }

  async syncNutritionGoals(userId: string, onSuccess?: (goals: any) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Error syncing nutrition goals:', error);
        return;
      }

      if (data && data.length > 0) {
        const goals = data[0];
        
        onSuccess?.(goals);
        console.log('✅ Synced nutrition goals');
      }
    } catch (error) {
      console.error('❌ Error syncing nutrition goals:', error);
    }
  }

  async uploadNutritionMeal(userId: string, meal: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('nutrition_meals')
        .insert({
          user_id: userId,
          name: meal.name,
          description: meal.description,
          serving_weight: meal.servingWeight || 100, // Default to 100g if not provided
          calories: Math.round(meal.calories || 0), // Convert to integer
          protein: Math.round(meal.protein || 0), // Convert to integer
          carbs: Math.round(meal.carbs || 0), // Convert to integer
          fat: Math.round(meal.fat || 0), // Convert to integer
          fiber: Math.round(meal.fiber || 0), // Convert to integer
          sugar: Math.round(meal.sugar || 0), // Convert to integer
          sodium: Math.round(meal.sodium || 0), // Convert to integer
          meal_type: meal.mealType,
          logged_at: meal.loggedAt.toISOString(),
        });

      if (error) {
        console.error('❌ Error uploading nutrition meal:', error);
      } else {
        console.log('✅ Uploaded nutrition meal');
      }
    } catch (error) {
      console.error('❌ Error uploading nutrition meal:', error);
    }
  }

  async uploadWaterLog(userId: string, waterLog: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('nutrition_water_logs')
        .insert({
          user_id: userId,
          amount: waterLog.amount,
          logged_at: waterLog.loggedAt.toISOString(),
        });

      if (error) {
        console.error('❌ Error uploading water log:', error);
      } else {
        console.log('✅ Uploaded water log');
      }
    } catch (error) {
      console.error('❌ Error uploading water log:', error);
    }
  }

  async uploadNutritionGoals(userId: string, goals: any): Promise<void> {
    try {
      // First try to delete existing goals to avoid duplicate key error
      await supabase
        .from('nutrition_goals')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('nutrition_goals')
        .insert({
          user_id: userId,
          daily_calories: Math.round(goals.dailyCalories || 0),
          daily_protein: Math.round(goals.dailyProtein || 0),
          daily_carbs: Math.round(goals.dailyCarbs || 0),
          daily_fat: Math.round(goals.dailyFat || 0),
          daily_water: Math.round(goals.dailyWater || 0),
        });

      if (error) {
        console.error('❌ Error uploading nutrition goals:', error);
      } else {
        console.log('✅ Uploaded nutrition goals');
      }
    } catch (error) {
      console.error('❌ Error uploading nutrition goals:', error);
    }
  }

  // Custom Workout Plans Sync
  async syncCustomWorkoutPlans(userId: string, onSuccess?: (plans: any[]) => void): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('custom_workout_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error syncing custom workout plans:', error);
        return;
      }

      if (data) {
        const plans = data.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          difficultyLevel: row.difficulty_level as 'beginner' | 'intermediate' | 'advanced',
          goalType: row.goal_type as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance',
          daysPerWeek: row.days_per_week,
          estimatedDuration: row.estimated_duration,
          workoutDays: row.workout_days,
          createdAt: new Date(row.created_at),
        }));

        onSuccess?.(plans);
        console.log('✅ Synced custom workout plans:', plans.length);
      }
    } catch (error) {
      console.error('❌ Error syncing custom workout plans:', error);
    }
  }

  async uploadCustomWorkoutPlan(userId: string, plan: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('custom_workout_plans')
        .insert({
          user_id: userId,
          name: plan.name,
          description: plan.description,
          difficulty_level: plan.difficultyLevel,
          goal_type: plan.goalType,
          days_per_week: plan.daysPerWeek,
          estimated_duration: plan.estimatedDuration,
          workout_days: plan.workoutDays,
        });

      if (error) {
        console.error('❌ Error uploading custom workout plan:', error);
      } else {
        console.log('✅ Uploaded custom workout plan');
      }
    } catch (error) {
      console.error('❌ Error uploading custom workout plan:', error);
    }
  }

  // Full Sync
  async syncAllData(userId: string, callbacks: {
    onWorkoutSessions?: (sessions: any[]) => void;
    onBodyStats?: (stats: any[]) => void;
    onNutritionMeals?: (meals: any[]) => void;
    onWaterLogs?: (logs: any[]) => void;
    onNutritionGoals?: (goals: any) => void;
    onCustomWorkoutPlans?: (plans: any[]) => void;
  }): Promise<void> {
    console.log('🔄 Starting full data sync for user:', userId);
    
    try {
      await Promise.all([
        this.syncWorkoutSessions(userId, callbacks.onWorkoutSessions),
        this.syncBodyStats(userId, callbacks.onBodyStats),
        this.syncNutritionMeals(userId, callbacks.onNutritionMeals),
        this.syncWaterLogs(userId, callbacks.onWaterLogs),
        this.syncNutritionGoals(userId, callbacks.onNutritionGoals),
        this.syncCustomWorkoutPlans(userId, callbacks.onCustomWorkoutPlans),
      ]);
      
      console.log('✅ Full data sync completed');
    } catch (error) {
      console.error('❌ Error in syncAllData:', error);
      throw error;
    }
  }

  async uploadAllData(userId: string, data: {
    workoutSessions: any[];
    bodyStats: any[];
    nutritionMeals: any[];
    nutritionWaterLogs: any[];
    nutritionGoals: any;
    customWorkoutPlans: any[];
  }): Promise<void> {
    console.log('🔄 Starting full data upload...');
    
    // Upload all sessions
    for (const session of data.workoutSessions) {
      await this.uploadWorkoutSession(userId, session);
    }

    // Upload all body stats
    for (const stats of data.bodyStats) {
      await this.uploadBodyStats(userId, stats);
    }

    // Upload all meals
    for (const meal of data.nutritionMeals) {
      await this.uploadNutritionMeal(userId, meal);
    }

    // Upload all water logs
    for (const waterLog of data.nutritionWaterLogs) {
      await this.uploadWaterLog(userId, waterLog);
    }

    // Upload nutrition goals
    await this.uploadNutritionGoals(userId, data.nutritionGoals);
    
    // Upload custom workout plans
    for (const plan of data.customWorkoutPlans) {
      await this.uploadCustomWorkoutPlan(userId, plan);
    }

    console.log('✅ Full data upload completed');
  }
}

export const dataSyncService = new DataSyncServiceImpl(); 
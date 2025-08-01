import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useWorkoutStore } from '../../../src/store/workoutStore';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string[];
  sets: number;
  reps: number;
  restTime: number;
}

// Mock exercises data for different plans
const PLAN_EXERCISES = {
  'Weight Loss': [
    {
      id: 'wl-1',
      name: 'Burpees',
      description: 'High-intensity full-body exercise for maximum calorie burn',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      sets: 4,
      reps: 10,
      restTime: 45,
    },
    {
      id: 'wl-2',
      name: 'Mountain Climbers',
      description: 'Dynamic cardio exercise that targets core and shoulders',
      muscleGroup: 'Core, Shoulders',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 3,
      reps: 20,
      restTime: 30,
    },
    {
      id: 'wl-3',
      name: 'Jumping Jacks',
      description: 'Classic cardio exercise for heart rate elevation',
      muscleGroup: 'Cardio',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 3,
      reps: 30,
      restTime: 30,
    },
    {
      id: 'wl-4',
      name: 'High Knees',
      description: 'Running in place with high knee lifts',
      muscleGroup: 'Cardio, Legs',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 3,
      reps: 25,
      restTime: 45,
    },
  ],
  'Muscle Gain': [
    {
      id: 'mg-1',
      name: 'Push-ups',
      description: 'Compound chest exercise for upper body strength',
      muscleGroup: 'Chest, Triceps, Shoulders',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 4,
      reps: 12,
      restTime: 90,
    },
    {
      id: 'mg-2',
      name: 'Pull-ups',
      description: 'Upper body pulling exercise for back strength',
      muscleGroup: 'Back, Biceps',
      equipment: 'Pull-up Bar',
      difficulty: 'Intermediate',
      sets: 3,
      reps: 8,
      restTime: 120,
    },
    {
      id: 'mg-3',
      name: 'Squats',
      description: 'Lower body compound exercise for leg strength',
      muscleGroup: 'Legs',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 4,
      reps: 15,
      restTime: 90,
    },
    {
      id: 'mg-4',
      name: 'Dumbbell Rows',
      description: 'Unilateral back exercise for muscle balance',
      muscleGroup: 'Back',
      equipment: 'Dumbbells',
      difficulty: 'Intermediate',
      sets: 3,
      reps: 12,
      restTime: 60,
    },
  ],
  'Home Workout': [
    {
      id: 'hw-1',
      name: 'Push-ups',
      description: 'A classic bodyweight exercise that targets chest, shoulders, and triceps',
      muscleGroup: 'Chest, Shoulders, Triceps',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 3,
      reps: 12,
      restTime: 60,
    },
    {
      id: 'hw-2',
      name: 'Planks',
      description: 'Core strengthening exercise that improves stability',
      muscleGroup: 'Core, Shoulders',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 3,
      reps: 30,
      restTime: 45,
    },
    {
      id: 'hw-3',
      name: 'Squats',
      description: 'Lower body exercise that targets quads, glutes, and hamstrings',
      muscleGroup: 'Legs',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      sets: 4,
      reps: 15,
      restTime: 60,
    },
    {
      id: 'hw-4',
      name: 'Lunges',
      description: 'Unilateral leg exercise for balance and strength',
      muscleGroup: 'Legs',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      sets: 3,
      reps: 10,
      restTime: 45,
    },
  ],
};

export default function ExerciseListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { customPlans } = useWorkoutStore();
  
  // Get plan name from params or default to 'Home Workout'
  const planName = (params.planName as string) || 'Home Workout';
  
  // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getCurrentDayOfWeek = () => {
    const today = new Date();
    return today.getDay(); // 0-6
  };

  // Convert day number to day name
  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  // Get exercises based on plan type
  const getExercises = () => {
    // Check if it's a custom plan
    const customPlan = customPlans.find(plan => plan.name === planName);
    if (customPlan) {
      // Get current day of week
      const currentDay = getCurrentDayOfWeek();
      const currentDayName = getDayName(currentDay);
      
      // Find the workout day for today
      const todayWorkoutDay = customPlan.workoutDays.find(day => 
        day.dayName.toLowerCase().includes(currentDayName.toLowerCase()) ||
        day.dayName.toLowerCase().includes(`day ${currentDay}`) ||
        day.dayName.toLowerCase().includes(`thứ ${currentDay}`)
      );
      
      if (todayWorkoutDay && !todayWorkoutDay.isRestDay) {
        // Return exercises for today
        return todayWorkoutDay.exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          description: `${exercise.sets} sets × ${exercise.reps} reps`,
          muscleGroup: 'Custom',
          equipment: 'Bodyweight',
          difficulty: 'Custom',
          instructions: [],
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
        }));
      } else if (todayWorkoutDay && todayWorkoutDay.isRestDay) {
        // Today is a rest day
        return [];
      } else {
        // No specific day found, return all exercises
        return customPlan.workoutDays
          .filter(day => !day.isRestDay)
          .flatMap(day => 
            day.exercises.map(exercise => ({
              id: exercise.id,
              name: exercise.name,
              description: `${exercise.sets} sets × ${exercise.reps} reps`,
              muscleGroup: 'Custom',
              equipment: 'Bodyweight',
              difficulty: 'Custom',
              instructions: [],
              sets: exercise.sets,
              reps: exercise.reps,
              restTime: exercise.restTime,
            }))
          );
      }
    }
    
    // Return predefined exercises for known plans
    return PLAN_EXERCISES[planName as keyof typeof PLAN_EXERCISES] || PLAN_EXERCISES['Home Workout'];
  };

  const exercises = getExercises();

  const handleSelectExercise = (exercise: Exercise) => {
    router.push({
      pathname: '/(tabs)/workout/session',
      params: { 
        exerciseId: exercise.id,
        planName: planName
      }
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return colors.secondary[500];
      case 'intermediate':
        return colors.accent[500];
      case 'advanced':
        return colors.error;
      default:
        return colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercises</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Plan Info */}
        <Card variant="elevated" padding="lg" style={styles.planCard}>
          <View style={styles.planHeader}>
            <Ionicons name="fitness" size={32} color={colors.primary[500]} />
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{planName}</Text>
              <Text style={styles.planDescription}>
                {customPlans.find(plan => plan.name === planName) ? 
                  `Today's workout • ${exercises.length} exercises` :
                  `${exercises.length} exercises • ${exercises.length > 0 ? exercises[0].equipment : 'Bodyweight'} focused`
                }
              </Text>
            </View>
          </View>
        </Card>

        {/* Exercise List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose an Exercise</Text>
          
          {exercises.map((exercise, index) => (
            <Card
              key={exercise.id}
              variant="outlined"
              padding="md"
              style={styles.exerciseCard}
            >
              <TouchableOpacity
                style={styles.exerciseItem}
                onPress={() => handleSelectExercise(exercise)}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIcon}>
                    <Ionicons name="fitness" size={24} color={colors.primary[500]} />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                </View>
                
                <View style={styles.exerciseStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Sets</Text>
                    <Text style={styles.statValue}>{exercise.sets}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Reps</Text>
                    <Text style={styles.statValue}>{exercise.reps}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Rest</Text>
                    <Text style={styles.statValue}>{exercise.restTime}s</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  planCard: {
    marginBottom: spacing.lg,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  planName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  planDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    marginBottom: spacing.md,
  },
  exerciseItem: {
    // TouchableOpacity styles
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
}); 
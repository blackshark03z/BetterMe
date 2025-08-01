import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useWorkoutStore } from '../../../src/store/workoutStore';
import { useProgressStore } from '../../../src/store/progressStore';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // in seconds
  completed: boolean;
  currentSet: number;
  completedSets: number;
}

interface WorkoutSession {
  id: string;
  name: string;
  exercises: Exercise[];
  totalDuration: number; // in minutes
  currentExerciseIndex: number;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
}

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { customPlans } = useWorkoutStore();
  const { addSession } = useProgressStore();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0); // Accumulated time for exercise
  const [isWorkoutTimerRunning, setIsWorkoutTimerRunning] = useState(false);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const restTimerRef = useRef<NodeJS.Timeout>();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Mock workout session data
  useEffect(() => {
    const exerciseId = params.exerciseId as string;
    const planName = params.planName as string;
    
    // Get exercise data based on exerciseId and planName
    const getExerciseById = (id: string, plan: string) => {
      
      console.log('🔍 getExerciseById called:', { id, plan });
      
      // First check if it's a custom plan
      const customPlan = customPlans.find(p => p.name === plan);
      if (customPlan) {
        // Find the exercise in custom plan
        const customExercise = customPlan.workoutDays
          .flatMap(day => day.exercises)
          .find(ex => ex.id === id);
        
        if (customExercise) {
          console.log('✅ Found custom exercise:', customExercise);
          return {
            id: customExercise.id,
            name: customExercise.name,
            sets: customExercise.sets,
            reps: customExercise.reps,
            restTime: customExercise.restTime,
            completed: false,
            currentSet: 1,
            completedSets: 0,
          };
        }
      }
      
      // Fallback to predefined exercises
      const exercises = {
        // Weight Loss Plan
        'wl-1': { name: 'Burpees', sets: 4, reps: 10, restTime: 45 },
        'wl-2': { name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 30 },
        'wl-3': { name: 'Jumping Jacks', sets: 3, reps: 30, restTime: 30 },
        'wl-4': { name: 'High Knees', sets: 3, reps: 25, restTime: 45 },
        
        // Muscle Gain Plan
        'mg-1': { name: 'Push-ups', sets: 4, reps: 12, restTime: 90 },
        'mg-2': { name: 'Pull-ups', sets: 3, reps: 8, restTime: 120 },
        'mg-3': { name: 'Squats', sets: 4, reps: 15, restTime: 90 },
        'mg-4': { name: 'Dumbbell Rows', sets: 3, reps: 12, restTime: 60 },
        
        // Home Workout Plan
        'hw-1': { name: 'Push-ups', sets: 3, reps: 12, restTime: 60 },
        'hw-2': { name: 'Planks', sets: 3, reps: 30, restTime: 45 },
        'hw-3': { name: 'Squats', sets: 4, reps: 15, restTime: 60 },
        'hw-4': { name: 'Lunges', sets: 3, reps: 10, restTime: 45 },
        
        // Custom plan exercises (fallback)
        'ex-1': { name: 'Push-ups', sets: 3, reps: 12, restTime: 60 },
        'ex-2': { name: 'Planks', sets: 3, reps: 30, restTime: 45 },
        'ex-3': { name: 'Squats', sets: 4, reps: 15, restTime: 60 },
        'ex-4': { name: 'Lunges', sets: 3, reps: 10, restTime: 45 },
      };
      
      const exerciseData = exercises[id as keyof typeof exercises];
      if (exerciseData) {
        console.log('✅ Found predefined exercise:', exerciseData);
        return {
          id,
          name: exerciseData.name,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          restTime: exerciseData.restTime,
          completed: false,
          currentSet: 1,
          completedSets: 0,
        };
      }
      
      console.log('❌ Exercise not found, using fallback');
      
      // Final fallback
      return {
        id,
        name: 'Custom Exercise',
        sets: 3,
        reps: 10,
        restTime: 60,
        completed: false,
        currentSet: 1,
        completedSets: 0,
      };
    };

    const currentExercise = getExerciseById(exerciseId, planName);
    
    const mockSession: WorkoutSession = {
      id: 'session-1',
      name: 'Home Workout Plan',
      totalDuration: 45,
      currentExerciseIndex: 0,
      isActive: true,
      startTime: new Date(),
      exercises: [currentExercise],
    };
    setSession(mockSession);
  }, [params.exerciseId]);

  // Workout timer logic
  useEffect(() => {
    if (isWorkoutTimerRunning) {
      timerRef.current = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isWorkoutTimerRunning]);

  // Rest timer logic
  useEffect(() => {
    if (isRestTimerRunning && restTime > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [isRestTimerRunning, restTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkoutTimer = () => {
    setIsWorkoutTimerRunning(true);
    setIsRestTimerRunning(false);
  };

  const handleStartRestTimer = () => {
    setIsRestTimerRunning(true);
    setIsWorkoutTimerRunning(false);
    setRestTime(currentExercise.restTime);
  };

  const handleCompleteSet = () => {
    const newCompletedSets = completedSets + 1;
    setCompletedSets(newCompletedSets);
    
    // Add current set time to total (only workout time, not rest time)
    if (workoutTime > 0) {
      console.log('Set completion debug:', {
        set: newCompletedSets,
        workoutTime,
        restTime,
        currentSetTime: workoutTime, // Only workout time
        previousTotal: totalWorkoutTime,
        newTotal: totalWorkoutTime + workoutTime
      });
      setTotalWorkoutTime(prev => prev + workoutTime);
    }
    
    if (newCompletedSets >= currentExercise.sets) {
      // Exercise completed - show next exercise dialog
      handleExerciseCompleted();
      return;
    }
    
    setCurrentSet(prev => prev + 1);
    
    // Reset both timers for next set
    setIsWorkoutTimerRunning(false);
    setIsRestTimerRunning(false);
    setWorkoutTime(0);
    setRestTime(0);
  };



  const handleExerciseCompleted = () => {
    const isLastExercise = session && session.currentExerciseIndex >= session.exercises.length - 1;
    
    // Save session data to progress store
    if (session) {
      const currentExercise = session.exercises[session.currentExerciseIndex];
      const planName = params.planName as string;
      
      // Use accumulated total time for the exercise (only workout time)
      let finalTotalTime = totalWorkoutTime; // Start with accumulated workout time
      
      // Add current set workout time if timer is running
      if (isWorkoutTimerRunning) {
        finalTotalTime += workoutTime;
      }
      
      // Only count workout time, not rest time
      console.log('Time calculation debug:', {
        workoutTime,
        restTime,
        totalWorkoutTime,
        finalTotalTime,
        isWorkoutTimerRunning,
        isRestTimerRunning,
        note: 'Only workout time is counted for duration'
      });
      
      console.log('Timer Debug:', {
        workoutTime,
        restTime,
        totalWorkoutTime,
        finalTotalTime,
        isWorkoutTimerRunning,
        isRestTimerRunning
      });
      
      // Only save session if timer was actually used
      if (finalTotalTime > 0) {
        // Calculate calories based on exercise intensity and duration
        const caloriesPerMinute = 8; // Average calories burned per minute during workout
        const totalCalories = Math.round((finalTotalTime / 60) * caloriesPerMinute);
        
        console.log('Workout Session Debug:', {
          exerciseName: currentExercise.name,
          sets: currentExercise.sets,
          workoutTime, // current set workout time
          restTime, // current set rest time (not counted)
          totalWorkoutTime, // accumulated workout time from previous sets
          finalTotalTime, // total workout time for entire exercise
          totalCalories,
          note: 'Only workout time is saved to session'
        });
        
        addSession({
          planName,
          exerciseName: currentExercise.name,
          duration: finalTotalTime, // Total time for entire exercise
          sets: currentExercise.sets,
          reps: currentExercise.reps,
          completedSets: currentExercise.sets, // Always save the total sets as completed
          caloriesBurned: totalCalories,
        });
      } else {
        console.log('No timer used - session not saved');
      }
    }
    
    if (isLastExercise) {
      Alert.alert(
        'Exercise Completed!',
        'Great job! You\'ve completed all exercises in this plan.',
        [
          {
            text: 'Complete Workout',
            onPress: () => handleCompleteWorkout(),
          },
          {
            text: 'Back to Plan',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Exercise Completed!',
        'Great job! You\'ve completed all sets.',
        [
          {
            text: 'Next Exercise',
            onPress: () => handleNextExercise(),
          },
          {
            text: 'Back to Plan',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handleNextExercise = () => {
    // Navigate back to exercise list to choose next exercise
    router.push('/(tabs)/workout/exercise-detail');
  };

  const handleCompleteWorkout = () => {
    Alert.alert(
      'Workout Completed! 🎉',
      'Great job! You\'ve completed your workout.\n\n💡 Cool Down Suggestion:\n• 5-10 minutes of light stretching\n• Focus on major muscle groups worked\n• Deep breathing exercises\n• Hydrate well!',
      [
        {
          text: 'View Summary',
          onPress: () => router.push('/(tabs)/progress'),
        },
        {
          text: 'Back to Home',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const toggleWorkoutTimer = () => {
    if (!isWorkoutTimerRunning) {
      // Start workout timer, stop rest timer
      setIsWorkoutTimerRunning(true);
      setIsRestTimerRunning(false);
    } else {
      // Pause workout timer
      setIsWorkoutTimerRunning(false);
    }
  };

  const toggleRestTimer = () => {
    if (!isRestTimerRunning) {
      // Start rest timer, stop workout timer
      setIsRestTimerRunning(true);
      setIsWorkoutTimerRunning(false);
      // Set rest time to exercise default
      setRestTime(currentExercise.restTime);
    } else {
      // Pause rest timer
      setIsRestTimerRunning(false);
    }
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = session.exercises[session.currentExerciseIndex];

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
                   <View style={styles.headerCenter}>
            <Text style={styles.title}>{currentExercise.name}</Text>
            <Text style={styles.progressText}>
              {currentExercise.sets} sets × {currentExercise.reps} reps
            </Text>
          </View>
         <TouchableOpacity style={styles.menuButton}>
           <Ionicons name="ellipsis-vertical" size={24} color={colors.text.primary} />
         </TouchableOpacity>
       </View>

      {/* Workout Timer */}
      <Card variant="elevated" padding="lg" style={styles.timerCard}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Workout Time</Text>
          <Text style={styles.timerText}>{formatTime(workoutTime)}</Text>
          <TouchableOpacity style={styles.timerButton} onPress={toggleWorkoutTimer}>
            <Ionicons 
              name={isWorkoutTimerRunning ? "pause" : "play"} 
              size={24} 
              color={colors.primary[500]} 
            />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Rest Timer */}
      <Card variant="elevated" padding="lg" style={styles.restTimerCard}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Rest Time</Text>
          <Text style={styles.timerText}>{formatTime(restTime)}</Text>
          <TouchableOpacity style={styles.timerButton} onPress={toggleRestTimer}>
            <Ionicons 
              name={isRestTimerRunning ? "pause" : "play"} 
              size={24} 
              color={colors.secondary[500]} 
            />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Current Exercise */}
      <Card variant="elevated" padding="lg" style={styles.exerciseCard}>
        <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>
        <View style={styles.exerciseStats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Sets</Text>
            <Text style={styles.statValue}>
              {currentSet}/{currentExercise.sets}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Reps</Text>
            <Text style={styles.statValue}>{currentExercise.reps}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedSets}</Text>
          </View>
        </View>
        
        <Button
          title="Complete Set"
          onPress={handleCompleteSet}
          style={styles.completeButton}
          icon="checkmark-circle-outline"
        />
      </Card>

      {/* Current Exercise Info */}
      <Card variant="outlined" padding="md" style={styles.exerciseInfoCard}>
        <Text style={styles.exerciseInfoTitle}>Current Exercise</Text>
        <Text style={styles.exerciseInfoName}>{currentExercise.name}</Text>
        <Text style={styles.exerciseInfoDetails}>
          {currentExercise.sets} sets × {currentExercise.reps} reps
          {currentExercise.weight && ` @ ${currentExercise.weight}kg`}
        </Text>
      </Card>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  menuButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  timerCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timerText: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  timerButton: {
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  restTimerCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  exerciseTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
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
  completeButton: {
    marginTop: spacing.sm,
  },
  exerciseInfoCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  exerciseInfoTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  exerciseInfoName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  exerciseInfoDetails: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
}); 
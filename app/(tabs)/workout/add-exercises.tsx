import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useWorkoutStore } from '../../../src/store/workoutStore';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  weight?: number;
  notes?: string;
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
  exercises: Exercise[];
}

interface CreatePlanForm {
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  daysPerWeek: number;
  estimatedDuration: number;
}

// Predefined exercises for quick selection
const PREDEFINED_EXERCISES = [
  { name: 'Push-ups', muscleGroup: 'Chest, Triceps' },
  { name: 'Pull-ups', muscleGroup: 'Back, Biceps' },
  { name: 'Squats', muscleGroup: 'Legs' },
  { name: 'Lunges', muscleGroup: 'Legs' },
  { name: 'Planks', muscleGroup: 'Core' },
  { name: 'Burpees', muscleGroup: 'Full Body' },
  { name: 'Mountain Climbers', muscleGroup: 'Core' },
  { name: 'Jumping Jacks', muscleGroup: 'Cardio' },
  { name: 'Dumbbell Rows', muscleGroup: 'Back' },
  { name: 'Dumbbell Press', muscleGroup: 'Shoulders' },
  { name: 'Deadlifts', muscleGroup: 'Back, Legs' },
  { name: 'Bench Press', muscleGroup: 'Chest' },
];

export default function AddExercisesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addCustomPlan } = useWorkoutStore();
  
  const [planData, setPlanData] = useState<CreatePlanForm | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    sets: 3,
    reps: 10,
    restTime: 60,
  });

  useEffect(() => {
    if (params.planData && params.workoutDays) {
      try {
        const parsedPlanData = JSON.parse(params.planData as string) as CreatePlanForm;
        const parsedWorkoutDays = JSON.parse(params.workoutDays as string) as WorkoutDay[];
        
        setPlanData(parsedPlanData);
        setWorkoutDays(parsedWorkoutDays.map(day => ({
          ...day,
          exercises: day.exercises || []
        })));
      } catch (error) {
        console.error('Error parsing data:', error);
        Alert.alert('Error', 'Invalid data');
        router.back();
      }
    }
  }, [params.planData, params.workoutDays]);

  const handleAddExercise = () => {
    if (!selectedDay) {
      Alert.alert('Error', 'Please select a day first');
      return;
    }

    if (!newExercise.name?.trim()) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    const exercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: newExercise.name,
      sets: newExercise.sets || 3,
      reps: newExercise.reps || 10,
      restTime: newExercise.restTime || 60,
      weight: newExercise.weight,
      notes: newExercise.notes,
    };

    setWorkoutDays(prev => 
      prev.map(day => 
        day.id === selectedDay 
          ? { ...day, exercises: [...day.exercises, exercise] }
          : day
      )
    );

    // Reset form
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      restTime: 60,
    });
    setShowExerciseForm(false);
  };

  const handleRemoveExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(prev => 
      prev.map(day => 
        day.id === dayId 
          ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) }
          : day
      )
    );
  };

  const handleSelectPredefinedExercise = (exerciseName: string) => {
    setNewExercise(prev => ({ ...prev, name: exerciseName }));
  };

  const handleCreatePlan = () => {
    // Validate that all workout days have at least one exercise
    const daysWithoutExercises = workoutDays.filter(
      day => !day.isRestDay && day.exercises.length === 0
    );

    if (daysWithoutExercises.length > 0) {
      Alert.alert(
        'Incomplete Plan', 
        `The following days need exercises: ${daysWithoutExercises.map(d => d.dayName).join(', ')}`
      );
      return;
    }

    if (!planData) {
      Alert.alert('Error', 'Plan data not found');
      return;
    }

    // Save plan to store
    addCustomPlan({
      name: planData.name,
      description: planData.description,
      difficultyLevel: planData.difficultyLevel,
      goalType: planData.goalType,
      daysPerWeek: planData.daysPerWeek,
      estimatedDuration: planData.estimatedDuration,
      workoutDays: workoutDays,
    });

    Alert.alert(
      'Success!', 
      'Your custom workout plan has been created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/workout')
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (!planData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeDays = workoutDays.filter(day => !day.isRestDay);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Button
              variant="text"
              onPress={handleBack}
              icon="arrow-back"
              style={styles.backButton}
            />
            <Text style={styles.title}>Add Exercises</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>
            Add exercises to each workout day
          </Text>
        </View>

        {/* Plan Summary */}
        <Card variant="elevated" padding="md" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Plan: {planData.name}</Text>
          <Text style={styles.summaryText}>
            {activeDays.length} workout days • {planData.estimatedDuration} min
          </Text>
        </Card>

        {/* Workout Days */}
        {activeDays.map((day) => (
          <Card key={day.id} variant="elevated" padding="md" style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayTitle}>{day.dayName}</Text>
                <Text style={styles.exerciseCount}>
                  {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  selectedDay === day.id && styles.addButtonActive
                ]}
                onPress={() => {
                  setSelectedDay(selectedDay === day.id ? null : day.id);
                  setShowExerciseForm(false);
                }}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={selectedDay === day.id ? colors.background.light : colors.primary[500]} 
                />
              </TouchableOpacity>
            </View>

            {/* Exercises List */}
            {day.exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps • {exercise.restTime}s rest
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveExercise(day.id, exercise.id)}
                >
                  <Ionicons name="trash" size={16} color={colors.error[500]} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Exercise Form */}
            {selectedDay === day.id && (
              <View style={styles.exerciseForm}>
                <Text style={styles.formTitle}>Add Exercise</Text>
                
                {/* Predefined Exercises */}
                <View style={styles.predefinedSection}>
                  <Text style={styles.predefinedTitle}>Quick Add:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.predefinedList}>
                      {PREDEFINED_EXERCISES.map((ex) => (
                        <TouchableOpacity
                          key={ex.name}
                          style={styles.predefinedItem}
                          onPress={() => handleSelectPredefinedExercise(ex.name)}
                        >
                          <Text style={styles.predefinedText}>{ex.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <Input
                  label="Exercise Name"
                  placeholder="e.g., Push-ups"
                  value={newExercise.name}
                  onChangeText={(value) => setNewExercise(prev => ({ ...prev, name: value }))}
                  style={styles.input}
                />

                <View style={styles.row}>
                  <Input
                    label="Sets"
                    placeholder="3"
                    value={newExercise.sets?.toString()}
                    onChangeText={(value) => setNewExercise(prev => ({ ...prev, sets: parseInt(value) || 0 }))}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                  <Input
                    label="Reps"
                    placeholder="10"
                    value={newExercise.reps?.toString()}
                    onChangeText={(value) => setNewExercise(prev => ({ ...prev, reps: parseInt(value) || 0 }))}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>

                <Input
                  label="Rest Time (seconds)"
                  placeholder="60"
                  value={newExercise.restTime?.toString()}
                  onChangeText={(value) => setNewExercise(prev => ({ ...prev, restTime: parseInt(value) || 0 }))}
                  keyboardType="numeric"
                  style={styles.input}
                />

                <View style={styles.formButtons}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setSelectedDay(null);
                      setNewExercise({
                        name: '',
                        sets: 3,
                        reps: 10,
                        restTime: 60,
                      });
                    }}
                    style={styles.cancelButton}
                  />
                  <Button
                    title="Add Exercise"
                    onPress={handleAddExercise}
                    style={styles.addExerciseButton}
                  />
                </View>
              </View>
            )}
          </Card>
        ))}

        {/* Create Plan Button */}
        <Button
          title="Create Workout Plan"
          onPress={handleCreatePlan}
          style={styles.createButton}
          icon="checkmark"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginVertical: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backButton: {
    minWidth: 40,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  dayCard: {
    marginBottom: spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  exerciseCount: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: colors.primary[500],
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  exerciseDetails: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  removeButton: {
    padding: spacing.xs,
  },
  exerciseForm: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  formTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  predefinedSection: {
    marginBottom: spacing.md,
  },
  predefinedTitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  predefinedList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  predefinedItem: {
    backgroundColor: colors.background.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  predefinedText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  input: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  addExerciseButton: {
    flex: 1,
  },
  createButton: {
    marginTop: spacing.xl,
  },
}); 
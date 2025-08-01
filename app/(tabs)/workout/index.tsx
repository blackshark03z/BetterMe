import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useWorkoutStore } from '../../../src/store/workoutStore';

export default function WorkoutIndexScreen() {
  const router = useRouter();
  const { customPlans, removeCustomPlan } = useWorkoutStore();
  
  const handleStartWorkout = (planName: string) => {
    router.push({
      pathname: '/(tabs)/workout/exercise-detail',
      params: { planName }
    });
  };

  const handleCreateCustomPlan = () => {
    router.push('/(tabs)/workout/create-plan');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏋️ Workout Plans</Text>
          <Text style={styles.subtitle}>Choose your fitness journey</Text>
        </View>

        {/* Pre-made Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Plans</Text>
          
          <Card variant="elevated" padding="md" style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="flame" size={24} color={colors.accent[500]} />
              <Text style={styles.planTitle}>Weight Loss Plan</Text>
            </View>
            <Text style={styles.planDescription}>
              High-intensity cardio and strength training to burn calories
            </Text>
            <View style={styles.planStats}>
              <Text style={styles.stat}>⏱️ 30-45 min</Text>
              <Text style={styles.stat}>📅 5 days/week</Text>
              <Text style={styles.stat}>🔥 Beginner</Text>
            </View>
            <Button 
              title="Start Plan" 
              onPress={() => handleStartWorkout('Weight Loss')} 
              style={styles.startButton}
              icon="play-outline"
            />
          </Card>

          <Card variant="elevated" padding="md" style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="fitness" size={24} color={colors.secondary[500]} />
              <Text style={styles.planTitle}>Muscle Gain Plan</Text>
            </View>
            <Text style={styles.planDescription}>
              Progressive overload training to build strength and muscle
            </Text>
            <View style={styles.planStats}>
              <Text style={styles.stat}>⏱️ 45-60 min</Text>
              <Text style={styles.stat}>📅 4 days/week</Text>
              <Text style={styles.stat}>💪 Intermediate</Text>
            </View>
            <Button 
              title="Start Plan" 
              onPress={() => handleStartWorkout('Muscle Gain')} 
              style={styles.startButton}
              icon="play-outline"
            />
          </Card>

          <Card variant="elevated" padding="md" style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="home" size={24} color={colors.primary[500]} />
              <Text style={styles.planTitle}>Home Workout Plan</Text>
            </View>
            <Text style={styles.planDescription}>
              No equipment needed, bodyweight exercises for all levels
            </Text>
            <View style={styles.planStats}>
              <Text style={styles.stat}>⏱️ 20-30 min</Text>
              <Text style={styles.stat}>📅 6 days/week</Text>
              <Text style={styles.stat}>🏠 Beginner</Text>
            </View>
            <Button 
              title="Start Plan" 
              onPress={() => handleStartWorkout('Home Workout')} 
              style={styles.startButton}
              icon="play-outline"
            />
          </Card>
        </View>

        {/* Custom Plans */}
        {customPlans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Custom Plans</Text>
            {customPlans.map((plan) => (
              <Card key={plan.id} variant="elevated" padding="md" style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Ionicons name="person" size={24} color={colors.primary[500]} />
                  <Text style={styles.planTitle}>{plan.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeCustomPlan(plan.id)}
                  >
                    <Ionicons name="trash" size={16} color={colors.error[500]} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.planDescription}>
                  {plan.description || 'Your custom workout plan'}
                </Text>
                <View style={styles.planStats}>
                  <Text style={styles.stat}>⏱️ {plan.estimatedDuration} min</Text>
                  <Text style={styles.stat}>📅 {plan.daysPerWeek} days/week</Text>
                  <Text style={styles.stat}>
                    {plan.difficultyLevel === 'beginner' ? '🌱' : 
                     plan.difficultyLevel === 'intermediate' ? '💪' : '🔥'} 
                    {plan.difficultyLevel}
                  </Text>
                </View>
                <Button 
                  title="Start Plan" 
                  onPress={() => handleStartWorkout(plan.name)} 
                  style={styles.startButton}
                  icon="play-outline"
                />
              </Card>
            ))}
          </View>
        )}


      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateCustomPlan}
      >
        <Ionicons name="add" size={24} color={colors.background.light} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  planCard: {
    marginBottom: spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  planDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stat: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  startButton: {
    marginTop: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
}); 
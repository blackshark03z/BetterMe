import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { useProgressStore } from '../../src/store/progressStore';
import { useNutritionStore } from '../../src/store/nutritionStore';

const { width } = Dimensions.get('window');



export default function ProgressScreen() {
  const router = useRouter();
  const { progress, sessions, getWeeklyStats, updateProgress } = useProgressStore();
  const { getTodayNutrition } = useNutritionStore();
  
  // Update progress when component mounts
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);
  
  const weeklyStats = getWeeklyStats();
  const nutrition = getTodayNutrition();
  
  // Debug logs
  console.log('Progress Debug:', {
    weeklyGoal: progress.weeklyGoal,
    weeklyProgress: progress.weeklyProgress,
    workoutsThisWeek: weeklyStats.workoutsThisWeek,
    totalWorkouts: progress.totalWorkouts,
    calculatedProgress: (weeklyStats.workoutsThisWeek / progress.weeklyGoal) * 100,
  });
  
  // Debug all sessions
  console.log('All Sessions Debug:', {
    totalSessions: sessions.length,
    sessions: sessions.map(s => ({
      id: s.id,
      exerciseName: s.exerciseName,
      duration: s.duration, // in seconds
      durationInMinutes: s.duration / 60,
      date: s.date,
    })),
    weeklyStats: {
      workoutsThisWeek: weeklyStats.workoutsThisWeek,
      totalDuration: weeklyStats.totalDuration, // in minutes
      totalCalories: weeklyStats.totalCalories,
    }
  });
  
  // Debug recent sessions display
  console.log('Recent Sessions Display Debug:', {
    sessionsToShow: sessions.slice(0, 10).map(s => ({
      exerciseName: s.exerciseName,
      planName: s.planName,
      duration: s.duration,
      date: s.date,
    })),
    totalSessions: sessions.length,
    note: 'Now showing top 10 sessions instead of 5'
  });


  const formatDuration = (minutes: number) => {
    // Handle very small durations (less than 1 minute)
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds}s`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };


  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.statsGrid}>
            <Card variant="elevated" padding="md" style={styles.statCard}>
              <View style={styles.statContent}>
                <Ionicons name="fitness" size={24} color={colors.primary[500]} />
                <Text style={styles.statValue}>{progress.totalWorkouts}</Text>
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
            </Card>

            <Card variant="elevated" padding="md" style={styles.statCard}>
              <View style={styles.statContent}>
                <Ionicons name="time" size={24} color={colors.secondary[500]} />
                <Text style={styles.statValue}>{formatDuration(progress.totalDuration)}</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </Card>

            <Card variant="elevated" padding="md" style={styles.statCard}>
              <View style={styles.statContent}>
                <Ionicons name="flame" size={24} color={colors.error[500]} />
                <Text style={styles.statValue}>{progress.totalCalories}</Text>
                <Text style={styles.statLabel}>Calories Burned</Text>
              </View>
            </Card>

            <Card variant="elevated" padding="md" style={styles.statCard}>
              <View style={styles.statContent}>
                <Ionicons name="trending-up" size={24} color={colors.success[500]} />
                <Text style={styles.statValue}>{progress.streakDays}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          
          <Card variant="elevated" padding="lg" style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Weekly Goal</Text>
              <Text style={styles.weeklyProgress}>
                {weeklyStats.workoutsThisWeek} / {progress.weeklyGoal} workouts
              </Text>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={() => {
                  const { setWeeklyGoal } = useProgressStore.getState();
                  setWeeklyGoal(5);
                  updateProgress();
                }}
              >
                <Text style={styles.testButtonText}>Test: Set 5</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((weeklyStats.workoutsThisWeek / progress.weeklyGoal) * 100, 100)}%` }
                ]} 
              />
            </View>

            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyStatValue}>{formatDuration(weeklyStats.totalDuration)}</Text>
                <Text style={styles.weeklyStatLabel}>Time</Text>
              </View>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyStatValue}>{weeklyStats.totalCalories}</Text>
                <Text style={styles.weeklyStatLabel}>Calories</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Nutrition Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Progress</Text>
          
          <Card variant="elevated" padding="lg" style={styles.nutritionCard}>
            <View style={styles.nutritionHeader}>
              <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
              <Text style={styles.nutritionProgress}>
                {nutrition.totalCalories} / {2000} calories
              </Text>
            </View>
            
            <View style={styles.nutritionProgressBar}>
              <View 
                style={[
                  styles.nutritionProgressFill, 
                  { width: `${Math.min(nutrition.calorieProgress, 100)}%` }
                ]} 
              />
            </View>

            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>{nutrition.totalProtein}g</Text>
                </View>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min((nutrition.totalProtein / 150) * 100, 100)}%`,
                        backgroundColor: colors.primary[500],
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>{nutrition.totalCarbs}g</Text>
                </View>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min((nutrition.totalCarbs / 200) * 100, 100)}%`,
                        backgroundColor: colors.secondary[500],
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroLabel}>Fat</Text>
                  <Text style={styles.macroValue}>{nutrition.totalFat}g</Text>
                </View>
                <View style={styles.macroBar}>
                  <View 
                    style={[
                      styles.macroFill, 
                      { 
                        width: `${Math.min((nutrition.totalFat / 65) * 100, 100)}%`,
                        backgroundColor: colors.accent[500],
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>

            <View style={styles.waterSection}>
              <View style={styles.waterHeader}>
                <View style={styles.waterTitleContainer}>
                  <Ionicons name="water" size={20} color={colors.primary[500]} />
                  <Text style={styles.waterTitle}>Water Intake</Text>
                </View>
                <Text style={styles.waterProgress}>
                  {nutrition.totalWater}ml / 2500ml
                </Text>
              </View>
              
              <View style={styles.waterProgressBar}>
                <View 
                  style={[
                    styles.waterProgressFill, 
                    { width: `${Math.min(nutrition.waterProgress, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Progress Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Progress</Text>
          
          <View style={styles.navigationGrid}>
            <TouchableOpacity
              style={styles.navigationCard}
              onPress={() => router.push('/(tabs)/progress/body-stats')}
            >
              <Ionicons name="body" size={32} color={colors.primary[500]} />
              <Text style={styles.navigationTitle}>Body Stats</Text>
              <Text style={styles.navigationSubtitle}>Weight, measurements, BMI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationCard}
              onPress={() => {}}
            >
              <Ionicons name="analytics" size={32} color={colors.secondary[500]} />
              <Text style={styles.navigationTitle}>Workout Analytics</Text>
              <Text style={styles.navigationSubtitle}>Personal bests, trends</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          
          {sessions.length === 0 ? (
            <Card variant="outlined" padding="lg" style={styles.emptyCard}>
              <Ionicons name="fitness-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptySubtitle}>
                Complete your first workout to see your progress here
              </Text>
            </Card>
          ) : (
            sessions.slice(0, 10).map((session) => (
              <Card key={session.id} variant="outlined" padding="md" style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionExercise}>{session.exerciseName}</Text>
                    <Text style={styles.sessionPlan}>{session.planName}</Text>
                  </View>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.date)}
                  </Text>
                </View>
                
                <View style={styles.sessionStats}>
                  <View style={styles.sessionStat}>
                    <Text style={styles.sessionStatValue}>{formatDuration(session.duration / 60)}</Text>
                    <Text style={styles.sessionStatLabel}>Duration</Text>
                  </View>
                  <View style={styles.sessionStat}>
                    <Text style={styles.sessionStatValue}>{session.completedSets}/{session.sets}</Text>
                    <Text style={styles.sessionStatLabel}>Sets</Text>
                  </View>
                  <View style={styles.sessionStat}>
                    <Text style={styles.sessionStatValue}>{session.caloriesBurned}</Text>
                    <Text style={styles.sessionStatLabel}>Calories</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginVertical: spacing.xl,
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '45%',
    marginBottom: spacing.md,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  weeklyCard: {
    marginBottom: spacing.md,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weeklyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  weeklyProgress: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  weeklyStatLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  sessionCard: {
    marginBottom: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionExercise: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  sessionPlan: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  sessionDate: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionStat: {
    alignItems: 'center',
  },
  sessionStatValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  sessionStatLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  // Nutrition Charts Styles
  nutritionCard: {
    marginBottom: spacing.md,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nutritionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  nutritionProgress: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  nutritionProgressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    marginBottom: spacing.lg,
  },
  nutritionProgressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  macroGrid: {
    marginBottom: spacing.lg,
  },
  macroItem: {
    marginBottom: spacing.md,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  macroBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
  },
  macroFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  waterSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  waterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  waterProgress: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  // Navigation Styles
  navigationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationCard: {
    width: '48%',
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  navigationSubtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  testButtonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: '#ffffff',
  },
}); 
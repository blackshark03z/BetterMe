import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';
import { useProgressStore } from '../../src/store/progressStore';
import { useNutritionStore } from '../../src/store/nutritionStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { sessions, bodyStats } = useProgressStore();
  const { meals, waterLogs } = useNutritionStore();

  // Calculate real stats
  const totalWorkouts = sessions.length;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const currentStreak = calculateStreak(sessions);
  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const latestWeight = bodyStats.length > 0 ? bodyStats[bodyStats.length - 1].weight : null;

  function formatDate(date: Date | string | undefined) {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toLocaleDateString();
    } catch (error) {
      return '';
    }
  }

  function calculateStreak(sessions: any[]) {
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    const dates = sessions
      .filter(s => s.date) // Filter out sessions without date
      .map(s => {
        try {
          const dateObj = typeof s.date === 'string' ? new Date(s.date) : s.date;
          if (isNaN(dateObj.getTime())) return null;
          return dateObj.toDateString();
        } catch (error) {
          return null;
        }
      })
      .filter(date => date !== null); // Remove invalid dates
    
    const uniqueDates = [...new Set(dates)];
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateString = currentDate.toDateString();
      if (uniqueDates.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'workout':
        router.push('/(tabs)/workout');
        break;
      case 'nutrition':
        router.push('/(tabs)/nutrition');
        break;
      case 'progress':
        router.push('/(tabs)/progress');
        break;
      case 'body-stats':
        router.push('/(tabs)/progress/body-stats');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {user?.user_metadata?.full_name || 'User'}
            </Text>
          </View>
                     <TouchableOpacity style={styles.profileButton}>
             <Ionicons name="person-circle" size={32} color={colors.primary[500]} />
           </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Progress</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Ionicons name="flame" size={24} color={colors.warning[500]} />
              <Text style={styles.summaryValue}>{currentStreak}</Text>
              <Text style={styles.summaryLabel}>Day Streak</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="fitness" size={24} color={colors.primary[500]} />
              <Text style={styles.summaryValue}>{totalWorkouts}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="nutrition" size={24} color={colors.success[500]} />
              <Text style={styles.summaryValue}>{Math.round(totalCalories)}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="water" size={24} color={colors.info[500]} />
              <Text style={styles.summaryValue}>{Math.round(totalWater)}</Text>
              <Text style={styles.summaryLabel}>Water (ml)</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('workout')}
          >
            <Ionicons name="fitness" size={28} color={colors.primary[500]} />
            <Text style={styles.actionText}>Start Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('nutrition')}
          >
            <Ionicons name="restaurant" size={28} color={colors.secondary[500]} />
            <Text style={styles.actionText}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('body-stats')}
          >
            <Ionicons name="scale" size={28} color={colors.accent[500]} />
            <Text style={styles.actionText}>Body Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('progress')}
          >
            <Ionicons name="trending-up" size={28} color={colors.success[500]} />
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
                 <Card variant="elevated" padding="md" style={styles.activityCard}>
           {sessions.filter(s => s.date).length > 0 ? (
             sessions
               .filter(s => s.date) // Only show sessions with valid dates
               .slice(0, 3)
               .map((session, index) => (
                 <View key={index} style={styles.activityItem}>
                   <Ionicons name="fitness" size={20} color={colors.primary[500]} />
                   <View style={styles.activityInfo}>
                     <Text style={styles.activityTitle}>Workout Completed</Text>
                     <Text style={styles.activityTime}>
                       {formatDate(session.date)}
                     </Text>
                   </View>
                 </View>
               ))
           ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="fitness-outline" size={32} color={colors.text.secondary} />
              <Text style={styles.emptyText}>No workouts yet</Text>
              <Text style={styles.emptySubtext}>Start your fitness journey today!</Text>
            </View>
          )}
        </Card>

        {/* Today's Goals */}
        <Text style={styles.sectionTitle}>Today's Goals</Text>
        <Card variant="outlined" padding="md" style={styles.goalsCard}>
          <View style={styles.goalItem}>
            <Ionicons name="fitness" size={20} color={colors.primary[500]} />
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Complete 1 Workout</Text>
              <View style={styles.goalProgress}>
                <View style={[styles.progressBar, { width: `${Math.min((totalWorkouts / 1) * 100, 100)}%` }]} />
              </View>
            </View>
          </View>
          <View style={styles.goalItem}>
            <Ionicons name="water" size={20} color={colors.info[500]} />
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Drink 2L Water</Text>
              <View style={styles.goalProgress}>
                <View style={[styles.progressBar, { width: `${Math.min((totalWater / 2000) * 100, 100)}%` }]} />
              </View>
            </View>
          </View>
        </Card>

        {/* Weight Tracker */}
        {latestWeight && (
          <>
            <Text style={styles.sectionTitle}>Weight Tracker</Text>
            <Card variant="elevated" padding="md" style={styles.weightCard}>
              <View style={styles.weightInfo}>
                <Ionicons name="scale" size={24} color={colors.accent[500]} />
                <View style={styles.weightDetails}>
                  <Text style={styles.weightValue}>{latestWeight} kg</Text>
                  <Text style={styles.weightLabel}>Current Weight</Text>
                </View>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  profileButton: {
    padding: spacing.xs,
  },

  summaryCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.background.light,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginRight: '2%',
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  activityCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  activityTime: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  goalsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  goalTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  goalProgress: {
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  weightCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  weightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightDetails: {
    marginLeft: spacing.md,
  },
  weightValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  weightLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
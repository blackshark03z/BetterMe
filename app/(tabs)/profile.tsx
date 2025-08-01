import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';
import { useProgressStore } from '../../src/store/progressStore';
import { useNutritionStore } from '../../src/store/nutritionStore';

// Mock avatar options
const avatarOptions = [
  { id: 1, name: 'Default', icon: 'person' },
  { id: 2, name: 'Athlete', icon: 'fitness' },
  { id: 3, name: 'Runner', icon: 'walk' },
  { id: 4, name: 'Yogi', icon: 'body' },
];

// Mock achievements
const achievements = [
  { id: 1, name: 'First Workout', icon: 'trophy', earned: true },
  { id: 2, name: '7 Day Streak', icon: 'flame', earned: true },
  { id: 3, name: 'Weight Goal', icon: 'trending-down', earned: false },
  { id: 4, name: 'Nutrition Master', icon: 'nutrition', earned: false },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, loading } = useAuthStore();
  const { sessions, bodyStats } = useProgressStore();
  const { meals, waterLogs } = useNutritionStore();
  
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Calculate real stats
  const totalWorkouts = sessions.length;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const currentStreak = calculateStreak(sessions);
  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const latestWeight = bodyStats.length > 0 ? bodyStats[bodyStats.length - 1].weight : null;

  function calculateStreak(sessions: any[]) {
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    const dates = sessions.map(s => new Date(s.date).toDateString());
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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Edit your personal details',
      onPress: () => router.push('/(tabs)/profile/edit'),
    },
    {
      icon: 'fitness-outline',
      title: 'Fitness Goals',
      subtitle: 'Set your fitness targets',
      onPress: () => router.push('/(tabs)/profile/goals'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notifications',
      onPress: () => router.push('/(tabs)/profile/notifications'),
    },
    {
      icon: 'shield-outline',
      title: 'Security',
      subtitle: 'Account security settings',
      onPress: () => router.push('/(tabs)/profile/security'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'User guide and support',
      onPress: () => Alert.alert('Coming soon', 'This feature will be available soon!'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About App',
      subtitle: 'Version information',
      onPress: () => Alert.alert('BetterMe', 'Version 1.0.0\nWellness Transformation App'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <Card variant="elevated" padding="lg" style={styles.userCard}>
          <View style={styles.userInfo}>
            <TouchableOpacity 
              style={styles.avatar}
              onPress={() => setShowAvatarModal(true)}
            >
              <Ionicons 
                name={avatarOptions.find(a => a.id === selectedAvatar)?.icon as any} 
                size={32} 
                color={colors.primary[500]} 
              />
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={12} color={colors.white} />
              </View>
            </TouchableOpacity>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.user_metadata?.full_name || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {latestWeight && (
                <Text style={styles.userWeight}>Weight: {latestWeight}kg</Text>
              )}
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color={colors.warning[500]} />
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="fitness" size={24} color={colors.primary[500]} />
              <Text style={styles.statNumber}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="nutrition" size={24} color={colors.success[500]} />
              <Text style={styles.statNumber}>{Math.round(totalCalories)}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="water" size={24} color={colors.info[500]} />
              <Text style={styles.statNumber}>{Math.round(totalWater)}</Text>
              <Text style={styles.statLabel}>Water (ml)</Text>
            </View>
          </View>
        </Card>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <Card variant="outlined" padding="md" style={styles.goalsCard}>
            <View style={styles.goalItem}>
              <Ionicons name="trending-up" size={20} color={colors.primary[500]} />
              <Text style={styles.goalText}>Workout 3 times per week</Text>
              <View style={styles.goalProgress}>
                <View style={[styles.progressBar, { width: `${Math.min((totalWorkouts / 12) * 100, 100)}%` }]} />
              </View>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="water" size={20} color={colors.info[500]} />
              <Text style={styles.goalText}>Drink 2L water daily</Text>
              <View style={styles.goalProgress}>
                <View style={[styles.progressBar, { width: `${Math.min((totalWater / 2000) * 100, 100)}%` }]} />
              </View>
            </View>
          </Card>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {/* Row 1 */}
            <View style={styles.achievementRow}>
              {achievements.slice(0, 2).map((achievement) => (
                <Card 
                  key={achievement.id} 
                  variant="outlined" 
                  padding="sm" 
                  style={[
                    styles.achievementCard,
                    !achievement.earned && styles.achievementLocked
                  ]}
                >
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={24} 
                    color={achievement.earned ? colors.warning[500] : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.achievementText,
                    !achievement.earned && styles.achievementTextLocked
                  ]}>
                    {achievement.name}
                  </Text>
                </Card>
              ))}
            </View>
            {/* Row 2 */}
            <View style={styles.achievementRow}>
              {achievements.slice(2, 4).map((achievement) => (
                <Card 
                  key={achievement.id} 
                  variant="outlined" 
                  padding="sm" 
                  style={[
                    styles.achievementCard,
                    !achievement.earned && styles.achievementLocked
                  ]}
                >
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={24} 
                    color={achievement.earned ? colors.warning[500] : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.achievementText,
                    !achievement.earned && styles.achievementTextLocked
                  ]}>
                    {achievement.name}
                  </Text>
                </Card>
              ))}
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary[500]} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            loading={loading}
            disabled={loading}
            variant="outlined"
            style={styles.signOutButton}
            icon="log-out-outline"
          />
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  userCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userWeight: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  goalsCard: {
    marginBottom: spacing.md,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  goalProgress: {
    width: 60,
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
  achievementsGrid: {
    flexDirection: 'column',
    paddingHorizontal: spacing.sm,
  },
  achievementRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementText: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  achievementTextLocked: {
    color: colors.text.secondary,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  signOutSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    marginTop: spacing.md,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { runAllTests } from '../../src/utils/test-database';

export default function HomeScreen() {
  const handleTestDatabase = async () => {
    try {
      console.log('🧪 Testing database connection...');
      const success = await runAllTests();
      if (success) {
        alert('✅ Database connection successful!');
      } else {
        alert('❌ Database connection failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test failed: ' + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BetterMe</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <Card variant="elevated" padding="md" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </Card>

        {/* Database Test Button */}
        <Card variant="outlined" padding="md" style={styles.testCard}>
          <Text style={styles.testTitle}>Database Test</Text>
          <Text style={styles.testDescription}>
            Test your Supabase database connection
          </Text>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleTestDatabase}
          >
            <Text style={styles.testButtonText}>Test Database</Text>
          </TouchableOpacity>
        </Card>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card variant="elevated" padding="md" style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="fitness" size={20} color={colors.primary[500]} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Morning Workout</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="restaurant" size={20} color={colors.secondary[500]} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Lunch Logged</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="scale" size={20} color={colors.accent[500]} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Weight Updated</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="fitness" size={24} color={colors.primary[500]} />
            <Text style={styles.actionText}>Start Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="restaurant" size={24} color={colors.secondary[500]} />
            <Text style={styles.actionText}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="scale" size={24} color={colors.accent[500]} />
            <Text style={styles.actionText}>Log Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trending-up" size={24} color={colors.success} />
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary.light,
  },
  addButton: {
    padding: spacing.xs,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary.light,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary.light,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[300],
  },
  testCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  testTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary.light,
    marginBottom: spacing.xs,
  },
  testDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary.light,
    marginBottom: spacing.md,
  },
  testButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: colors.background.light,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary.light,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
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
    fontWeight: typography.fontWeights.normal,
    color: colors.text.primary.light,
  },
  activityTime: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary.light,
    marginTop: spacing.xs,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.surface.light,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginRight: '2%',
  },
  actionText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.primary.light,
    marginTop: spacing.xs,
  },
}); 
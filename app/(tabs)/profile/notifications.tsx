import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    workoutReminders: true,
    mealReminders: true,
    waterReminders: true,
    progressUpdates: false,
    weeklyReports: true,
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const notificationItems = [
    {
      key: 'workoutReminders',
      title: 'Workout Reminders',
      subtitle: 'Get reminded to complete your workouts',
      icon: 'fitness',
    },
    {
      key: 'mealReminders',
      title: 'Meal Reminders',
      subtitle: 'Reminders to log your meals',
      icon: 'nutrition',
    },
    {
      key: 'waterReminders',
      title: 'Water Reminders',
      subtitle: 'Stay hydrated with water reminders',
      icon: 'water',
    },
    {
      key: 'progressUpdates',
      title: 'Progress Updates',
      subtitle: 'Weekly progress summaries',
      icon: 'trending-up',
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Reports',
      subtitle: 'Detailed weekly fitness reports',
      icon: 'document-text',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="notifications" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Manage your notification preferences</Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg" style={styles.settingsCard}>
            {notificationItems.map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon as any} size={20} color={colors.primary[500]} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key as keyof typeof settings]}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: colors.border.light, true: colors.primary[200] }}
                  thumbColor={settings[item.key as keyof typeof settings] ? colors.primary[500] : colors.text.secondary}
                />
              </View>
            ))}
          </Card>
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
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
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
  settingsCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
}); 
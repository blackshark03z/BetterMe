import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

export default function SecurityScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    biometricAuth: false,
    appLock: true,
    dataEncryption: true,
    autoLogout: true,
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted') },
      ]
    );
  };

  const securityItems = [
    {
      key: 'biometricAuth',
      title: 'Biometric Authentication',
      subtitle: 'Use fingerprint or face ID to unlock app',
      icon: 'finger-print',
    },
    {
      key: 'appLock',
      title: 'App Lock',
      subtitle: 'Require password when opening app',
      icon: 'lock-closed',
    },
    {
      key: 'dataEncryption',
      title: 'Data Encryption',
      subtitle: 'Encrypt your personal data',
      icon: 'shield-checkmark',
    },
    {
      key: 'autoLogout',
      title: 'Auto Logout',
      subtitle: 'Automatically logout after inactivity',
      icon: 'time',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shield" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Security</Text>
          <Text style={styles.subtitle}>Manage your account security</Text>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg" style={styles.settingsCard}>
            {securityItems.map((item) => (
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

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <Card variant="outlined" padding="lg" style={styles.actionsCard}>
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              variant="outlined"
              style={styles.actionButton}
              icon="key-outline"
            />
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="outlined"
              style={[styles.actionButton, styles.deleteButton]}
              icon="trash-outline"
            />
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
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
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
  actionsCard: {
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    borderColor: colors.error[500],
  },
}); 
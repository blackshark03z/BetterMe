import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useAuthStore } from '../../../src/store/authStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    height: '',
    age: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="person" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your personal information</Text>
        </View>

        {/* Form */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={form.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              style={styles.input}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              style={styles.input}
            />
            
            <Input
              label="Height (cm)"
              placeholder="Enter your height"
              value={form.height}
              onChangeText={(value) => handleInputChange('height', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Input
              label="Age"
              placeholder="Enter your age"
              value={form.age}
              onChangeText={(value) => handleInputChange('age', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.saveButton}
              icon="save-outline"
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
  formCard: {
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
  },
}); 
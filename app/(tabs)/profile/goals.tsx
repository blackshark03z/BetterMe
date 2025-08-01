import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

export default function GoalsScreen() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    workoutGoal: '3',
    waterGoal: '2000',
    weightGoal: '',
    calorieGoal: '2000',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Goals updated successfully!');
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="fitness" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Fitness Goals</Text>
          <Text style={styles.subtitle}>Set your personal fitness targets</Text>
        </View>

        {/* Goals Form */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <Input
              label="Workouts per Week"
              placeholder="3"
              value={form.workoutGoal}
              onChangeText={(value) => handleInputChange('workoutGoal', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Input
              label="Daily Water Intake (ml)"
              placeholder="2000"
              value={form.waterGoal}
              onChangeText={(value) => handleInputChange('waterGoal', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Input
              label="Target Weight (kg)"
              placeholder="Optional"
              value={form.weightGoal}
              onChangeText={(value) => handleInputChange('weightGoal', value)}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <Input
              label="Daily Calorie Goal"
              placeholder="2000"
              value={form.calorieGoal}
              onChangeText={(value) => handleInputChange('calorieGoal', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button
              title="Save Goals"
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
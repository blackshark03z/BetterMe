import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

interface CreatePlanForm {
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  daysPerWeek: number;
  estimatedDuration: number;
}

export default function CreatePlanScreen() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePlanForm>({
    name: '',
    description: '',
    difficultyLevel: 'beginner',
    goalType: 'weight_loss',
    daysPerWeek: 3,
    estimatedDuration: 30,
  });

  const handleInputChange = (field: keyof CreatePlanForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }
    
    // Navigate to add days screen with plan data
    router.push({
      pathname: '/(tabs)/workout/add-days',
      params: { planData: JSON.stringify(form) }
    });
  };

  const handleBack = () => {
    router.back();
  };

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
            <Text style={styles.title}>Create Workout Plan</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>Design your perfect fitness routine</Text>
        </View>

        {/* Form */}
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Plan Details</Text>
          
          <Input
            label="Plan Name"
            placeholder="e.g., My Custom Plan"
            value={form.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />

          <Input
            label="Description"
            placeholder="Describe your workout plan..."
            value={form.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Plan Settings</Text>

          {/* Difficulty Level */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Difficulty Level</Text>
            <View style={styles.radioGroup}>
              {[
                { value: 'beginner', label: 'Beginner', icon: '🌱' },
                { value: 'intermediate', label: 'Intermediate', icon: '💪' },
                { value: 'advanced', label: 'Advanced', icon: '🔥' },
              ].map((option) => (
                <Button
                  key={option.value}
                  title={`${option.icon} ${option.label}`}
                  variant={form.difficultyLevel === option.value ? 'primary' : 'outline'}
                  onPress={() => handleInputChange('difficultyLevel', option.value)}
                  style={styles.radioButton}
                />
              ))}
            </View>
          </View>

          {/* Goal Type */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Goal Type</Text>
            <View style={styles.radioGroup}>
              {[
                { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
                { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
                { value: 'maintenance', label: 'Maintenance', icon: '⚖️' },
                { value: 'strength', label: 'Strength', icon: '🏋️' },
                { value: 'endurance', label: 'Endurance', icon: '🏃' },
              ].map((option) => (
                <Button
                  key={option.value}
                  title={`${option.icon} ${option.label}`}
                  variant={form.goalType === option.value ? 'primary' : 'outline'}
                  onPress={() => handleInputChange('goalType', option.value)}
                  style={styles.radioButton}
                />
              ))}
            </View>
          </View>

          {/* Days Per Week */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Days Per Week</Text>
            <View style={styles.radioGroup}>
              {[3, 4, 5, 6].map((days) => (
                <Button
                  key={days}
                  title={`${days} days`}
                  variant={form.daysPerWeek === days ? 'primary' : 'outline'}
                  onPress={() => handleInputChange('daysPerWeek', days)}
                  style={styles.radioButton}
                />
              ))}
            </View>
          </View>

          {/* Estimated Duration */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Estimated Duration (minutes)</Text>
            <View style={styles.radioGroup}>
              {[20, 30, 45, 60].map((duration) => (
                <Button
                  key={duration}
                  title={`${duration} min`}
                  variant={form.estimatedDuration === duration ? 'primary' : 'outline'}
                  onPress={() => handleInputChange('estimatedDuration', duration)}
                  style={styles.radioButton}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* Next Button */}
        <Button
          title="Next: Add Workout Days"
          onPress={handleNext}
          style={styles.nextButton}
          icon="arrow-forward"
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
  formCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  settingGroup: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  radioButton: {
    flex: 1,
    minWidth: '45%',
  },
  nextButton: {
    marginTop: spacing.lg,
  },
}); 
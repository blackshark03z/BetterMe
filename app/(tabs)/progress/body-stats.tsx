import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useProgressStore } from '../../../src/store/progressStore';

interface BodyStats {
  weight: number;
  waist: number;
  hip: number;
  chest: number;
  arm: number;
  bodyFat: number;
  bmi: number;
  date: Date;
}

export default function BodyStatsScreen() {
  const router = useRouter();
  const { addBodyStats, bodyStats } = useProgressStore();
  
  const [form, setForm] = useState({
    weight: '',
    waist: '',
    hip: '',
    chest: '',
    arm: '',
    bodyFat: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const handleSave = () => {
    const weight = parseFloat(form.weight);
    const waist = parseFloat(form.waist);
    const hip = parseFloat(form.hip);
    const chest = parseFloat(form.chest);
    const arm = parseFloat(form.arm);
    const bodyFat = parseFloat(form.bodyFat);

    if (!weight) {
      Alert.alert('Error', 'Please enter your weight');
      return;
    }

    // Mock height for BMI calculation (in real app, get from user profile)
    const height = 170; // cm
    const bmi = calculateBMI(weight, height);

    const newStats: BodyStats = {
      weight,
      waist: waist || 0,
      hip: hip || 0,
      chest: chest || 0,
      arm: arm || 0,
      bodyFat: bodyFat || 0,
      bmi: Math.round(bmi * 100) / 100,
      date: new Date(),
    };

    addBodyStats(newStats);
    Alert.alert('Success', 'Body stats saved successfully!');
    router.push('/(tabs)/progress');
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: colors.warning[500] };
    if (bmi < 25) return { category: 'Normal', color: colors.success[500] };
    if (bmi < 30) return { category: 'Overweight', color: colors.warning[500] };
    return { category: 'Obese', color: colors.error[500] };
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="body" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Body Stats</Text>
          <Text style={styles.subtitle}>Track your body measurements</Text>
        </View>

        {/* Input Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log New Measurement</Text>
          
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <Input
              label="Weight (kg)"
              placeholder="Enter your weight"
              value={form.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Waist (cm)"
              placeholder="Optional"
              value={form.waist}
              onChangeText={(value) => handleInputChange('waist', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Hip (cm)"
              placeholder="Optional"
              value={form.hip}
              onChangeText={(value) => handleInputChange('hip', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Chest (cm)"
              placeholder="Optional"
              value={form.chest}
              onChangeText={(value) => handleInputChange('chest', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Arm (cm)"
              placeholder="Optional"
              value={form.arm}
              onChangeText={(value) => handleInputChange('arm', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Body Fat %"
              placeholder="Optional"
              value={form.bodyFat}
              onChangeText={(value) => handleInputChange('bodyFat', value)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button
              title="Save Measurement"
              onPress={handleSave}
              style={styles.saveButton}
              icon="save-outline"
            />
          </Card>
        </View>

        {/* Recent Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Measurements</Text>
          
          {bodyStats.filter(stats => stats.date).length === 0 ? (
            <Card variant="outlined" padding="lg" style={styles.emptyCard}>
              <Ionicons name="body-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyTitle}>No measurements yet</Text>
              <Text style={styles.emptySubtitle}>
                Log your first body measurement to start tracking
              </Text>
            </Card>
          ) : (
            bodyStats
              .filter(stats => stats.date) // Filter out stats without date
              .slice(0, 5)
              .map((stats, index) => {
              const bmiCategory = getBMICategory(stats.bmi);
              return (
                <Card key={index} variant="outlined" padding="md" style={styles.statsCard}>
                  <View style={styles.statsHeader}>
                    <Text style={styles.statsDate}>{formatDate(stats.date)}</Text>
                    <View style={[styles.bmiBadge, { backgroundColor: bmiCategory.color }]}>
                      <Text style={styles.bmiText}>BMI: {stats.bmi}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{stats.weight}kg</Text>
                      <Text style={styles.statLabel}>Weight</Text>
                    </View>
                    
                    {stats.waist > 0 && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.waist}cm</Text>
                        <Text style={styles.statLabel}>Waist</Text>
                      </View>
                    )}
                    
                    {stats.hip > 0 && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.hip}cm</Text>
                        <Text style={styles.statLabel}>Hip</Text>
                      </View>
                    )}
                    
                    {stats.chest > 0 && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.chest}cm</Text>
                        <Text style={styles.statLabel}>Chest</Text>
                      </View>
                    )}
                    
                    {stats.arm > 0 && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.arm}cm</Text>
                        <Text style={styles.statLabel}>Arm</Text>
                      </View>
                    )}
                    
                    {stats.bodyFat > 0 && (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.bodyFat}%</Text>
                        <Text style={styles.statLabel}>Body Fat</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.bmiSection}>
                    <Text style={styles.bmiCategory}>{bmiCategory.category}</Text>
                  </View>
                </Card>
              );
            })
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
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
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
  statsCard: {
    marginBottom: spacing.md,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsDate: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  bmiBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  bmiText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bmiSection: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  bmiCategory: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
}); 
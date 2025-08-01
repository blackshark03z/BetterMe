import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useNutritionStore } from '../../../src/store/nutritionStore';

interface MealForm {
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  sodium: string;
}

export default function LogMealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addMeal } = useNutritionStore();
  
  const mealType = (params.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack') || 'snack';
  
  const [form, setForm] = useState<MealForm>({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
  });

  const handleInputChange = (field: keyof MealForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    if (!form.calories.trim()) {
      Alert.alert('Error', 'Please enter calories');
      return;
    }

    // Parse numeric values
    const calories = parseFloat(form.calories) || 0;
    const protein = parseFloat(form.protein) || 0;
    const carbs = parseFloat(form.carbs) || 0;
    const fat = parseFloat(form.fat) || 0;
    const fiber = parseFloat(form.fiber) || 0;
    const sugar = parseFloat(form.sugar) || 0;
    const sodium = parseFloat(form.sodium) || 0;

    // Add meal to store
    addMeal({
      name: form.name.trim(),
      description: form.description.trim(),
      calories,
      protein,
      carbs,
      fat,
      fiber: fiber > 0 ? fiber : undefined,
      sugar: sugar > 0 ? sugar : undefined,
      sodium: sodium > 0 ? sodium : undefined,
      mealType,
    });

    Alert.alert(
      'Success!',
      'Meal logged successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'restaurant';
      case 'dinner': return 'moon';
      case 'snack': return 'cafe';
      default: return 'restaurant';
    }
  };

  const getMealColor = () => {
    switch (mealType) {
      case 'breakfast': return colors.accent[500];
      case 'lunch': return colors.primary[500];
      case 'dinner': return colors.secondary[500];
      case 'snack': return colors.success[500];
      default: return colors.primary[500];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name={getMealIcon()} size={32} color={getMealColor()} />
          <Text style={styles.title}>Log {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
          <Text style={styles.subtitle}>Add your meal details</Text>
        </View>

        {/* Meal Form */}
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Meal Information</Text>
          
          <Input
            label="Meal Name *"
            placeholder="e.g., Grilled Chicken Salad"
            value={form.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />

          <Input
            label="Description"
            placeholder="Optional description"
            value={form.description}
            onChangeText={(value) => handleInputChange('description', value)}
            style={styles.input}
            multiline
          />

          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          
          <View style={styles.nutritionGrid}>
            <Input
              label="Calories *"
              placeholder="0"
              value={form.calories}
              onChangeText={(value) => handleInputChange('calories', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />

            <Input
              label="Protein (g)"
              placeholder="0"
              value={form.protein}
              onChangeText={(value) => handleInputChange('protein', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />

            <Input
              label="Carbs (g)"
              placeholder="0"
              value={form.carbs}
              onChangeText={(value) => handleInputChange('carbs', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />

            <Input
              label="Fat (g)"
              placeholder="0"
              value={form.fat}
              onChangeText={(value) => handleInputChange('fat', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Additional Info (Optional)</Text>
          
          <View style={styles.nutritionGrid}>
            <Input
              label="Fiber (g)"
              placeholder="0"
              value={form.fiber}
              onChangeText={(value) => handleInputChange('fiber', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />

            <Input
              label="Sugar (g)"
              placeholder="0"
              value={form.sugar}
              onChangeText={(value) => handleInputChange('sugar', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />

            <Input
              label="Sodium (mg)"
              placeholder="0"
              value={form.sodium}
              onChangeText={(value) => handleInputChange('sodium', value)}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Log Meal"
            onPress={handleSubmit}
            style={styles.submitButton}
            icon="checkmark"
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
  formCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  submitButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
}); 
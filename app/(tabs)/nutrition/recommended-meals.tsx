import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useNutritionStore, RecommendedMeal } from '../../../src/store/nutritionStore';

const GOALS = [
  { id: 'weight_loss', label: 'Weight Loss', icon: 'trending-down' },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: 'fitness' },
  { id: 'maintenance', label: 'Maintenance', icon: 'balance-scale' },
];

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunny' },
  { id: 'lunch', label: 'Lunch', icon: 'restaurant' },
  { id: 'dinner', label: 'Dinner', icon: 'moon' },
  { id: 'snack', label: 'Snack', icon: 'cafe' },
];

export default function RecommendedMealsScreen() {
  const router = useRouter();
  const { getRecommendedMeals, addMeal } = useNutritionStore();
  const [selectedGoal, setSelectedGoal] = useState<'weight_loss' | 'muscle_gain' | 'maintenance'>('weight_loss');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);

  const handleSelectMeal = (meal: RecommendedMeal) => {
    Alert.alert(
      'Add Recommended Meal',
      `Add "${meal.name}" to your ${meal.mealType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            addMeal({
              name: meal.name,
              description: meal.description,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              mealType: meal.mealType,
            });
            Alert.alert('Success!', 'Meal added to your daily log');
          },
        },
      ]
    );
  };

  const getGoalIcon = (goal: string) => {
    const goalData = GOALS.find(g => g.id === goal);
    return goalData?.icon || 'help-circle';
  };

  const getMealTypeIcon = (mealType: string) => {
    const mealTypeData = MEAL_TYPES.find(m => m.id === mealType);
    return mealTypeData?.icon || 'restaurant';
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return colors.error[500];
      case 'muscle_gain': return colors.primary[500];
      case 'maintenance': return colors.success[500];
      default: return colors.neutral[500];
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return colors.accent[500];
      case 'lunch': return colors.primary[500];
      case 'dinner': return colors.secondary[500];
      case 'snack': return colors.success[500];
      default: return colors.neutral[500];
    }
  };

  const recommendedMeals = getRecommendedMeals(selectedGoal, selectedMealType || undefined);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🍽️ Recommended Meals</Text>
          <Text style={styles.subtitle}>Choose meals based on your fitness goal</Text>
        </View>

        {/* Goal Selection */}
        <Card variant="elevated" padding="lg" style={styles.goalCard}>
          <Text style={styles.sectionTitle}>Select Your Goal</Text>
          <View style={styles.goalGrid}>
            {GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalButton,
                  selectedGoal === goal.id && styles.goalButtonActive,
                ]}
                onPress={() => setSelectedGoal(goal.id as any)}
              >
                <Ionicons 
                  name={getGoalIcon(goal.id) as any} 
                  size={24} 
                  color={selectedGoal === goal.id ? colors.background.light : getGoalColor(goal.id)} 
                />
                <Text style={[
                  styles.goalLabel,
                  selectedGoal === goal.id && styles.goalLabelActive,
                ]}>
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Meal Type Filter */}
        <Card variant="elevated" padding="lg" style={styles.filterCard}>
          <Text style={styles.sectionTitle}>Filter by Meal Type</Text>
          <View style={styles.mealTypeGrid}>
            <TouchableOpacity
              style={[
                styles.mealTypeButton,
                selectedMealType === null && styles.mealTypeButtonActive,
              ]}
              onPress={() => setSelectedMealType(null)}
            >
              <Text style={[
                styles.mealTypeLabel,
                selectedMealType === null && styles.mealTypeLabelActive,
              ]}>
                All Meals
              </Text>
            </TouchableOpacity>
            {MEAL_TYPES.map((mealType) => (
              <TouchableOpacity
                key={mealType.id}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === mealType.id && styles.mealTypeButtonActive,
                ]}
                onPress={() => setSelectedMealType(mealType.id as any)}
              >
                <Ionicons 
                  name={getMealTypeIcon(mealType.id) as any} 
                  size={16} 
                  color={selectedMealType === mealType.id ? colors.background.light : getMealTypeColor(mealType.id)} 
                />
                <Text style={[
                  styles.mealTypeLabel,
                  selectedMealType === mealType.id && styles.mealTypeLabelActive,
                ]}>
                  {mealType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Recommended Meals */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>
            {selectedMealType ? `${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Options` : 'All Recommended Meals'}
          </Text>
          
          {recommendedMeals.length === 0 ? (
            <Card variant="elevated" padding="lg" style={styles.emptyCard}>
              <Ionicons name="restaurant-outline" size={48} color={colors.neutral[400]} />
              <Text style={styles.emptyText}>No meals found for this combination</Text>
              <Text style={styles.emptySubtext}>Try changing your goal or meal type filter</Text>
            </Card>
          ) : (
            recommendedMeals.map((meal) => (
              <Card key={meal.id} variant="elevated" padding="md" style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDescription}>{meal.description}</Text>
                    <View style={styles.mealTypeBadge}>
                      <Ionicons 
                        name={getMealTypeIcon(meal.mealType) as any} 
                        size={12} 
                        color={getMealTypeColor(meal.mealType)} 
                      />
                      <Text style={styles.mealTypeText}>
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.mealCalories}>
                    <Text style={styles.caloriesText}>{meal.calories}</Text>
                    <Text style={styles.caloriesLabel}>cal</Text>
                  </View>
                </View>

                <View style={styles.macroGrid}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.protein}g</Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.carbs}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.fat}g</Text>
                    <Text style={styles.macroLabel}>Fat</Text>
                  </View>
                </View>

                <Button
                  title="Add to Daily Log"
                  onPress={() => handleSelectMeal(meal)}
                  variant="primary"
                  style={styles.addButton}
                  icon="add-outline"
                />
              </Card>
            ))
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  goalCard: {
    marginBottom: spacing.lg,
  },
  filterCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  goalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.light,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.light,
    marginHorizontal: spacing.xs,
  },
  goalButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  goalLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  goalLabelActive: {
    color: colors.background.light,
    fontWeight: '600',
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.light,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  mealTypeLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  mealTypeLabelActive: {
    color: colors.background.light,
    fontWeight: '600',
  },
  mealsSection: {
    marginBottom: spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  mealCard: {
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  mealInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  mealName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  mealDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  mealTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTypeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  mealCalories: {
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
  },
  caloriesLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  addButton: {
    marginTop: spacing.sm,
  },
}); 
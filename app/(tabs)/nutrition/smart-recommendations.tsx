import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useNutritionStore, RecommendedMeal } from '../../../src/store/nutritionStore';

export default function SmartRecommendationsScreen() {
  const router = useRouter();
  const { getSmartRecommendations, getNutritionGoals, addMeal } = useNutritionStore();
  
  const nutritionGoals = getNutritionGoals();
  const recommendations = getSmartRecommendations();

  const handleAddMeal = (recommendation: RecommendedMeal & { suggestedServing: number }) => {
    const servingWeight = Math.round(recommendation.suggestedServing * 100); // Convert to grams
    
    addMeal({
      name: recommendation.name,
      description: recommendation.description,
      servingWeight,
      calories: Math.round(recommendation.calories * recommendation.suggestedServing),
      protein: Math.round(recommendation.protein * recommendation.suggestedServing * 10) / 10,
      carbs: Math.round(recommendation.carbs * recommendation.suggestedServing * 10) / 10,
      fat: Math.round(recommendation.fat * recommendation.suggestedServing * 10) / 10,
      mealType: recommendation.mealType,
    });

    router.push('/(tabs)/nutrition');
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'trending-down';
      case 'muscle_gain': return 'fitness';
      case 'maintenance': return 'balance-scale';
      default: return 'restaurant';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return colors.error[500];
      case 'muscle_gain': return colors.primary[500];
      case 'maintenance': return colors.success[500];
      default: return colors.primary[500];
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'restaurant';
      case 'dinner': return 'moon';
      case 'snack': return 'cafe';
      default: return 'restaurant';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="bulb" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>Smart Recommendations</Text>
          <Text style={styles.subtitle}>Based on your nutrition goals</Text>
        </View>

        {/* Nutrition Goals Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          
          <Card variant="elevated" padding="lg" style={styles.goalsCard}>
            <View style={styles.goalsGrid}>
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{nutritionGoals.caloriesRemaining}</Text>
                <Text style={styles.goalLabel}>Calories</Text>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{nutritionGoals.proteinRemaining}g</Text>
                <Text style={styles.goalLabel}>Protein</Text>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{nutritionGoals.carbsRemaining}g</Text>
                <Text style={styles.goalLabel}>Carbs</Text>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{nutritionGoals.fatRemaining}g</Text>
                <Text style={styles.goalLabel}>Fat</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Smart Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Meals</Text>
          
          {recommendations.length === 0 ? (
            <Card variant="outlined" padding="lg" style={styles.emptyCard}>
              <Ionicons name="restaurant-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyTitle}>No recommendations</Text>
              <Text style={styles.emptySubtitle}>
                You've met your nutrition goals for today!
              </Text>
            </Card>
          ) : (
            recommendations.map((recommendation) => (
              <Card key={recommendation.id} variant="elevated" padding="md" style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationInfo}>
                    <View style={styles.mealTypeContainer}>
                      <Ionicons 
                        name={getMealTypeIcon(recommendation.mealType)} 
                        size={16} 
                        color={colors.text.secondary} 
                      />
                      <Text style={styles.mealType}>
                        {recommendation.mealType.charAt(0).toUpperCase() + recommendation.mealType.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.recommendationName}>{recommendation.name}</Text>
                    <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                  </View>
                  
                  <View style={styles.goalBadge}>
                    <Ionicons 
                      name={getGoalIcon(recommendation.goal)} 
                      size={12} 
                      color={getGoalColor(recommendation.goal)} 
                    />
                    <Text style={[styles.goalText, { color: getGoalColor(recommendation.goal) }]}>
                      {recommendation.goal.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.nutritionInfo}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>
                      {Math.round(recommendation.calories * recommendation.suggestedServing)} cal
                    </Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>
                      {Math.round(recommendation.protein * recommendation.suggestedServing * 10) / 10}g
                    </Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>
                      {Math.round(recommendation.carbs * recommendation.suggestedServing * 10) / 10}g
                    </Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>
                      {Math.round(recommendation.fat * recommendation.suggestedServing * 10) / 10}g
                    </Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                </View>

                <View style={styles.servingInfo}>
                  <Text style={styles.servingText}>
                    Suggested serving: {recommendation.suggestedServing.toFixed(1)}x
                  </Text>
                  <Text style={styles.servingWeight}>
                    ({Math.round(recommendation.suggestedServing * 100)}g)
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddMeal(recommendation)}
                >
                  <Ionicons name="add" size={20} color={colors.white} />
                  <Text style={styles.addButtonText}>Add to {recommendation.mealType}</Text>
                </TouchableOpacity>
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
  goalsCard: {
    marginBottom: spacing.md,
  },
  goalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalItem: {
    alignItems: 'center',
  },
  goalValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  goalLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  recommendationCard: {
    marginBottom: spacing.md,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  recommendationInfo: {
    flex: 1,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  mealType: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  recommendationName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recommendationDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  goalText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
    textTransform: 'capitalize',
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  nutritionLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  servingInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  servingText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  servingWeight: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.white,
    marginLeft: spacing.xs,
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
}); 
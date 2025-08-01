import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';
import { useNutritionStore } from '../../../src/store/nutritionStore';

const WATER_AMOUNTS = [
  { amount: 200, label: '200ml', icon: 'water-outline' },
  { amount: 300, label: '300ml', icon: 'water-outline' },
  { amount: 500, label: '500ml', icon: 'water-outline' },
  { amount: 1000, label: '1L', icon: 'water-outline' },
];

export default function NutritionIndexScreen() {
  const router = useRouter();
  const { goals, getTodayNutrition, getMealsByType, addWaterLog } = useNutritionStore();
  const nutrition = getTodayNutrition();

  const handleLogMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    router.push({
      pathname: '/(tabs)/nutrition/log-meal',
      params: { mealType }
    });
  };

  const handleSearchFood = () => {
    router.push('/(tabs)/nutrition/search-food');
  };

  const handleRecommendedMeals = () => {
    router.push('/(tabs)/nutrition/recommended-meals');
  };

  const handleAddWater = (amount: number) => {
    addWaterLog(amount);
    Alert.alert(
      'Success!',
      `${amount}ml of water added`,
      [{ text: 'OK' }]
    );
  };

  const handleCustomWaterAmount = () => {
    Alert.prompt(
      'Add Custom Amount',
      'Enter amount in ml:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const amount = parseInt(value || '0');
            if (amount > 0) {
              handleAddWater(amount);
            } else {
              Alert.alert('Error', 'Please enter a valid amount');
            }
          },
        },
      ],
      'plain-text',
      '250'
    );
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'restaurant';
      case 'dinner': return 'moon';
      case 'snack': return 'cafe';
      default: return 'restaurant';
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return colors.accent[500];
      case 'lunch': return colors.primary[500];
      case 'dinner': return colors.secondary[500];
      case 'snack': return colors.success[500];
      default: return colors.primary[500];
    }
  };

  const getWaterProgressColor = () => {
    const progress = nutrition.waterProgress;
    if (progress >= 100) return colors.success[500];
    if (progress >= 75) return colors.primary[500];
    if (progress >= 50) return colors.secondary[500];
    if (progress >= 25) return colors.accent[500];
    return colors.error[500];
  };

  const renderMealSection = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const meals = getMealsByType(mealType);
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);

    return (
      <Card variant="elevated" padding="md" style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Ionicons name={getMealIcon(mealType)} size={20} color={getMealColor(mealType)} />
          <Text style={styles.mealTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
          <Text style={styles.mealTime}>
            {meals.length > 0 ? `${meals.length} item${meals.length > 1 ? 's' : ''}` : 'No meals logged'}
          </Text>
        </View>
        
        {meals.length > 0 ? (
          <>
            <Text style={styles.mealDescription}>
              {meals.map(meal => meal.name).join(', ')}
            </Text>
            <View style={styles.mealStats}>
              <Text style={styles.mealStat}>{totalCalories} cal</Text>
              <Text style={styles.mealStat}>{totalProtein}g protein</Text>
              <Text style={styles.mealStat}>{totalCarbs}g carbs</Text>
            </View>
          </>
        ) : (
          <Text style={styles.mealDescription}>No meals logged yet</Text>
        )}
        
        <Button 
          title="Log Meal" 
          onPress={() => handleLogMeal(mealType)} 
          variant="outline"
          style={styles.logButton}
          icon="add-outline"
        />
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🥗 Nutrition</Text>
          <Text style={styles.subtitle}>Track your daily nutrition</Text>
        </View>

        {/* Daily Summary */}
        <Card variant="elevated" padding="lg" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.totalCalories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.totalProtein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.totalCarbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.totalFat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
          
          {/* Calorie Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Calories Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${nutrition.calorieProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {nutrition.totalCalories} / {goals.dailyCalories} calories ({nutrition.calorieProgress.toFixed(0)}%)
            </Text>
          </View>
        </Card>

        {/* Water Tracking Section */}
        <Card variant="elevated" padding="lg" style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Ionicons name="water" size={24} color={colors.primary[500]} />
            <Text style={styles.waterTitle}>💧 Water Intake</Text>
          </View>
          
          <View style={styles.waterProgressContainer}>
            <View style={styles.waterProgressCircle}>
              <Text style={styles.waterProgressPercentage}>
                {nutrition.waterProgress.toFixed(0)}%
              </Text>
              <Text style={styles.waterProgressLabel}>Complete</Text>
            </View>
            
            <View style={styles.waterProgressStats}>
              <Text style={styles.waterProgressAmount}>
                {nutrition.totalWater}ml
              </Text>
              <Text style={styles.waterProgressGoal}>
                of {goals.dailyWater}ml goal
              </Text>
            </View>
          </View>

          <View style={styles.waterProgressBar}>
            <View 
              style={[
                styles.waterProgressFill, 
                { 
                  width: `${Math.min(nutrition.waterProgress, 100)}%`,
                  backgroundColor: getWaterProgressColor(),
                }
              ]} 
            />
          </View>

          {/* Quick Add Water Buttons */}
          <View style={styles.waterQuickAddGrid}>
            {WATER_AMOUNTS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.waterQuickAddButton}
                onPress={() => handleAddWater(item.amount)}
              >
                <Ionicons name={item.icon as any} size={20} color={colors.primary[500]} />
                <Text style={styles.waterQuickAddLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Custom Amount"
            onPress={handleCustomWaterAmount}
            variant="outline"
            style={styles.customWaterButton}
            icon="add-outline"
          />
        </Card>

        {/* Meal Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          
          {renderMealSection('breakfast')}
          {renderMealSection('lunch')}
          {renderMealSection('dinner')}
          {renderMealSection('snack')}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Button 
              title="Log Meal" 
              onPress={() => handleLogMeal('snack')} 
              style={styles.actionButton}
              icon="restaurant-outline"
            />
            <Button 
              title="Search Food" 
              onPress={handleSearchFood} 
              style={styles.actionButton}
              icon="search-outline"
            />
            <Button 
              title="Recommended" 
              onPress={handleRecommendedMeals} 
              style={styles.actionButton}
              icon="star-outline"
            />
            <Button 
              title="Scan Barcode" 
              onPress={() => {}} 
              style={styles.actionButton}
              icon="barcode-outline"
            />
          </View>
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
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
  },
  macroLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  waterCard: {
    marginBottom: spacing.xl,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  waterTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  waterProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  waterProgressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary[100],
  },
  waterProgressPercentage: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
  },
  waterProgressLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  waterProgressStats: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  waterProgressAmount: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  waterProgressGoal: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  waterProgressBar: {
    height: 10,
    backgroundColor: colors.neutral[200],
    borderRadius: 5,
    marginBottom: spacing.lg,
  },
  waterProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  waterQuickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  waterQuickAddButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background.light,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  waterQuickAddLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  customWaterButton: {
    marginTop: spacing.sm,
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
  mealCard: {
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  mealTime: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  mealDescription: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  mealStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  mealStat: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  logButton: {
    marginTop: spacing.sm,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: spacing.md,
  },
}); 
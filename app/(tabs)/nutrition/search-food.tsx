import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card, Button } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
}

// Mock food database
const FOOD_DATABASE: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    brand: 'Organic Valley',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '100g',
  },
  {
    id: '2',
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '100g',
  },
  {
    id: '3',
    name: 'Broccoli',
    brand: 'Fresh Market',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    servingSize: '100g',
  },
  {
    id: '4',
    name: 'Salmon',
    brand: 'Wild Alaskan',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: '100g',
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.2,
    sodium: 36,
    servingSize: '100g',
  },
  {
    id: '6',
    name: 'Banana',
    brand: 'Fresh',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    servingSize: '1 medium',
  },
  {
    id: '7',
    name: 'Oatmeal',
    brand: 'Quaker',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    sugar: 0.3,
    sodium: 49,
    servingSize: '100g',
  },
  {
    id: '8',
    name: 'Eggs',
    brand: 'Farm Fresh',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    servingSize: '2 large',
  },
];

export default function SearchFoodScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim().length === 0) {
      setFilteredFoods([]);
      setIsSearching(false);
      return;
    }

    const filtered = FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredFoods(filtered);
    setIsSearching(false);
  };

  const handleSelectFood = (food: FoodItem) => {
    // Navigate to log meal with pre-filled data
    router.push({
      pathname: '/(tabs)/nutrition/log-meal',
      params: {
        mealType: 'snack',
        prefillData: JSON.stringify({
          name: food.name,
          description: `${food.brand ? food.brand + ' - ' : ''}${food.servingSize}`,
          calories: food.calories.toString(),
          protein: food.protein.toString(),
          carbs: food.carbs.toString(),
          fat: food.fat.toString(),
          fiber: food.fiber?.toString() || '',
          sugar: food.sugar?.toString() || '',
          sodium: food.sodium?.toString() || '',
        })
      }
    });
  };

  const renderFoodItem = (food: FoodItem) => (
    <TouchableOpacity
      key={food.id}
      style={styles.foodItem}
      onPress={() => handleSelectFood(food)}
    >
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{food.name}</Text>
        {food.brand && (
          <Text style={styles.foodBrand}>{food.brand}</Text>
        )}
        <Text style={styles.foodServing}>{food.servingSize}</Text>
      </View>
      
      <View style={styles.foodNutrition}>
        <Text style={styles.foodCalories}>{food.calories} cal</Text>
        <Text style={styles.foodMacros}>
          P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="search" size={32} color={colors.primary[500]} />
          <Text style={styles.title}>🔍 Search Food</Text>
          <Text style={styles.subtitle}>Find and log your meals</Text>
        </View>

        {/* Search Input */}
        <Card variant="elevated" padding="md" style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food items..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Search Results */}
        {isSearching && (
          <Card variant="outlined" padding="lg" style={styles.loadingCard}>
            <Text style={styles.loadingText}>Searching...</Text>
          </Card>
        )}

        {!isSearching && searchQuery.length > 0 && filteredFoods.length === 0 && (
          <Card variant="outlined" padding="lg" style={styles.noResultsCard}>
            <Ionicons name="search-outline" size={48} color={colors.text.secondary} />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try searching with different keywords
            </Text>
          </Card>
        )}

        {!isSearching && filteredFoods.length > 0 && (
          <Card variant="elevated" padding="md" style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>
              Found {filteredFoods.length} result{filteredFoods.length !== 1 ? 's' : ''}
            </Text>
            
            {filteredFoods.map(renderFoodItem)}
          </Card>
        )}

        {/* Popular Foods */}
        {searchQuery.length === 0 && (
          <Card variant="elevated" padding="lg" style={styles.popularCard}>
            <Text style={styles.sectionTitle}>Popular Foods</Text>
            
            {FOOD_DATABASE.slice(0, 6).map(renderFoodItem)}
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Back to Nutrition"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
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
  searchCard: {
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.primary,
  },
  loadingCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  noResultsCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  noResultsSubtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resultsCard: {
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  popularCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  foodBrand: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  foodServing: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  foodNutrition: {
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  foodCalories: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[500],
  },
  foodMacros: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  backButton: {
    width: '100%',
  },
}); 
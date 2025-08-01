import React, { useState, useEffect } from 'react';
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
  servingWeight: string;
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
    servingWeight: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
  });

  // Mock food database for auto-calculation
  const FOOD_DATABASE = [
    {
      name: 'chicken breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
    },
    {
      name: 'brown rice',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
    },
    {
      name: 'broccoli',
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
    },
    {
      name: 'salmon',
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
    },
    {
      name: 'greek yogurt',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      sodium: 36,
    },
    {
      name: 'banana',
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
    },
    {
      name: 'oatmeal',
      calories: 68,
      protein: 2.4,
      carbs: 12,
      fat: 1.4,
      fiber: 1.7,
      sugar: 0.3,
      sodium: 49,
    },
    {
      name: 'eggs',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
    },
  ];

  const findFoodInDatabase = (foodName: string) => {
    const normalizedName = foodName.toLowerCase().trim();
    
    // Vietnamese food name mappings
    const vietnameseMappings: { [key: string]: string } = {
      'ức gà': 'chicken breast',
      'thịt gà': 'chicken breast',
      'gà': 'chicken breast',
      'gạo lứt': 'brown rice',
      'cơm gạo lứt': 'brown rice',
      'bông cải': 'broccoli',
      'súp lơ': 'broccoli',
      'cá hồi': 'salmon',
      'sữa chua': 'greek yogurt',
      'sữa chua hy lạp': 'greek yogurt',
      'chuối': 'banana',
      'yến mạch': 'oatmeal',
      'trứng': 'eggs',
      'trứng gà': 'eggs',
    };
    
    // Check Vietnamese mappings first
    for (const [vietnamese, english] of Object.entries(vietnameseMappings)) {
      if (normalizedName.includes(vietnamese) || vietnamese.includes(normalizedName)) {
        return FOOD_DATABASE.find(food => food.name === english);
      }
    }
    
    // Then check direct English matches
    return FOOD_DATABASE.find(food => 
      food.name.includes(normalizedName) || 
      normalizedName.includes(food.name)
    );
  };

  const handleInputChange = (field: keyof MealForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate nutrition facts when serving weight changes
    if (field === 'servingWeight') {
      const servingWeight = parseFloat(value) || 0;
      if (servingWeight > 0) {
        // Try to get nutrition from prefill data first
        let baseNutrition = null;
        const prefillData = params.prefillData ? JSON.parse(params.prefillData as string) : null;
        
        if (prefillData) {
          baseNutrition = {
            calories: parseFloat(prefillData.calories) || 0,
            protein: parseFloat(prefillData.protein) || 0,
            carbs: parseFloat(prefillData.carbs) || 0,
            fat: parseFloat(prefillData.fat) || 0,
            fiber: parseFloat(prefillData.fiber) || 0,
            sugar: parseFloat(prefillData.sugar) || 0,
            sodium: parseFloat(prefillData.sodium) || 0,
          };
        } else {
          // Try to find food in database based on meal name
          const foodName = form.name.trim();
          if (foodName) {
            const foundFood = findFoodInDatabase(foodName);
            if (foundFood) {
              baseNutrition = foundFood;
            }
          }
        }
        
        if (baseNutrition) {
          const ratio = servingWeight / 100;
          setForm(prev => ({
            ...prev,
            calories: (baseNutrition.calories * ratio).toFixed(1),
            protein: (baseNutrition.protein * ratio).toFixed(1),
            carbs: (baseNutrition.carbs * ratio).toFixed(1),
            fat: (baseNutrition.fat * ratio).toFixed(1),
            fiber: baseNutrition.fiber > 0 ? (baseNutrition.fiber * ratio).toFixed(1) : '',
            sugar: baseNutrition.sugar > 0 ? (baseNutrition.sugar * ratio).toFixed(1) : '',
            sodium: baseNutrition.sodium > 0 ? (baseNutrition.sodium * ratio).toFixed(1) : '',
          }));
        }
      }
    }
  };

  // Handle prefill data from search
  useEffect(() => {
    if (params.prefillData) {
      try {
        const prefillData = JSON.parse(params.prefillData as string);
        setForm(prev => ({
          ...prev,
          name: prefillData.name || '',
          description: prefillData.description || '',
          servingWeight: prefillData.servingWeight || '',
          calories: prefillData.calories || '',
          protein: prefillData.protein || '',
          carbs: prefillData.carbs || '',
          fat: prefillData.fat || '',
          fiber: prefillData.fiber || '',
          sugar: prefillData.sugar || '',
          sodium: prefillData.sodium || '',
        }));
      } catch (error) {
        console.error('Error parsing prefill data:', error);
      }
    }
  }, [params.prefillData]);

  const handleSubmit = () => {
    // Validate required fields
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    if (!form.servingWeight.trim()) {
      Alert.alert('Error', 'Please enter serving weight');
      return;
    }

    // If no calories provided, try to calculate from serving weight
    let calories = parseFloat(form.calories) || 0;
    let protein = parseFloat(form.protein) || 0;
    let carbs = parseFloat(form.carbs) || 0;
    let fat = parseFloat(form.fat) || 0;
    
    if (calories === 0) {
      // Try to calculate from prefill data or database
      let baseNutrition = null;
      const prefillData = params.prefillData ? JSON.parse(params.prefillData as string) : null;
      
      if (prefillData) {
        baseNutrition = {
          calories: parseFloat(prefillData.calories) || 0,
          protein: parseFloat(prefillData.protein) || 0,
          carbs: parseFloat(prefillData.carbs) || 0,
          fat: parseFloat(prefillData.fat) || 0,
        };
      } else {
        // Try to find food in database based on meal name
        const foodName = form.name.trim();
        if (foodName) {
          const foundFood = findFoodInDatabase(foodName);
          if (foundFood) {
            baseNutrition = {
              calories: foundFood.calories,
              protein: foundFood.protein,
              carbs: foundFood.carbs,
              fat: foundFood.fat,
            };
          }
        }
      }
      
      if (baseNutrition) {
        const servingWeight = parseFloat(form.servingWeight) || 0;
        const ratio = servingWeight / 100;
        calories = baseNutrition.calories * ratio;
        protein = baseNutrition.protein * ratio;
        carbs = baseNutrition.carbs * ratio;
        fat = baseNutrition.fat * ratio;
      }
    }

    // Parse numeric values (calories, protein, carbs, fat already calculated above)
    const servingWeight = parseFloat(form.servingWeight) || 0;
    const fiber = parseFloat(form.fiber) || 0;
    const sugar = parseFloat(form.sugar) || 0;
    const sodium = parseFloat(form.sodium) || 0;

    // Add meal to store
    addMeal({
      name: form.name.trim(),
      description: form.description.trim(),
      servingWeight,
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
          onPress: () => router.push('/(tabs)/nutrition'),
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

          <Text style={styles.sectionTitle}>Serving Information</Text>
          
          <Input
            label="Serving Weight (g) *"
            placeholder="e.g., 150"
            value={form.servingWeight}
            onChangeText={(value) => handleInputChange('servingWeight', value)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Nutrition Facts (Auto-calculated)</Text>
          
          <Input
            label="Calories"
            placeholder="Auto-calculated"
            value={form.calories}
            onChangeText={(value) => handleInputChange('calories', value)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Input
            label="Protein (g)"
            placeholder="Auto-calculated"
            value={form.protein}
            onChangeText={(value) => handleInputChange('protein', value)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Input
            label="Carbs (g)"
            placeholder="Auto-calculated"
            value={form.carbs}
            onChangeText={(value) => handleInputChange('carbs', value)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Input
            label="Fat (g)"
            placeholder="Auto-calculated"
            value={form.fat}
            onChangeText={(value) => handleInputChange('fat', value)}
            keyboardType="numeric"
            style={styles.input}
          />
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
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Card, Button, Input } from '../../../src/components/ui';
import { colors, spacing, typography } from '../../../src/theme';

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  isRestDay: boolean;
}

interface CreatePlanForm {
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  goalType: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  daysPerWeek: number;
  estimatedDuration: number;
}

export default function AddDaysScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [planData, setPlanData] = useState<CreatePlanForm | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  
  const dayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    if (params.planData) {
      try {
        const parsedData = JSON.parse(params.planData as string) as CreatePlanForm;
        setPlanData(parsedData);
        
        // Initialize workout days based on daysPerWeek
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const initialDays: WorkoutDay[] = [];
        for (let i = 1; i <= parsedData.daysPerWeek; i++) {
          initialDays.push({
            id: `day-${i}`,
            dayNumber: i,
            dayName: dayNames[i - 1], // Start from Monday
            isRestDay: false,
          });
        }
        setWorkoutDays(initialDays);
      } catch (error) {
        console.error('Error parsing plan data:', error);
        Alert.alert('Error', 'Invalid plan data');
        router.back();
      }
    }
  }, [params.planData]);

  const handleDayNameChange = (dayId: string, newName: string) => {
    setWorkoutDays(prev => 
      prev.map(day => 
        day.id === dayId ? { ...day, dayName: newName } : day
      )
    );
  };

  const openDayPicker = (dayId: string) => {
    setSelectedDayId(dayId);
    setShowDayPicker(true);
  };

  const selectDay = (dayName: string) => {
    if (selectedDayId) {
      setWorkoutDays(prev => 
        prev.map(day => 
          day.id === selectedDayId ? { ...day, dayName } : day
        )
      );
    }
    setShowDayPicker(false);
    setSelectedDayId(null);
  };

  const toggleRestDay = (dayId: string) => {
    setWorkoutDays(prev => 
      prev.map(day => 
        day.id === dayId ? { ...day, isRestDay: !day.isRestDay } : day
      )
    );
  };

  const handleNext = () => {
    if (!planData) {
      Alert.alert('Error', 'Plan data not found');
      return;
    }

    // Validate that at least one day is not a rest day
    const activeDays = workoutDays.filter(day => !day.isRestDay);
    if (activeDays.length === 0) {
      Alert.alert('Error', 'At least one day must be a workout day');
      return;
    }

    // Navigate to add exercises screen
    router.push({
      pathname: '/(tabs)/workout/add-exercises',
      params: { 
        planData: JSON.stringify(planData),
        workoutDays: JSON.stringify(workoutDays)
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!planData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>Add Workout Days</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>
            Configure your {planData.daysPerWeek}-day workout plan
          </Text>
        </View>

        {/* Plan Summary */}
        <Card variant="elevated" padding="md" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Plan Summary</Text>
          <Text style={styles.summaryText}>
            <Text style={styles.bold}>Name:</Text> {planData.name}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={styles.bold}>Goal:</Text> {planData.goalType.replace('_', ' ')}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={styles.bold}>Difficulty:</Text> {planData.difficultyLevel}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={styles.bold}>Duration:</Text> {planData.estimatedDuration} minutes
          </Text>
        </Card>

        {/* Workout Days */}
        <Card variant="elevated" padding="lg" style={styles.daysCard}>
          <Text style={styles.sectionTitle}>Workout Days</Text>
          <Text style={styles.sectionSubtitle}>
            Customize each day or mark as rest day
          </Text>

          {workoutDays.map((day) => (
            <View key={day.id} style={styles.dayItem}>
              <View style={styles.dayHeader}>
                <View style={styles.dayNumber}>
                  <Text style={styles.dayNumberText}>Day {day.dayNumber}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.restToggle,
                    day.isRestDay && styles.restToggleActive
                  ]}
                  onPress={() => toggleRestDay(day.id)}
                >
                  <Ionicons 
                    name={day.isRestDay ? "bed" : "fitness"} 
                    size={16} 
                    color={day.isRestDay ? colors.background.light : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.restToggleText,
                    day.isRestDay && styles.restToggleTextActive
                  ]}>
                    {day.isRestDay ? 'Rest Day' : 'Workout'}
                  </Text>
                </TouchableOpacity>
              </View>

                             {!day.isRestDay && (
                 <TouchableOpacity
                   style={styles.daySelector}
                   onPress={() => openDayPicker(day.id)}
                 >
                   <View style={styles.daySelectorContent}>
                     <Text style={styles.daySelectorLabel}>Day</Text>
                     <Text style={styles.daySelectorValue}>{day.dayName}</Text>
                     <Ionicons name="chevron-down" size={16} color={colors.text.secondary} />
                   </View>
                 </TouchableOpacity>
               )}

              {day.isRestDay && (
                <View style={styles.restDayInfo}>
                  <Ionicons name="bed" size={20} color={colors.text.secondary} />
                  <Text style={styles.restDayText}>Rest and recovery day</Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* Next Button */}
        <Button
          title="Next: Add Exercises"
          onPress={handleNext}
          style={styles.nextButton}
          icon="arrow-forward"
                 />
       </ScrollView>

       {/* Day Picker Modal */}
       <Modal
         visible={showDayPicker}
         transparent
         animationType="slide"
         onRequestClose={() => setShowDayPicker(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Select Day</Text>
               <TouchableOpacity
                 onPress={() => setShowDayPicker(false)}
                 style={styles.closeButton}
               >
                 <Ionicons name="close" size={24} color={colors.text.primary} />
               </TouchableOpacity>
             </View>
             
             <ScrollView style={styles.dayOptionsList}>
               {dayOptions.map((option) => (
                 <TouchableOpacity
                   key={option.value}
                   style={styles.dayOption}
                   onPress={() => selectDay(option.value)}
                 >
                   <Text style={styles.dayOptionText}>{option.label}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
           </View>
         </View>
       </Modal>
     </SafeAreaView>
   );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summaryText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  bold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  daysCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  dayItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dayNumber: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  dayNumberText: {
    ...typography.body2,
    color: colors.primary[600],
    fontWeight: '600',
  },
  restToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  restToggleActive: {
    backgroundColor: colors.secondary[500],
    borderColor: colors.secondary[500],
  },
  restToggleText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  restToggleTextActive: {
    color: colors.background.light,
  },
  daySelector: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.light,
  },
  daySelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daySelectorLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  daySelectorValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
    marginLeft: spacing.sm,
  },
  restDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.medium,
    borderRadius: spacing.xs,
  },
  restDayText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  nextButton: {
    marginTop: spacing.lg,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.light,
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  dayOptionsList: {
    maxHeight: 300,
  },
  dayOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dayOptionText: {
    ...typography.body1,
    color: colors.text.primary,
  },
}); 
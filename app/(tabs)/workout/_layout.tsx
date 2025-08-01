import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="exercise-detail" />
      <Stack.Screen name="session" />
      <Stack.Screen name="create-plan" />
      <Stack.Screen name="add-days" />
      <Stack.Screen name="add-exercises" />
    </Stack>
  );
} 
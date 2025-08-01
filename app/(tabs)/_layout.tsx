import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          backgroundColor: colors.background.light,
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          paddingHorizontal: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="workout/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nutrition/log-meal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nutrition/search-food"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nutrition/recommended-meals"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout/exercise-detail"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout/session"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout/create-plan"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout/add-days"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout/add-exercises"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nutrition/index"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="nutrition" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      />
    </Tabs>
  );
} 
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const { checkAuth, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Check authentication status when app starts
    checkAuth();
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return null; // You can add a proper loading screen here
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* Main app screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Other screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
} 
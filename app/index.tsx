import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { colors, spacing, typography } from '../src/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Wait a bit for auth check to complete
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>💪</Text>
        <Text style={styles.title}>BetterMe</Text>
        <Text style={styles.subtitle}>Wellness Transformation App</Text>
        
        <ActivityIndicator 
          size="large" 
          color={colors.primary[500]} 
          style={styles.loader}
        />
        
        <Text style={styles.loadingText}>
          {loading ? 'Đang kiểm tra...' : 'Đang chuyển hướng...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  loadingText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from './ui';
import { colors, spacing, typography } from '../theme';
import { runAllTests } from '../utils/test-database';

export const DatabaseTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string>('');

  const handleTestDatabase = async () => {
    setIsTesting(true);
    setTestResults('');

    try {
      const success = await runAllTests();
      
      if (success) {
        setTestResults('✅ Database setup is working correctly!');
        Alert.alert('Success', 'Database connection and authentication are working properly.');
      } else {
        setTestResults('❌ Database setup has issues. Check the console for details.');
        Alert.alert('Error', 'Database setup has issues. Please check the setup guide.');
      }
    } catch (error) {
      setTestResults('❌ Test failed with error: ' + error);
      Alert.alert('Error', 'Test failed. Please check your configuration.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Test</Text>
      <Text style={styles.description}>
        Test your Supabase database connection and authentication setup.
      </Text>
      
      <Button
        title={isTesting ? "Testing..." : "Test Database"}
        onPress={handleTestDatabase}
        disabled={isTesting}
        loading={isTesting}
        style={styles.testButton}
      />

      {testResults ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{testResults}</Text>
        </View>
      ) : null}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Setup Instructions:</Text>
        <Text style={styles.instructionText}>1. Create .env file with your Supabase credentials</Text>
        <Text style={styles.instructionText}>2. Run the SQL script in Supabase SQL Editor</Text>
        <Text style={styles.instructionText}>3. Click "Test Database" to verify setup</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background.light,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.text.secondary.light,
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeights.relaxed,
  },
  testButton: {
    marginBottom: spacing.lg,
  },
  resultsContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface.light,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  resultsText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  instructions: {
    padding: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing.xs,
  },
}); 
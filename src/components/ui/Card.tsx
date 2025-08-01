import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  margin?: 'sm' | 'md' | 'lg';
  style?: any;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'sm',
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
    styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}` as keyof typeof styles],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
  },
  
  // Variants
  default: {
    backgroundColor: colors.surface.light,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  elevated: {
    backgroundColor: colors.background.light,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  
  // Padding
  paddingSm: {
    padding: spacing.sm,
  },
  paddingMd: {
    padding: spacing.md,
  },
  paddingLg: {
    padding: spacing.lg,
  },
  
  // Margin
  marginSm: {
    margin: spacing.sm,
  },
  marginMd: {
    margin: spacing.md,
  },
  marginLg: {
    margin: spacing.lg,
  },
}); 
import { colors } from './colors';
import { spacing, borderRadius, shadows } from './spacing';
import { typography, fontFamily } from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  fontFamily,
} as const;

export type Theme = typeof theme;
export * from './colors';
export * from './spacing';
export * from './typography'; 
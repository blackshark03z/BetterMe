export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

// Typography helpers
export const h1 = {
  fontSize: typography.fontSizes.xxxl,
  fontWeight: typography.fontWeights.bold,
  lineHeight: typography.lineHeights.tight,
  fontFamily: fontFamily.bold,
} as const;

export const h2 = {
  fontSize: typography.fontSizes.xxl,
  fontWeight: typography.fontWeights.semibold,
  lineHeight: typography.lineHeights.tight,
  fontFamily: fontFamily.semibold,
} as const;

export const h3 = {
  fontSize: typography.fontSizes.xl,
  fontWeight: typography.fontWeights.semibold,
  lineHeight: typography.lineHeights.normal,
  fontFamily: fontFamily.semibold,
} as const;

export const h4 = {
  fontSize: typography.fontSizes.lg,
  fontWeight: typography.fontWeights.medium,
  lineHeight: typography.lineHeights.normal,
  fontFamily: fontFamily.medium,
} as const;

export const body1 = {
  fontSize: typography.fontSizes.md,
  fontWeight: typography.fontWeights.normal,
  lineHeight: typography.lineHeights.relaxed,
  fontFamily: fontFamily.regular,
} as const;

export const body2 = {
  fontSize: typography.fontSizes.sm,
  fontWeight: typography.fontWeights.normal,
  lineHeight: typography.lineHeights.relaxed,
  fontFamily: fontFamily.regular,
} as const; 
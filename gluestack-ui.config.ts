import { createConfig } from '@gluestack-style/react'

export const config = createConfig({
  aliases: {
    bg: 'backgroundColor',
    p: 'padding',
    m: 'margin',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    w: 'width',
    h: 'height',
  },
  tokens: {
    colors: {
      // 🎨 Core brand
      primary: '#4f46e5',
      primaryDark: '#4338ca',
      secondary: '#06b6d4',

      // Neutral grays
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray600: '#4b5563',
      gray800: '#1f2937',
      gray900: '#111827',

      // Status colors
      success: '#22c55e',
      error: '#ef4444',
      warning: '#facc15',

      // Semantics for themes
      backgroundLight: '#ffffff',
      textLight: '#111827',
      borderLight: '#e5e7eb',

      backgroundDark: '#111827',
      textDark: '#f9fafb',
      borderDark: '#374151',
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    radii: {
      sm: 6,
      md: 10,
      lg: 16,
      full: 9999,
    },
  },
  themes: {
    light: {
      bg: '$backgroundLight',
      text: '$textLight',
      border: '$borderLight',
      primary: '$primary',
      secondary: '$secondary',
      success: '$success',
      error: '$error',
    },
    dark: {
      bg: '$backgroundDark',
      text: '$textDark',
      border: '$borderDark',
      primary: '$primaryDark',
      secondary: '$secondary',
      success: '$success',
      error: '$error',
    },
  },
})
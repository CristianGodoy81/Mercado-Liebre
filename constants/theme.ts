/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

/**
 * Sistema de Diseño: Atmósfera Líquida
 * Inspirado en el manifiesto creativo DESIGN.md
 * La base es la profundidad (background oscuro) y vibración de acentos neón.
 */

export const Colors = {
  // Base y Superficies
  background: '#0e0e10',
  surface: '#0e0e10',
  surfaceContainerLowest: '#121215',
  surfaceContainerLow: '#17171a',
  surfaceContainer: '#1c1c20',
  surfaceContainerHigh: '#212126',
  surfaceContainerHighest: '#26262a',
  surfaceVariant: 'rgba(38, 38, 42, 0.4)', // Usado para glassmorphism (Glass & Gradient rule)
  
  // Acentos / Neón
  primary: '#8ff5ff',
  primaryDim: '#5ebfcb', // Variante oscura para gradiente
  primaryFixed: '#c5ffff', 
  onPrimary: '#000000', // Texto sobre botones primarios
  
  secondary: '#ac89ff',
  secondaryDim: '#7c59da',
  onSecondary: '#ffffff',
  
  // Texto y Contenidos
  onSurface: '#e1e1e4',
  onSurfaceVariant: '#a0a0a5',
  
  // Bordes (Ghost Borders) outlineVariant al 15%
  outlineVariant: 'rgba(160, 160, 165, 0.15)',
  
  // Estados y otros
  error: '#ffb4ab',
  success: '#81c995',
  
  // Sombras y Luces ambientales (Ambient Shadows)
  ambientLight: 'rgba(225, 225, 228, 0.06)',
};

export const Typography = {
  // Tipografías principales
  fonts: {
    display: 'Manrope_700Bold',
    headline: 'Manrope_600SemiBold',
    title: 'Inter_600SemiBold',
    body: 'Inter_400Regular',
    label: 'Inter_500Medium',
  },
  
  // Estructuras de texto sugeridas
  displayLg: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 48,
    lineHeight: 56,
  },
  headlineSm: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  titleMd: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
};

export const Metrics = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16, // Preferido para tarjetas orgánicas ("soft edges")
    xl: 24,
    full: 9999,
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24, // "El aire respira"
    xl: 32,
    xxl: 40,
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

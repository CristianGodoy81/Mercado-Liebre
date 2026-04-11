import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Colors, Metrics, Typography } from '../../constants/theme';

export type MLButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface MLButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: MLButtonVariant;
}

export function MLButton({ title, variant = 'primary', style, ...props }: MLButtonProps) {
  if (variant === 'tertiary') {
    return (
      <TouchableOpacity style={[styles.tertiaryButton, style]} activeOpacity={0.7} {...props}>
        <Text style={styles.tertiaryText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity style={[styles.secondaryButton, style]} activeOpacity={0.7} {...props}>
        <View style={styles.secondaryContent}>
          <Text style={styles.secondaryText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Primary variant (Default)
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.primaryContainer, style]} {...props}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryGradient}
      >
        <Text style={styles.primaryText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Primario
  primaryContainer: {
    borderRadius: Metrics.borderRadius.md,
    overflow: 'hidden', // Para que el gradiente respete el borderRadius
  },
  primaryGradient: {
    paddingVertical: Metrics.spacing.md,
    paddingHorizontal: Metrics.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: Colors.onPrimary,
    fontFamily: Typography.fonts.label,
    fontSize: Typography.titleMd.fontSize,
    fontWeight: '600',
  },

  // Secundario (Glass - simplificado para React Native sin BlurView complejos externos)
  secondaryButton: {
    borderRadius: Metrics.borderRadius.md,
    backgroundColor: Colors.surfaceContainerHighest, // Aquí aplicaríamos opacidad/blur si usamos expo-blur
    paddingVertical: Metrics.spacing.md,
    paddingHorizontal: Metrics.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryContent: {
    // Glassmorphism wrapper (aquí puedes expandir a usar blur externo)
  },
  secondaryText: {
    color: Colors.primary,
    fontFamily: Typography.fonts.label,
    fontSize: Typography.titleMd.fontSize,
    fontWeight: '600',
  },

  // Terciario
  tertiaryButton: {
    paddingVertical: Metrics.spacing.sm,
    paddingHorizontal: Metrics.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryText: {
    color: Colors.primaryFixed,
    fontFamily: Typography.fonts.label,
    fontSize: Typography.bodyMd.fontSize,
    fontWeight: '500',
  },
});

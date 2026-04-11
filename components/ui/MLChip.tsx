import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Metrics, Typography } from '../../constants/theme';

interface MLChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function MLChip({ label, isActive = false, onPress }: MLChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chipBase,
        isActive ? styles.chipActive : styles.chipInactive,
      ]}
    >
      <Text style={[styles.textBase, isActive ? styles.textActive : styles.textInactive]}>
        {label}
      </Text>
      
      {/* Ghost Border Effect */}
      {isActive && (
        <View style={styles.ghostBorder} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chipBase: {
    paddingVertical: Metrics.spacing.xs, // 8px
    paddingHorizontal: Metrics.spacing.md, // 16px
    borderRadius: Metrics.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: Metrics.spacing.sm,
  },
  chipInactive: {
    // surface-bright (no expuesto, usamos onSurface muy tenue)
    backgroundColor: 'rgba(225, 225, 228, 0.1)', 
  },
  chipActive: {
    backgroundColor: 'transparent',
  },
  textBase: {
    fontFamily: Typography.fonts.label,
    fontSize: Typography.labelMd.fontSize,
  },
  textInactive: {
    color: Colors.onSurfaceVariant,
  },
  textActive: {
    color: Colors.primary,
  },
  ghostBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Metrics.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(143, 245, 255, 0.4)', // Ghost de primary 40%
  },
});

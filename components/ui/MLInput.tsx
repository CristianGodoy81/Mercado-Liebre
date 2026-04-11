import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors, Metrics, Typography } from '../../constants/theme';

export function MLInput({ style, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.focusedContainer,
        style,
      ]}
    >
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.onSurfaceVariant}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest, // Concavidad
    borderRadius: Metrics.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent', // Sin bordes evidentes para The No-Line Rule
    marginVertical: Metrics.spacing.xs,
  },
  focusedContainer: {
    borderColor: Colors.secondaryDim, // Al enfocar (Focus), el borde se ilumina suavemente
    // Aquí implementamos el de neón resplandor sin ser extremo. Usamos drop shadow (o box shadow limitados nativamente)
    shadowColor: Colors.secondaryDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  input: {
    color: Colors.onSurface,
    fontFamily: Typography.fonts.body,
    fontSize: Typography.bodyMd.fontSize,
    paddingHorizontal: Metrics.spacing.md,
    paddingTop: Metrics.spacing.sm, // Añadido para asegurar espaciado cuando multiline
    paddingVertical: Metrics.spacing.sm, // Más amplio
    minHeight: 48,
    textAlignVertical: 'top', // Asegura alineación arriba en Android para multiline
  },
});

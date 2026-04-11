import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Metrics, Typography } from '../../constants/theme';

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface MLProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function MLProductCard({ product, onPress }: MLProductCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={onPress}
    >
      {/* 
        El producto "flota" sobre un contenedor surfaceContainerLow 
        Regla de oro: nada de líneas divisorias de 1px.
      */}
      <View style={styles.imageContainer}>
        {/* Placeholder gradient simulando glass & gradient light reflection (esquina sup) */}
        <LinearGradient
          colors={[Colors.primaryVariant || 'rgba(143,245,255,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />
        
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        
        {/* Separación mediante whitespace (16px a 24px) en lugar de líneas */}
        <View style={styles.spacer} />

        <Text style={styles.price}>
          ${product.price.toLocaleString('es-AR')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Metrics.borderRadius.lg, // soft edges preferidos (16px)
    overflow: 'hidden',
    marginVertical: Metrics.spacing.sm,
    // Ambient shadows para que flote
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 30, // 30px blur
    elevation: 3, // Fallback para android
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: Metrics.spacing.md, // 16px para respirar
  },
  title: {
    fontFamily: Typography.fonts.title,
    fontSize: Typography.titleMd.fontSize,
    color: Colors.onSurface,
    lineHeight: Typography.titleMd.lineHeight,
  },
  spacer: {
    height: Metrics.spacing.md, // Whitespace vertical (16px)
  },
  price: {
    fontFamily: Typography.fonts.display, // Manrope
    fontSize: Typography.headlineSm.fontSize, // Precios impactantes
    color: Colors.primary, // Color neón para resaltar interactividad/valor
  },
});

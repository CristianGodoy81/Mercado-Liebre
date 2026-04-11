import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLChip } from '@/components/ui/MLChip';
import { MLInput } from '@/components/ui/MLInput';
import { MLProductCard, Product } from '@/components/ui/MLProductCard';
import { Colors, Metrics, Typography } from '@/constants/theme';

const CATEGORIES = ['Todos', 'Tecnología', 'Ropa', 'Hogar', 'Deportes', 'Vehículos'];

// Mock temporal, luego lo conectaremos a Supabase
const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'iPhone 13 Pro 128GB - Como nuevo', price: 950000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop' },
  { id: '2', title: 'MacBook Air M1 256GB Space Gray', price: 1250000, imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop' },
  { id: '3', title: 'Silla Gamer DXRacer Blanca/Rosa', price: 210000, imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=600&auto=format&fit=crop' },
  { id: '4', title: 'Auriculares Sony WH-1000XM4 Noise Cancelling', price: 340000, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop' },
  { id: '5', title: 'PlayStation 5 con 2 Joysticks y Garantía', price: 890000, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Fijo */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.greetingTitle}>Hola,</Text>
          <Text style={styles.title}>Descubrí lo nuevo</Text>
        </View>

        <MLInput 
          placeholder="Buscar un producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Feed Desplazable */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Categorías (Chips) */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat, idx) => (
              <View key={cat} style={{ marginLeft: idx === 0 ? Metrics.spacing.lg : 0 }}>
                <MLChip 
                  label={cat} 
                  isActive={activeCategory === cat}
                  onPress={() => setActiveCategory(cat)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Grilla de productos sugeridos */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Recomendados para vos</Text>
          
          <View style={styles.grid}>
            {MOCK_PRODUCTS.map(item => (
              <View key={item.id} style={styles.gridItem}>
                <MLProductCard 
                  product={item} 
                  onPress={() => router.push(`/product/${item.id}`)}
                />
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Metrics.spacing.lg,
    paddingTop: Metrics.spacing.sm,
    paddingBottom: Metrics.spacing.md,
    backgroundColor: Colors.background, // Mantiene consistencia de atmósferas
    zIndex: 10,
  },
  titleRow: {
    marginBottom: Metrics.spacing.md,
  },
  greetingTitle: {
    fontFamily: Typography.fonts.headline,
    fontSize: Typography.headlineSm.fontSize,
    color: Colors.onSurfaceVariant,
  },
  title: {
    fontFamily: Typography.fonts.display, // Manrope
    fontSize: 32,
    lineHeight: 38,
    color: Colors.onSurface,
  },
  scrollContent: {
    paddingBottom: Metrics.spacing.xxl * 2,
  },
  categoriesContainer: {
    marginVertical: Metrics.spacing.md,
  },
  gridContainer: {
    paddingHorizontal: Metrics.spacing.lg,
    paddingTop: Metrics.spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.title, // Inter
    fontSize: Typography.titleMd.fontSize,
    color: Colors.onSurface,
    marginBottom: Metrics.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Dos columnas simuladas dejando un 4% de gutter en medios
    marginBottom: Metrics.spacing.md,
  },
});

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLChip } from '@/components/ui/MLChip';
import { MLInput } from '@/components/ui/MLInput';
import { MLProductCard, Product } from '@/components/ui/MLProductCard';
import { Colors, Metrics, Typography } from '@/constants/theme';
import { supabase } from '@/utils/supabase';

const CATEGORIES = ['Todos', 'Tecnología', 'Ropa', 'Hogar', 'Deportes', 'Vehículos'];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener productos de Supabase
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Mapeamos los datos de supabase para asegurarnos que se ajustan al tipo Product
        const formattedProducts = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category || 'Otros',
          imageUrl: item.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', // Imagen por defecto si no tiene
        }));
        setProducts(formattedProducts);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los productos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtramos los productos "En Vivo" (Client-side)
  const filteredProducts = React.useMemo(() => {
    return products.filter(item => {
      // 1. Filtro por barra de búsqueda
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) || 
        (item.description && item.description.toLowerCase().includes(searchLower));

      // 2. Filtro por Categorías
      // Ahora usamos la columna "category" real de la base de datos
      const matchesCategory = 
        activeCategory === 'Todos' || 
        (item.category && item.category === activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

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
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Resultados de "${searchQuery}"` : 'Recomendados para vos'}
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Sin resultados 🕵️‍♂️</Text>
              <Text style={styles.emptyText}>No encontramos nada que coincida con tu búsqueda o filtro actual. ¡Intenta con otra palabra!</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredProducts.map(item => (
                <View key={item.id} style={styles.gridItem}>
                  <MLProductCard 
                    product={item} 
                    onPress={() => router.push(`/product/${item.id}`)}
                  />
                </View>
              ))}
            </View>
          )}
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
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: Typography.fonts.title,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Typography.fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
});

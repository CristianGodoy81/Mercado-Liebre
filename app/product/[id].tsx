import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLButton } from '@/components/ui/MLButton';
import { Product } from '@/components/ui/MLProductCard';
import { Colors, Metrics, Typography } from '@/constants/theme';

// MOCK: Idealmente esto vendría de Supabase filtrando por ID.
const MOCK_PRODUCTS: Record<string, Product & { description: string, seller: string }> = {
  '1': { id: '1', title: 'iPhone 13 Pro 128GB - Como nuevo', price: 950000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop', description: 'Batería al 90%. Ningún detalle estético. Se entrega en caja con cable original sin uso. Libre de fábrica.', seller: 'Santiago M.' },
  '2': { id: '2', title: 'MacBook Air M1 256GB Space Gray', price: 1250000, imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop', description: 'Ciclos de batería: 140. Impecable estado, uso exclusivo de oficina. Incluye cargador 30W.', seller: 'Lucía G.' },
  '3': { id: '3', title: 'Silla Gamer DXRacer Blanca/Rosa', price: 210000, imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=600&auto=format&fit=crop', description: 'Mecanismo reclinable 135 grados. Almohadón lumbar y cervical. Tiene un pequeño raspón en el apoyabrazos izquierdo.', seller: 'Camila T.' },
  '4': { id: '4', title: 'Auriculares Sony WH-1000XM4 Noise Cancelling', price: 340000, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop', description: 'Cancelación de sonido líder en la industria. Funciona perfecto, las almohadillas fueron reemplazadas hace 1 mes.', seller: 'Marcos R.' },
  '5': { id: '5', title: 'PlayStation 5 con 2 Joysticks y Garantía', price: 890000, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop', description: 'Versión con lectora de discos. Incluye dos DualSense originales y un cable Tipo C largo de regalo.', seller: 'Javier P.' },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const product = id ? MOCK_PRODUCTS[id] : null;

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
        <MLButton title="Volver al Home" onPress={() => router.back()} />
      </View>
    );
  }

  const handleContactSeller = () => {
    // Aquí abriríamos el chat con el vendedor
    router.push('/(tabs)/chats');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera / Imagen */}
        <View style={styles.imageHeader}>
          <Image 
            source={{ uri: product.imageUrl }} 
            style={styles.image}
            contentFit="cover"
          />
          
          {/* Degradado sobre la imagen para dar profundidad (Atmósfera Líquida) */}
          <LinearGradient
            colors={['rgba(14,14,16,0.6)', 'transparent', Colors.background]}
            style={StyleSheet.absoluteFillObject}
            locations={[0, 0.5, 1]}
          />

          {/* Botón Flotante para Volver Atrás */}
          <SafeAreaView edges={['top']} style={styles.backButtonContainer}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backButton} onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color={Colors.onSurface} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Contenido / Info del producto */}
        <View style={styles.infoContainer}>
          <View style={styles.chipWrapper}>
            <Text style={styles.conditionChip}>Usado</Text>
          </View>
          
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toLocaleString('es-AR')}</Text>
          
          <View style={styles.sellerSurface}>
            <View style={styles.sellerAvatar} />
            <View>
              <Text style={styles.sellerLabel}>Vendido por</Text>
              <Text style={styles.sellerName}>{product.seller}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionBody}>{product.description}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Floor (Floating Footer) - Botones de Acción */}
      <View style={styles.stickyFooter}>
        <LinearGradient
           colors={['transparent', Colors.background]}
           style={styles.stickyGradient}
        />
        <View style={styles.footerContent}>
          <MLButton 
            title="Contactar al Vendedor" 
            onPress={handleContactSeller} 
            style={styles.mainAction} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFoundText: {
    color: Colors.onSurface,
    fontFamily: Typography.fonts.title,
    fontSize: Typography.titleMd.fontSize,
    marginBottom: Metrics.spacing.xl,
  },
  scrollContent: {
    paddingBottom: 120, // Espacio para el footer fijo
  },
  imageHeader: {
    width: '100%',
    height: 480, // Gran impacto visual
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: Metrics.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceVariant, // Glass UI
    backdropFilter: 'blur(20px)', // Solo web, pero expo-blur sería mejor en el futuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: Metrics.spacing.lg,
    marginTop: -Metrics.spacing.xl, // Subimos el contenido por encima del difuminado
  },
  chipWrapper: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(143,245,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Metrics.borderRadius.full,
    marginBottom: Metrics.spacing.md,
  },
  conditionChip: {
    color: Colors.primary,
    fontFamily: Typography.fonts.label,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontFamily: Typography.fonts.title,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.onSurface,
    marginBottom: Metrics.spacing.sm,
  },
  price: {
    fontFamily: Typography.fonts.display,
    fontSize: 36,
    color: Colors.primaryFixed,
    marginBottom: Metrics.spacing.lg,
  },
  sellerSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    padding: Metrics.spacing.md,
    borderRadius: Metrics.borderRadius.lg,
    marginBottom: Metrics.spacing.xl,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    marginRight: Metrics.spacing.md,
  },
  sellerLabel: {
    fontFamily: Typography.fonts.label,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  sellerName: {
    fontFamily: Typography.fonts.title,
    fontSize: 16,
    color: Colors.onSurface,
  },
  descriptionContainer: {
    marginBottom: Metrics.spacing.lg,
  },
  descriptionTitle: {
    fontFamily: Typography.fonts.title,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: Metrics.spacing.md,
  },
  descriptionBody: {
    fontFamily: Typography.fonts.body,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.onSurfaceVariant,
  },
  
  // Footer Flotante "Ambient Shadows" (Regla 4)
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  stickyGradient: {
    height: 40,
    width: '100%',
  },
  footerContent: {
    paddingHorizontal: Metrics.spacing.lg,
    paddingBottom: Metrics.spacing.xxl, // Respetar Safe Area inferior
    paddingTop: Metrics.spacing.sm,
    backgroundColor: Colors.background,
    // "Floating shadow / ambient light"
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 20,
  },
  mainAction: {
    width: '100%',
  }
});

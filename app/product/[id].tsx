import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLButton } from '@/components/ui/MLButton';
import { Product } from '@/components/ui/MLProductCard';
import { Colors, Metrics, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';

// Extensión del tipo Product para incluir descripción y vendedor real
type ProductDetail = Product & {
  description: string;
  seller_email: string;
  seller_avatar: string;
  seller_id: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        // Pedimos los datos del producto
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Obtenemos los datos públicos del perfil del vendedor
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email, avatar_url')
            .eq('id', data.user_id)
            .single();

          setProduct({
            id: data.id,
            title: data.title,
            price: data.price,
            description: data.description,
            imageUrl: data.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
            seller_id: data.user_id,
            seller_email: profileData?.email || 'Usuario de Mercado Liebre',
            seller_avatar: profileData?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
          });
        }
      } catch (err: any) {
        Alert.alert('Error', 'No se pudo cargar el producto.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
        <MLButton title="Volver al inicio" onPress={() => router.back()} />
      </View>
    );
  }

  const handleContactSeller = async () => {
    console.log("handleContactSeller: Invocado");
    
    if (!user) {
      console.log("No hay usuario, mostrando alerta...");
      if (Platform.OS === 'web') {
        window.alert('Debes iniciar sesión para contactar al vendedor.');
      } else {
        Alert.alert('Inicia sesión', 'Debes iniciar sesión para contactar al vendedor.');
      }
      return;
    }

    if (user.id === product.seller_id) {
      console.log("El usuario es el vendedor, mostrando alerta...");
      if (Platform.OS === 'web') {
        window.alert('No puedes iniciar un chat contigo mismo.');
      } else {
        Alert.alert('Atención', 'No puedes iniciar un chat contigo mismo.');
      }
      return;
    }

    console.log("Iniciando creación de chat...");
    setIsCreatingChat(true);

    try {
      // 1. Verificar si ya existe un chat para este producto y comprador
      const { data: existingChat, error: existingError } = await supabase
        .from('chats')
        .select('id')
        .eq('product_id', product.id)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      let chatId = existingChat?.id;

      // 2. Si no existe, creamos uno nuevo
      if (!chatId) {
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            product_id: product.id,
            buyer_id: user.id,
            seller_id: product.seller_id
          })
          .select('id')
          .single();

        if (createError) throw createError;
        chatId = newChat.id;
      }

      // 3. Dirigimos a la pantalla del chat
      console.log("Navegando a la pantalla del chat con ID:", chatId);
      router.push(`/chat/${chatId}`);
    } catch (error: any) {
      console.error("Error capturado en handleContactSeller:", error);
      if (Platform.OS === 'web') {
        window.alert('No se pudo iniciar el chat: ' + error.message);
      } else {
        Alert.alert('Error', 'No se pudo iniciar el chat: ' + error.message);
      }
    } finally {
      setIsCreatingChat(false);
    }
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
            pointerEvents="none"
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
            <Image source={{ uri: product.seller_avatar }} style={styles.sellerAvatar} contentFit={"cover"} />
            <View>
              <Text style={styles.sellerLabel}>Vendido por</Text>
              <Text style={styles.sellerName}>{product.seller_email}</Text>
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
           pointerEvents="none"
        />
        <View style={styles.footerContent}>
          <MLButton 
            title={isCreatingChat ? "Iniciando Chat..." : "Contactar al Vendedor"} 
            onPress={handleContactSeller} 
            disabled={isCreatingChat}
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
    zIndex: 10,
    elevation: 20,
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

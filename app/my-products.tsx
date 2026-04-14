import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLButton } from '@/components/ui/MLButton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Metrics, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';

export default function MyProductsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      Alert.alert('Error', 'No se pudieron cargar tus publicaciones.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      Alert.alert('Actualizado', `Producto marcado como ${newStatus}.`);
      fetchMyProducts();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const { data, error } = await supabase.from('products').delete().eq('id', id).select();
      if (error) throw error;
      
      // Si la base de datos no devuelve ningún dato borrado, significa que las reglas RLS lo bloquearon silenciamente
      if (!data || data.length === 0) {
        throw new Error('Supabase (RLS) bloqueó la eliminación o el chat vinculado sigue activo. Asegúrate de ejecutar el código SQL.');
      }
      
      fetchMyProducts();
    } catch (error: any) {
      Alert.alert('Error al eliminar', error.message);
    }
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      // En la web, Alert.alert() con botones personalizados falla en silencio.  
      // Usamos el confirm() nativo del navegador.
      const confirmDelete = window.confirm('¿Eliminar publicación? Esta acción no se puede deshacer.');
      if (confirmDelete) {
        executeDelete(id);
      }
    } else {
      Alert.alert(
        '¿Eliminar publicación?',
        'Esta acción no se puede deshacer.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => executeDelete(id)
          }
        ]
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return Colors.success;
      case 'paused': return Colors.onSurfaceVariant;
      case 'sold': return Colors.primary;
      default: return Colors.onSurfaceVariant;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Publicaciones</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no publicaste nada.</Text>
          <MLButton title="Vender ahora" onPress={() => router.push('/(tabs)/publish')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {products.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    Estado: {item.status === 'active' ? 'Activo' : item.status === 'paused' ? 'Pausado' : 'Vendido'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionsBox}>
                {item.status !== 'sold' && (
                  <View style={styles.rowActions}>
                    <TouchableOpacity 
                      style={styles.actionBtn} 
                      onPress={() => router.push(`/product/edit/${item.id}`)}
                    >
                      <IconSymbol name="pencil" size={18} color={Colors.onSurface} />
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionBtn} 
                      onPress={() => handleUpdateStatus(item.id, item.status === 'active' ? 'paused' : 'active')}
                    >
                      <IconSymbol name={item.status === 'active' ? 'pause.fill' : 'play.fill'} size={18} color={Colors.onSurface} />
                      <Text style={styles.actionText}>{item.status === 'active' ? 'Pausar' : 'Activar'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionBtn} 
                      onPress={() => handleUpdateStatus(item.id, 'sold')}
                    >
                      <IconSymbol name="checkmark.seal.fill" size={18} color={Colors.primary} />
                      <Text style={[styles.actionText, {color: Colors.primary}]}>Vendí esto</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Delete is independent */}
                <TouchableOpacity style={[styles.actionBtn, {marginTop: 10, alignSelf:'flex-start'}]} onPress={() => handleDelete(item.id)}>
                  <IconSymbol name="trash.fill" size={18} color={Colors.error} />
                  <Text style={[styles.actionText, {color: Colors.error}]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.spacing.md,
    paddingVertical: Metrics.spacing.md,
  },
  backBtn: { padding: 8, marginRight: 8 },
  title: {
    fontFamily: Typography.fonts.title,
    fontSize: 20,
    color: Colors.onSurface,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: Colors.onSurfaceVariant, fontSize: 16, marginBottom: 20 },
  list: { padding: Metrics.spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Metrics.borderRadius.lg,
    padding: Metrics.spacing.md,
    marginBottom: Metrics.spacing.md,
  },
  cardHeader: { flexDirection: 'row', marginBottom: Metrics.spacing.md },
  image: { width: 80, height: 80, borderRadius: Metrics.borderRadius.md, backgroundColor: Colors.surfaceContainerHighest },
  info: { flex: 1, marginLeft: Metrics.spacing.md, justifyContent: 'center' },
  productTitle: { fontFamily: Typography.fonts.title, fontSize: 16, color: Colors.onSurface },
  price: { fontFamily: Typography.fonts.display, fontSize: 18, color: Colors.onSurfaceVariant, marginVertical: 4 },
  status: { fontFamily: Typography.fonts.label, fontSize: 12, fontWeight: 'bold' },
  actionsBox: {
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingTop: Metrics.spacing.md,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingBottom: 10
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  actionText: { color: Colors.onSurface, marginLeft: 6, fontSize: 13, fontFamily: Typography.fonts.body }
});

import { Colors, Metrics, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      setIsLoading(true);
      try {
        // Pedimos todos los chats donde el usuario sea comprador o vendedor
        const { data: chats, error } = await supabase
          .from('chats')
          .select(`
            id,
            buyer_id,
            seller_id,
            products ( title, image_url )
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (chats) {
          // Enriquecer la información de cada chat con los perfiles del "otro" usuario
          const enrichedChats = await Promise.all(
            chats.map(async (chat: any) => {
              const otherUserId = chat.buyer_id === user.id ? chat.seller_id : chat.buyer_id;
              
              const { data: profile } = await supabase
                .from('profiles')
                .select('email, avatar_url')
                .eq('id', otherUserId)
                .single();

              // Intentar buscar el último mensaje
              const { data: lastMessage } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              return {
                id: chat.id,
                productTitle: chat.products?.title || 'Producto',
                productImage: chat.products?.image_url,
                otherUserEmail: profile?.email || 'Usuario',
                otherUserAvatar: profile?.avatar_url,
                lastMessage: lastMessage?.content || 'Iniciar conversación...',
                updatedAt: lastMessage?.created_at || chat.created_at
              };
            })
          );

          // Ordenamos para que los que tienen mensajes más nuevos salgan arriba
          enrichedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          
          setChatRooms(enrichedChats);
        }
      } catch (error) {
        console.error('Error cargando chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatRow} 
      activeOpacity={0.7}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.otherUserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' }} 
          style={styles.avatar} 
        />
        {/* Pequeña miniatura del producto abajo a la derecha de la foto de perfil */}
        {item.productImage && (
          <Image source={{ uri: item.productImage }} style={styles.productThumbnail} />
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName} numberOfLines={1}>{item.otherUserEmail}</Text>
        </View>
        <Text style={styles.productName} numberOfLines={1}>{item.productTitle}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : chatRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no tienes mensajes.</Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: Metrics.spacing.md,
    paddingBottom: Metrics.spacing.md,
  },
  headerTitle: {
    fontFamily: Typography.fonts.display,
    fontSize: 28,
    color: Colors.onSurface,
  },
  listContent: {
    paddingHorizontal: Metrics.spacing.md,
    paddingBottom: Metrics.spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.fonts.body,
    fontSize: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLowest,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Metrics.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  productThumbnail: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.background,
    backgroundColor: Colors.surface,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontFamily: Typography.fonts.label,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.onSurface,
  },
  productName: {
    fontFamily: Typography.fonts.body,
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 4,
  },
  lastMessage: {
    fontFamily: Typography.fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});
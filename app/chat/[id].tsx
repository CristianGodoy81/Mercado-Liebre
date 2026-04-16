import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Metrics, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    let isMounted = true;

    const fetchChatData = async () => {
      // 1. Obtener Info
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select(`
          seller_id,
          buyer_id,
          products ( title, image_url )
        `)
        .eq('id', id)
        .single();
        
      if (!chatError && chatData && isMounted) {
        const otherUserId = chatData.seller_id === user.id ? chatData.buyer_id : chatData.seller_id;
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email, avatar_url')
          .eq('id', otherUserId)
          .single();

        setChatInfo({
          productTitle: (chatData.products as any)?.title || 'Producto',
          productImage: (chatData.products as any)?.image_url,
          otherUserEmail: profileData?.email || 'Usuario',
          otherUserAvatar: profileData?.avatar_url,
        });
      }

      // 2. Obtener Mensajes Antiguos
      const { data: msgsData, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true });

      if (!msgsError && msgsData && isMounted) {
        setMessages(msgsData);
      }
      
      if (isMounted) setIsLoading(false);
    };

    fetchChatData();

    // 3. Suscripción en Tiempo Real (Realtime WebSockets)
    const channel = supabase
      .channel(`chat_${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${id}` },
        (payload) => {
          if (isMounted) {
            setMessages((prev) => {
              // Evitamos duplicar nuestro propio mensaje (ya lo mostramos "oficialmente" en sendMessage al instante)
              if (payload.new.sender_id === user.id) return prev;
              
              // Si es un mensaje nuevo de la OTRA persona, lo dibujamos:
              const alreadyExists = prev.find(m => m.id === payload.new.id);
              if (alreadyExists) return prev;

              return [...prev, payload.new];
            });
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const content = newMessage.trim();
    
    // 1. DIBUJO INMEDIATO (Optimistic UI)
    // Mostramos la burbuja instantáneamente sin esperar a que el servidor responda
    const tempMessage = {
      id: Math.random().toString(), // ID temporal interno
      chat_id: id,
      sender_id: user.id,
      content: content,
      created_at: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage(''); // Limpiamos la caja de texto
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // 2. GUARDADO REAL EN BASE DE DATOS
    const { error } = await supabase
      .from('messages')
      .insert({
        chat_id: id,
        sender_id: user.id,
        content: content,
      });

    if (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Modal Glass */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        {chatInfo && (
          <View style={styles.headerProfile}>
            <Image source={{ uri: chatInfo.otherUserAvatar }} style={styles.avatar} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.userName} numberOfLines={1}>{chatInfo.otherUserEmail}</Text>
              <Text style={styles.productName} numberOfLines={1}>{chatInfo.productTitle}</Text>
            </View>
          </View>
        )}
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;

            return (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble, 
                  isMe ? styles.myMessage : styles.theirMessage
                ]}
              >
                <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                  {msg.content}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={Colors.onSurfaceVariant}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && { opacity: 0.5 }]} 
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.spacing.md,
    paddingVertical: Metrics.spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.surfaceContainerLowest,
    backgroundColor: Colors.surfaceContainer,
  },
  backButton: {
    padding: Metrics.spacing.xs,
    marginRight: Metrics.spacing.sm,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    marginLeft: Metrics.spacing.sm,
    flex: 1,
  },
  userName: {
    fontFamily: Typography.fonts.label,
    fontWeight: 'bold',
    color: Colors.onSurface,
    fontSize: 16,
  },
  productName: {
    fontFamily: Typography.fonts.body,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  messagesContainer: {
    padding: Metrics.spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end', // Empuja mensajes hacia abajo si son pocos
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Metrics.spacing.md,
    borderRadius: Metrics.borderRadius.lg,
    marginBottom: Metrics.spacing.sm,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4, // Colita del globo
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerHighest,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: Colors.onSurface,
    fontFamily: Typography.fonts.body,
    fontSize: 15,
  },
  myMessageText: {
    color: Colors.onPrimary, // Letra oscura sobre burbuja neon
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Metrics.spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    color: Colors.onSurface,
    borderRadius: Metrics.borderRadius.lg,
    paddingHorizontal: Metrics.spacing.md,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    fontFamily: Typography.fonts.body,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Metrics.spacing.sm,
  },
});
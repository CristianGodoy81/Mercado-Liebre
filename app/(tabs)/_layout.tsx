import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerHighest,
          borderTopWidth: 0, // Regla: The No-Line Rule
          elevation: 10,
          shadowColor: Colors.ambientLight, // Ambient Shadows
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: 'Publicar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: email || 'Perfil',
          tabBarIcon: ({ color }) => (
            avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={{ width: 28, height: 28, borderRadius: 14 }} 
              />
            ) : (
              <IconSymbol size={28} name="person.fill" color={color} />
            )
          ),
        }}
      />
    </Tabs>
  );
}

import { MLButton } from '@/components/ui/MLButton';
import { Colors, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  // Los proveedores OAuth como Google guardan de la foto de perfil en user_metadata
  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;

  return (
    <View style={styles.container}>
      {/* Si hay una URL de imagen, mostramos el círculo con la foto */}
      {avatarUrl && (
        <Image 
          source={{ uri: avatarUrl }} 
          style={styles.avatar} 
        />
      )}
      
      {/* Mostramos el email de la cuenta */}
      <Text style={styles.emailText}>{email}</Text>

      <View style={{ marginTop: 40}}>
        <MLButton title="Cerrar Sesión" variant="secondary" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  emailText: { color: Colors.onSurface, fontSize: 16, fontWeight: 'bold' },
  text: { color: Colors.primary, fontFamily: Typography.fonts.title }
});
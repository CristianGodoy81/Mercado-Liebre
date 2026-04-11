import { MLButton } from '@/components/ui/MLButton';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../utils/supabase';

// Completa la sesión web si venimos redirigidos (solo web)
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const signInWithGoogle = async () => {
    try {
      // Método Universal para Expo Go usando expo-auth-session
      const redirectUrl = AuthSession.makeRedirectUri({
        path: '/(tabs)/'
      });
      
      // Mostrar al desarrollador qué URL debe autorizar
      console.log('--- ATENCIÓN: AÑADE ESTA URL EN SUPABASE ---');
      console.log(redirectUrl);
      console.log('----------------------------------------------');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // Importante para manejar nosotros la ventana web
          queryParams: {
            prompt: 'select_account' // Fuerza la pantalla de selección de cuenta
          }
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        // Abre el navegador seguro
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          const urlParamsString = result.url.split('#')[1] || result.url.split('?')[1];
          
          if (urlParamsString) {
            const params = urlParamsString.split('&').reduce((acc, current) => {
              const [key, value] = current.split('=');
              acc[key] = decodeURIComponent(value);
              return acc;
            }, {} as Record<string, string>);

            if (params.access_token && params.refresh_token) {
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token,
              });
              
              if (sessionError) {
                Alert.alert('Error sesión:', sessionError.message);
              }
            } else {
              Alert.alert('Google Auth', 'Inicio completado pero no se detectó el token de Supabase. Añade la Redirect URL en Supabase.');
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error de login universal:', error);
      Alert.alert('Error', error.message || 'Ocurrió un problema al iniciar sesión.');
    }
  };

  const loginAnon = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        Alert.alert('Error de Supabase', error.message + '\n\n(Debes activar "Anonymous Sign-Ins" en la configuración de Authentication > Providers en tu panel de Supabase).');
      }
    } catch (e: any) {
      Alert.alert('Error crítico', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mercado Liebre</Text>
      <Text style={styles.subtitle}>Iniciá sesión para comprar y vender</Text>
      
      <View style={styles.actions}>
        <MLButton 
          title="Continuar con Google" 
          onPress={signInWithGoogle} 
        />
        
        {/* Botón rápido para desarrollo / sin cuenta */}
        <View style={{ marginTop: 24 }}>
          <MLButton 
            variant="tertiary"
            title="Entrar como Invitado" 
            onPress={loginAnon} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e0e10', 
    padding: 24,
  },
  title: {
    fontSize: 40,
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Manrope_700Bold', 
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    marginBottom: 48,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center'
  },
  actions: {
    width: '100%',
    maxWidth: 400,
  }
});

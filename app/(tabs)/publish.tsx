import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLButton } from '@/components/ui/MLButton';
import { MLInput } from '@/components/ui/MLInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Metrics, Typography } from '@/constants/theme';

export default function PublishScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handlePublish = () => {
    // Acá iría la lógica para enviar a Supabase luego
    console.log('Publicando:', { title, price, description });
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Publicá tu producto</Text>
          <Text style={styles.headerSubtitle}>Completá los datos para empezar a vender.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Falso Image Picker (por ahora) */}
          <TouchableOpacity activeOpacity={0.8} style={styles.imagePickerPlaceholder}>
            <IconSymbol name="camera.fill" size={32} color={Colors.primary} />
            <Text style={styles.imagePickerText}>Agregar fotos</Text>
          </TouchableOpacity>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Título del producto</Text>
            <MLInput 
              placeholder="Ej. iPhone 13 Pro 128GB"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Precio ($)</Text>
            <MLInput 
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción</Text>
            <MLInput 
              placeholder="Describí el estado, detalles y qué incluye..."
              value={description}
              onChangeText={setDescription}
              multiline
              style={styles.textArea}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <MLButton 
            title="Publicar ahora" 
            onPress={handlePublish}
            disabled={!title || !price}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: Metrics.spacing.xs,
  },
  headerSubtitle: {
    fontFamily: Typography.fonts.body,
    fontSize: Typography.bodyMd.fontSize,
    color: Colors.onSurfaceVariant,
  },
  scrollContent: {
    paddingHorizontal: Metrics.spacing.lg,
    paddingBottom: Metrics.spacing.xxl,
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Metrics.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Metrics.spacing.xl,
    // "Ghost Border" rule para el área de subida
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontFamily: Typography.fonts.label,
    color: Colors.primary,
    marginTop: Metrics.spacing.sm,
  },
  formGroup: {
    marginBottom: Metrics.spacing.lg,
  },
  label: {
    fontFamily: Typography.fonts.label,
    color: Colors.onSurface,
    marginBottom: Metrics.spacing.xs,
    marginLeft: Metrics.spacing.xs, // Alineado sutilmente con el padding interno del input
  },
  textArea: {
    minHeight: 120, // Altura para varias líneas
  },
  footer: {
    paddingHorizontal: Metrics.spacing.lg,
    paddingTop: Metrics.spacing.md,
    paddingBottom: Metrics.spacing.lg, // Safe area bottom fallback
    backgroundColor: Colors.background,
  }
});

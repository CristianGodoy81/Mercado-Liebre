import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MLButton } from '@/components/ui/MLButton';
import { MLChip } from '@/components/ui/MLChip';
import { MLInput } from '@/components/ui/MLInput';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Metrics, Typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';

const CATEGORIES = ['Tecnología', 'Ropa', 'Hogar', 'Deportes', 'Vehículos', 'Otros'];

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Otros');
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setTitle(data.title);
          setPrice(data.price.toString());
          setDescription(data.description);
          if (data.category) setCategory(data.category);
          if (data.image_url) setExistingImageUrl(data.image_url);
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar el producto.');
        router.back();
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const pickImage = async () => {
    // Pedir permisos primero
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Update from ImagePicker.MediaTypeOptions.Images array matching Expo 50+
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Comprimimos la imagen un poco
      base64: true, // Necesario para subir a Supabase fácilmente desde React Native
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  const handlePublish = async () => {
    // Si estás en la web, el "console.log" se ve en la ventana de inspección de Chrome (F12), no en VS Code.
    console.log("-> Botón de publicar presionado");

    if (!user) {
      Alert.alert('Error', 'Tenés que iniciar sesión para publicar.');
      return;
    }

    if (!title || !price || !description) {
      Alert.alert('Error', 'Por favor completá todos los campos.');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido.');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;
      console.log("Iniciando publicación...");

      // 1. Si el usuario seleccionó una imagen, la subimos a Supabase Storage
      if (image && image.base64) {
        console.log("Imagen detectada, preparando para subir...");
        
        // En Android/iOS la URI termina en .jpg/.png, pero en Web es un blob/data URL.
        // Asignamos una extensión segura o intentamos sacar el mime type si existe.
        let fileExt = 'jpg'; 
        if (image.uri.includes('.')) {
           const possibleExt = image.uri.split('.').pop();
           if (possibleExt && possibleExt.length <= 4) fileExt = possibleExt;
        } else if (image.mimeType) {
           fileExt = image.mimeType.split('/')[1] || 'jpg';
        }
        
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        console.log("Subiendo al bucket product-images, path:", filePath);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, decode(image.base64), {
            contentType: image.mimeType || `image/${fileExt}` 
          });

        if (uploadError) {
          console.error("Error subiendo imagen:", uploadError);
          throw new Error('Error al subir la imagen: ' + uploadError.message);
        }

        console.log("Imagen subida con éxito, obteniendo URL...");
        // 2. Obtenemos la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
        console.log("URL de imagen:", imageUrl);
      }

      console.log("Actualizando producto en base de datos...");
      // 3. Actualizamos el producto en la base de datos (conservando la imagen si no se subió una nueva)
      const updatePayload: any = {
        title,
        price: priceNumber,
        description,
        category,
      };

      if (imageUrl) {
        updatePayload.image_url = imageUrl;
      }

      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error("Error actualizando producto:", updateError);
        throw new Error('Error al guardar el producto: ' + updateError.message);
      }

      console.log("Producto actualizado con éxito!");
      Alert.alert('¡Excelente!', 'Tu producto se actualizó correctamente.');
      
      // Volver a mis productos
      router.back();
    } catch (e: any) {
      console.error("Error general en handlePublish:", e);
      Alert.alert('Error al publicar', e.message || 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar producto</Text>
          <Text style={styles.headerSubtitle}>Modificá los datos de tu publicación.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Selector de Imágenes */}
          {!image && !existingImageUrl ? (
            <TouchableOpacity activeOpacity={0.8} style={styles.imagePickerPlaceholder} onPress={pickImage}>
              <IconSymbol name="camera.fill" size={32} color={Colors.primary} />
              <Text style={styles.imagePickerText}>Cambiar foto</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image ? image.uri : existingImageUrl! }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={pickImage}>
                <IconSymbol name="arrow.triangle.2.circlepath" size={28} color={Colors.surfaceContainerLowest} />
              </TouchableOpacity>
            </View>
          )}

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
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((cat, idx) => (
                <View key={cat} style={{ marginRight: Metrics.spacing.sm }}>
                  <MLChip 
                    label={cat} 
                    isActive={category === cat}
                    onPress={() => setCategory(cat)}
                  />
                </View>
              ))}
            </ScrollView>
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
            title={isLoading ? "Guardando..." : "Guardar cambios"} 
            onPress={handlePublish}
            disabled={!title || !price || !description || isLoading}
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
  imagePreviewContainer: {
    width: '100%',
    height: 160,
    borderRadius: Metrics.borderRadius.lg,
    marginBottom: Metrics.spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
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

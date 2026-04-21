# Mercado Liebre

## Descripción de la aplicación
Mercado Liebre es una aplicación móvil de comercio electrónico (marketplace) donde los usuarios pueden publicar productos para la venta, explorar diferentes artículos, ver detalles de los productos y comunicarse directamente con los vendedores a través de un chat integrado. La aplicación cuenta con autenticación de usuarios, perfiles, y gestión de publicaciones propias.

## Tecnologías utilizadas
- **React Native** con **Expo** (Framework para el desarrollo móvil)
- **TypeScript** (Lenguaje de programación)
- **Expo Router** (Navegación basada en vistas/archivos)
- **Supabase** (Backend as a Service para base de datos y autenticación)

## Instrucciones de instalación / ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd mercado-liebre
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo \`.env\` en la raíz del proyecto y agrega tus credenciales de Supabase:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Ejecutar la aplicación:**
   ```bash
   npx expo start
   ```
   - Escanea el código QR desde la app **Expo Go** en un dispositivo físico.
   - O presiona \`a\` para abrir en un emulador de Android.
   - O presiona \`i\` para abrir en un simulador de iOS.

## Estudiante
**Cristian Godoy**

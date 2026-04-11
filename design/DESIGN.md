# Sistema de Diseño: La Nueva Vanguardia Digital

## 1. El Manifiesto Creativo: "Atmósfera Líquida"

Este sistema de diseño no es una simple interfaz; es un espacio digital curado que captura la esencia de la noche urbana argentina. Nuestra estrella polar creativa es la **"Atmósfera Líquida"**. Rompemos con la rigidez del diseño móvil tradicional (grillas planas y bordes duros) para abrazar una experiencia de profundidad infinita.

Buscamos que el usuario sienta que está interactuando con elementos que flotan sobre un vacío sofisticado. La interfaz debe sentirse cara, pulida y, sobre todo, intencional. La asimetría controlada y el uso de capas translúcidas eliminan la sensación de "plantilla", posicionando a la aplicación como una herramienta profesional para el comercio moderno.

---

## 2. Arquitectura del Color y Superficies

Nuestra paleta se basa en la profundidad del `background` (#0e0e10) y la vibración de los acentos neón.

### El "No-Line" Rule (Regla de Oro)
Queda terminantemente prohibido el uso de bordes sólidos de 1px para seccionar contenido. La separación de elementos se logra exclusivamente mediante:
1.  **Cambios tonales:** Un contenedor `surface-container-low` descansando sobre un `surface`.
2.  **Transiciones suaves:** El uso de gradientes sutiles que guían el ojo sin cortarlo.

### Jerarquía de Superficies y Anidamiento
Tratamos la UI como capas físicas de vidrio esmerilado:
*   **Base:** `surface` (#0e0e10) para el fondo general.
*   **Capas de Contenido:** Utilizamos `surface-container` para elevar la información. Al anidar, una tarjeta `surface-container-highest` sobre una sección `surface-container-low` crea una elevación natural y táctil.

### The "Glass & Gradient" Rule
Para los elementos de mayor importancia (Cards de productos destacados, Modales de confirmación), aplicamos **Glassmorphism**:
*   **Fondo:** `surface-variant` con una opacidad del 40-60%.
*   **Efecto:** `backdrop-filter: blur(20px)`.
*   **Toque Maestro:** Un gradiente lineal imperceptible de `primary` a `secondary` en las esquinas superiores para simular el reflejo de una luz de neón cercana.

---

## 3. Tipografía: Editorial Moderna

Combinamos la fuerza estructural de **Manrope** con la claridad técnica de **Inter**.

*   **Display & Headlines (Manrope):** Usadas para grandes promesas y precios destacados. Su construcción geométrica aporta el tono vanguardista.
*   **Body & Titles (Inter):** Para descripciones de productos y navegación. Inter ofrece una legibilidad suprema en dispositivos móviles, incluso en tamaños pequeños sobre fondos oscuros.

**Uso Sugerido:**
*   `display-lg`: Precios de oferta impactantes.
*   `headline-sm`: Nombres de categorías en el feed.
*   `title-md`: Títulos de productos en el detalle.
*   `label-md`: "Vendido", "Envío gratis", etiquetas de estado.

---

## 4. Elevación y Profundidad: Tonal Layering

Aquí el diseño deja de ser plano para volverse tridimensional sin usar sombras "sucias".

*   **El Principio de Apilado:** La profundidad se comunica mediante el brillo. Cuanto más cerca está un objeto del usuario, más claro es su token de `surface`.
*   **Ambient Shadows:** Si un elemento debe flotar (como un botón de "Comprar ahora" pegajoso), usamos una sombra extra difuminada (blur: 30px) con el color `on-surface` al 6% de opacidad. Esto simula una luz ambiental, no una mancha.
*   **Ghost Borders:** Si la accesibilidad exige un límite visual, usamos `outline-variant` con una opacidad del 15%. Nunca un color sólido opaco.
*   **Luz de Neón:** Los acentos `primary` (#8ff5ff) y `secondary` (#ac89ff) actúan como fuentes de luz. Un resplandor sutil (glow) en estos colores indica interactividad y vitalidad.

---

## 5. Componentes Principales

### Botones (Acciones con Alma)
*   **Primario:** Fondo en gradiente de `primary` a `primary_dim`, texto en `on-primary` (negro). Sin bordes. Es el "Call to Action" definitivo.
*   **Secundario (Glass):** Fondo `surface_container_highest` al 50% con blur. Texto en `primary`.
*   **Terciario:** Solo texto en `primary_fixed`, para acciones de menor jerarquía como "Ver más".

### Cards de Producto
*   **Prohibido:** No usar líneas divisorias.
*   **Estructura:** El producto flota sobre un contenedor `surface-container-low`. La información (precio, título) se separa mediante el uso de `vertical whitespace` (16px a 24px) para dejar que el diseño "respire".

### Chips de Filtro
*   **Estado Inactivo:** Fondo `surface-bright` con opacidad del 10%.
*   **Estado Activo:** Borde "Ghost" de `primary` al 40% y texto en `primary`. Crea un efecto de neón encendido.

### Campos de Entrada (Inputs)
*   Fondo `surface-container-lowest` para dar sensación de hundimiento (concavidad).
*   Al enfocar (Focus), el borde se ilumina suavemente con un resplandor `secondary_dim`.

---

## 6. Guía de "Do's & Don'ts" (Hacer y No Hacer)

### ✅ Qué hacer (Do)
*   **Usar el lenguaje local:** "Publicá tu producto", "Comprá ahora", "Envío a domicilio". El tono debe ser cercano pero impecable.
*   **Priorizar el espacio:** Si dudás, agregá más aire. La elegancia nace del espacio vacío.
*   **Suavidad en la interacción:** Las transiciones entre pantallas deben ser fluidas (fade-in, slide suave), emulando el movimiento del humo o la luz.

### ❌ Qué no hacer (Don't)
*   **No uses gris puro para sombras:** En modo oscuro, las sombras grises ensucian la interfaz. Usá transparencias de los colores de superficie.
*   **No uses divisores de 1px:** Fragmentan la experiencia. Usá bloques de color sutilmente distintos.
*   **No abuses del neón:** El `primary` y `secondary` son condimentos, no el plato principal. Si todo brilla, nada destaca.
*   **No uses bordes redondeados pequeños:** Evitá el `sm` (0.25rem). Preferí `md` o `lg` para que las tarjetas se sientan orgánicas y suaves al tacto.

---
*Este sistema de diseño es un organismo vivo. Cada pixel debe justificar su existencia a través de la funcionalidad y la belleza estética.*
# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2025-10-06

### ✨ Añadido
- **🎯 Herramienta de Recorte (Crop Tool)**
  - Selección interactiva de área de recorte
  - Arrastre del área completa
  - Redimensionamiento desde las esquinas
  - 5 ratios de aspecto predefinidos: Libre, 1:1, 4:3, 16:9, 3:2
  - Soporte táctil para dispositivos móviles
  - Overlay semi-transparente para previsualización
  - Restricciones de tamaño mínimo y límites del canvas
  - Integración completa con el historial de deshacer

- **🩹 Herramienta de Reparación (Healing Tool)**
  - Eliminación de manchas, defectos y rasguños
  - Pincel ajustable (5-100px)
  - Algoritmo de sanado por promedio de píxeles circundantes
  - Cursor personalizado que muestra el tamaño del pincel
  - Deshacer operaciones individuales
  - Reset completo a estado original
  - Soporte táctil para dispositivos móviles
  - Historial de hasta 10 operaciones de reparación

### 🛠️ Técnico
- Nueva clase `CropTool` modular e independiente
- Nueva clase `HealingTool` para restauración de defectos
- Método `crop()` en `ImageProcessor` con validación
- Algoritmo de healing basado en muestreo circular
- Estilos CSS completos para overlay, controles y cursor
- Event listeners para mouse y touch en ambas herramientas
- Actualización automática de dimensiones tras recorte

### 🎨 Interfaz
- Botón "Recortar" en la barra de herramientas
- Botón "Reparar" en la barra de herramientas
- Panel de controles con ratios de aspecto
- Panel de controles de reparación con slider de tamaño
- Indicadores visuales (handles en las esquinas, ícono central)
- Cursor circular personalizado para herramienta de reparación
- Botones "Aplicar", "Cancelar", "Deshacer", "Resetear" con retroalimentación

## [1.0.0] - 2025-10-06

### ✨ Añadido
- Carga de imágenes por drag & drop o selector de archivos
- Soporte para JPG, PNG, WEBP y BMP
- Validación de tamaño (máx. 10MB)
- Ajuste de brillo (-100 a +100)
- Ajuste de contraste (-100 a +100)
- Control de saturación (-100 a +100)
- Nitidez (0 a 100)
- Reducción de ruido (0 a 100)
- Temperatura de color (-100 a +100)
- Filtros rápidos: Escala de grises, Sepia, Vintage, Auto-mejorar
- Modo comparación antes/después con slider interactivo
- Deshacer cambios (historial de hasta 20 estados)
- Descarga de imagen procesada en alta calidad
- Tema claro/oscuro con persistencia
- Diseño responsive (móvil, tablet, desktop)
- Modal de ayuda con instrucciones
- Notificaciones toast
- Spinner de carga
- Información de imagen (dimensiones, tamaño)
- Procesamiento 100% client-side (sin servidores)

### 🎨 Interfaz
- Diseño moderno y minimalista
- Variables CSS para personalización
- Animaciones suaves
- Iconos emoji para rapidez
- Accesibilidad básica (ARIA labels)

### 🔒 Privacidad
- Todo el procesamiento local en el navegador
- Sin cookies de tracking
- Sin telemetría
- Código open source

### 📱 Compatibilidad
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Responsive en móviles y tablets

### 🚀 Performance
- Tamaño total: ~100KB (sin CDN)
- Carga inicial: < 2 segundos
- Procesamiento optimizado con debounce
- Canvas API para rendimiento nativo

## [Unreleased]

### 🔮 Planeado para v1.1
- Crop y rotación de imagen
- Más filtros avanzados (Vignette, Grain, etc.)
- Histograma visual
- Exportar en múltiples formatos (PNG, WEBP)
- Atajos de teclado
- Tutorial interactivo

### 🔮 Planeado para v2.0
- PWA (Progressive Web App)
- Modo offline completo
- Procesamiento por lotes
- Presets guardados
- Integración con IA para restauración automática
- Editor de capas básico

---

## Notas de Versión

### [1.0.0] - Lanzamiento Inicial
Primera versión estable de AppRestaura. Incluye todas las funcionalidades básicas necesarias para restauración de imágenes antiguas de forma privada y eficiente.

**Características principales:**
- ✅ Procesamiento client-side completo
- ✅ 6 ajustes manuales
- ✅ 4 filtros rápidos
- ✅ Comparación visual
- ✅ Tema claro/oscuro
- ✅ Responsive design
- ✅ Compatible GitHub Pages

**Métricas de rendimiento:**
- Lighthouse Performance: 95+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- Tamaño transferido: ~100KB

---

[1.0.0]: https://github.com/tu-usuario/AppRestaura/releases/tag/v1.0.0

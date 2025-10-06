# 🎨 Mejora Propuesta: Herramienta de Recorte (Crop)

## 📋 Descripción

Añadir una herramienta de recorte interactiva que permita a los usuarios seleccionar y recortar áreas específicas de sus imágenes.

---

## ✨ Características

### Funcionalidad Principal
- **Selección visual** con área de recorte arrastrable
- **Mantener proporción** o recorte libre
- **Previsualización** en tiempo real
- **Aplicar o cancelar** el recorte

### Controles
- **Arrastrar área** - Mover el área de recorte
- **Redimensionar** - Cambiar tamaño desde las esquinas
- **Proporciones predefinidas**:
  - Libre (sin restricción)
  - 1:1 (Cuadrado)
  - 4:3 (Clásico)
  - 16:9 (Panorámico)
  - 3:2 (Foto estándar)

---

## 🎯 Beneficios

### Para el Usuario
1. **Eliminar bordes dañados** de fotos antiguas
2. **Enfocar en lo importante** - Recortar personas o elementos específicos
3. **Mejorar composición** de la imagen
4. **Preparar para diferentes usos** (redes sociales, impresión, etc.)

### Para la Aplicación
1. **Característica profesional** muy demandada
2. **Fácil de usar** - Interfaz visual intuitiva
3. **No requiere servidor** - 100% client-side
4. **Performance óptima** - Operación simple de canvas

---

## 🔧 Implementación Técnica

### 1. Nuevos Elementos UI (index.html)

```html
<!-- Botón en toolbar -->
<button id="cropBtn" class="btn-secondary" title="Recortar imagen">
    <span>✂️</span> Recortar
</button>

<!-- Panel de herramienta de recorte -->
<div class="crop-panel hidden" id="cropPanel">
    <h3>✂️ Recortar Imagen</h3>
    
    <div class="crop-aspect-ratios">
        <button class="aspect-btn active" data-ratio="free">Libre</button>
        <button class="aspect-btn" data-ratio="1:1">1:1</button>
        <button class="aspect-btn" data-ratio="4:3">4:3</button>
        <button class="aspect-btn" data-ratio="16:9">16:9</button>
        <button class="aspect-btn" data-ratio="3:2">3:2</button>
    </div>
    
    <div class="crop-actions">
        <button id="applyCropBtn" class="btn-primary">Aplicar Recorte</button>
        <button id="cancelCropBtn" class="btn-secondary">Cancelar</button>
    </div>
</div>

<!-- Overlay de recorte sobre canvas -->
<div class="crop-overlay hidden" id="cropOverlay">
    <div class="crop-area" id="cropArea">
        <div class="crop-handle nw"></div>
        <div class="crop-handle ne"></div>
        <div class="crop-handle sw"></div>
        <div class="crop-handle se"></div>
    </div>
</div>
```

### 2. Estilos CSS (styles.css)

```css
/* Crop Panel */
.crop-panel {
    background: var(--surface);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    margin-top: var(--space-lg);
    box-shadow: var(--shadow-md);
}

.crop-aspect-ratios {
    display: flex;
    gap: var(--space-sm);
    margin: var(--space-md) 0;
    flex-wrap: wrap;
}

.aspect-btn {
    padding: var(--space-sm) var(--space-md);
    background: var(--background);
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
}

.aspect-btn:hover {
    border-color: var(--primary);
    background: var(--primary-light);
}

.aspect-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* Crop Overlay */
.crop-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.crop-area {
    position: absolute;
    border: 2px solid var(--primary);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    cursor: move;
    pointer-events: all;
}

.crop-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid var(--primary);
    border-radius: 50%;
}

.crop-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
.crop-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
.crop-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.crop-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }

.crop-actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
}
```

### 3. Lógica de Recorte (crop-tool.js - NUEVO ARCHIVO)

```javascript
/**
 * Herramienta de Recorte
 */
class CropTool {
    constructor(canvas) {
        this.canvas = canvas;
        this.isActive = false;
        this.cropArea = null;
        this.aspectRatio = null; // null = libre
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.startX = 0;
        this.startY = 0;
    }

    activate() {
        this.isActive = true;
        // Inicializar área de recorte centrada al 80% del canvas
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width * 0.8;
        const height = rect.height * 0.8;
        const x = (rect.width - width) / 2;
        const y = (rect.height - height) / 2;
        
        this.cropArea = { x, y, width, height };
        this.render();
    }

    deactivate() {
        this.isActive = false;
        this.cropArea = null;
    }

    setAspectRatio(ratio) {
        this.aspectRatio = ratio;
        if (ratio && this.cropArea) {
            // Ajustar área actual a la nueva proporción
            this.adjustToAspectRatio();
        }
    }

    adjustToAspectRatio() {
        if (!this.aspectRatio || !this.cropArea) return;
        
        const [w, h] = this.aspectRatio.split(':').map(Number);
        const currentRatio = this.cropArea.width / this.cropArea.height;
        const targetRatio = w / h;
        
        if (currentRatio > targetRatio) {
            // Demasiado ancho, ajustar ancho
            this.cropArea.width = this.cropArea.height * targetRatio;
        } else {
            // Demasiado alto, ajustar alto
            this.cropArea.height = this.cropArea.width / targetRatio;
        }
    }

    getCropData() {
        if (!this.cropArea) return null;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: Math.round(this.cropArea.x * scaleX),
            y: Math.round(this.cropArea.y * scaleY),
            width: Math.round(this.cropArea.width * scaleX),
            height: Math.round(this.cropArea.height * scaleY)
        };
    }

    render() {
        // El overlay visual se maneja en UI.js
        // Este método actualiza las dimensiones del overlay
        const overlay = document.getElementById('cropArea');
        if (overlay && this.cropArea) {
            overlay.style.left = this.cropArea.x + 'px';
            overlay.style.top = this.cropArea.y + 'px';
            overlay.style.width = this.cropArea.width + 'px';
            overlay.style.height = this.cropArea.height + 'px';
        }
    }
}
```

### 4. Integración en image-processor.js

```javascript
/**
 * Recorta la imagen
 * @param {Object} cropData - {x, y, width, height}
 */
crop(cropData) {
    if (!this.originalImage || !cropData) return;
    
    const { x, y, width, height } = cropData;
    
    // Crear nuevo canvas con tamaño recortado
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedCtx = croppedCanvas.getContext('2d');
    
    // Copiar área recortada
    croppedCtx.drawImage(
        this.processedCanvas,
        x, y, width, height,  // Área fuente
        0, 0, width, height   // Destino
    );
    
    // Actualizar canvas principal
    this.originalCanvas.width = width;
    this.originalCanvas.height = height;
    this.processedCanvas.width = width;
    this.processedCanvas.height = height;
    
    // Dibujar imagen recortada
    this.originalCtx.drawImage(croppedCanvas, 0, 0);
    this.processedCtx.drawImage(croppedCanvas, 0, 0);
    
    // Actualizar estado
    this.currentImageData = this.processedCtx.getImageData(0, 0, width, height);
    this.saveState();
    
    Utils.showToast('Imagen recortada correctamente');
}
```

---

## 📱 Flujo de Usuario

1. Usuario carga una imagen
2. Hace clic en botón **"✂️ Recortar"**
3. Aparece overlay con área de recorte ajustable
4. Usuario puede:
   - Arrastrar el área
   - Redimensionar desde las esquinas
   - Cambiar proporción (1:1, 4:3, etc.)
5. Click en **"Aplicar Recorte"**
6. La imagen se recorta permanentemente
7. Usuario puede seguir editando o descargar

---

## 🎨 Capturas de Pantalla (Mockup)

```
┌─────────────────────────────────────┐
│ AppRestaura                    🌙 ❓│
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │     ╔═════════════════╗       │ │
│  │     ║  Área Recorte  ║       │ │
│  │     ║      (drag)     ║       │ │
│  │     ╚═════════════════╝       │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Libre │ 1:1 │ 4:3 │16:9│3:2│   │
│  └─────────────────────────────┘   │
│  [Aplicar] [Cancelar]              │
└─────────────────────────────────────┘
```

---

## ✅ Ventajas de esta Implementación

### Técnicas
- ✅ **No requiere librerías externas**
- ✅ **Usa Canvas API nativo**
- ✅ **Performance óptima**
- ✅ **Compatible con todos los navegadores modernos**
- ✅ **Código modular y reutilizable**

### UX
- ✅ **Visual e intuitiva**
- ✅ **Feedback inmediato**
- ✅ **Proporciones predefinidas útiles**
- ✅ **Cancelable** si el usuario no está satisfecho

### Mantenimiento
- ✅ **Código separado** en archivo propio
- ✅ **Fácil de probar**
- ✅ **No afecta funcionalidad existente**
- ✅ **Fácil de desactivar** si hay problemas

---

## 📊 Complejidad

- **Dificultad:** Media-Baja ⭐⭐⚪⚪⚪
- **Tiempo estimado:** 2-3 horas
- **Líneas de código:** ~200-250
- **Archivos afectados:** 4 (HTML, CSS, JS nuevo, image-processor.js)

---

## 🚀 Plan de Implementación

### Fase 1: Estructura Base (30 min)
- Añadir botón y panel en HTML
- Crear estilos CSS básicos

### Fase 2: Lógica Core (60 min)
- Crear clase CropTool
- Implementar método crop() en ImageProcessor
- Manejar eventos de mouse/touch

### Fase 3: Proporcion y Ajustes (45 min)
- Implementar ratios predefinidos
- Ajustar restricciones de área mínima
- Validaciones

### Fase 4: Testing y Pulido (45 min)
- Probar en diferentes imágenes
- Ajustar responsive
- Pulir animaciones

---

## 🎯 Resultado Esperado

Una herramienta de recorte **profesional y fácil de usar** que convierte AppRestaura en una aplicación de edición de imágenes más completa y útil para la restauración de fotos antiguas.

---

**¿Quieres que implemente esta mejora?** 🚀

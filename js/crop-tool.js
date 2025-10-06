/**
 * Herramienta de Recorte (Crop)
 * Permite seleccionar y recortar áreas de la imagen
 */

class CropTool {
    constructor() {
        this.isActive = false;
        this.cropArea = null;
        this.aspectRatio = null; // null = libre
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.startX = 0;
        this.startY = 0;
        this.canvasRect = null;
        this.canvasOffsetX = 0;
        this.canvasOffsetY = 0;
        
        // Referencias a elementos DOM
        this.overlay = null;
        this.cropAreaElement = null;
        this.canvas = null;
    }

    /**
     * Inicializa la herramienta con referencias DOM
     */
    init(canvas, overlay, cropAreaElement) {
        this.canvas = canvas;
        this.overlay = overlay;
        this.cropAreaElement = cropAreaElement;
        this.setupEventListeners();
    }

    /**
     * Activa la herramienta de recorte
     */
    activate() {
        if (!this.canvas) {
            console.error('Canvas no inicializado');
            return;
        }

        this.isActive = true;
        
        // Mostrar overlay primero
        this.overlay.classList.remove('hidden');
        
        // Forzar un reflow para asegurar que las dimensiones estén actualizadas
        this.overlay.offsetHeight;
        
        // Obtener dimensiones del canvas y del wrapper
        this.canvasRect = this.canvas.getBoundingClientRect();
        const wrapperRect = this.overlay.getBoundingClientRect();
        
        // Calcular offset del canvas dentro del wrapper (porque el canvas puede estar centrado)
        this.canvasOffsetX = this.canvasRect.left - wrapperRect.left;
        this.canvasOffsetY = this.canvasRect.top - wrapperRect.top;
        
        console.log('Canvas rect:', this.canvasRect);
        console.log('Wrapper rect:', wrapperRect);
        console.log('Offsets:', this.canvasOffsetX, this.canvasOffsetY);
        
        // Inicializar área de recorte centrada al 70% del canvas
        const width = this.canvasRect.width * 0.7;
        const height = this.canvasRect.height * 0.7;
        const x = this.canvasOffsetX + (this.canvasRect.width - width) / 2;
        const y = this.canvasOffsetY + (this.canvasRect.height - height) / 2;
        
        this.cropArea = { x, y, width, height };
        
        console.log('Crop area inicial:', this.cropArea);
        
        this.render();
    }

    /**
     * Desactiva la herramienta de recorte
     */
    deactivate() {
        this.isActive = false;
        this.cropArea = null;
        this.aspectRatio = null;
        this.overlay.classList.add('hidden');
    }

    /**
     * Establece la proporción de aspecto
     */
    setAspectRatio(ratio) {
        this.aspectRatio = ratio;
        if (ratio && this.cropArea) {
            this.adjustToAspectRatio();
            this.render();
        }
    }

    /**
     * Ajusta el área al ratio de aspecto
     */
    adjustToAspectRatio() {
        if (!this.aspectRatio || !this.cropArea) return;
        
        const [w, h] = this.aspectRatio.split(':').map(Number);
        const targetRatio = w / h;
        const currentRatio = this.cropArea.width / this.cropArea.height;
        
        if (currentRatio > targetRatio) {
            // Demasiado ancho, ajustar ancho
            this.cropArea.width = this.cropArea.height * targetRatio;
        } else {
            // Demasiado alto, ajustar alto
            this.cropArea.height = this.cropArea.width / targetRatio;
        }
        
        // Asegurar que no se salga del canvas
        this.constrainToCanvas();
    }

    /**
     * Restringe el área de recorte dentro del canvas
     */
    constrainToCanvas() {
        if (!this.cropArea || !this.canvasRect) return;
        
        // Límites del canvas dentro del wrapper
        const minX = this.canvasOffsetX || 0;
        const minY = this.canvasOffsetY || 0;
        const maxX = minX + this.canvasRect.width;
        const maxY = minY + this.canvasRect.height;
        
        // Asegurar tamaño mínimo
        const minSize = 50;
        this.cropArea.width = Math.max(minSize, this.cropArea.width);
        this.cropArea.height = Math.max(minSize, this.cropArea.height);
        
        // Limitar tamaño máximo al canvas
        this.cropArea.width = Math.min(this.cropArea.width, this.canvasRect.width);
        this.cropArea.height = Math.min(this.cropArea.height, this.canvasRect.height);
        
        // Limitar posición para que no se salga
        this.cropArea.x = Math.max(minX, Math.min(this.cropArea.x, maxX - this.cropArea.width));
        this.cropArea.y = Math.max(minY, Math.min(this.cropArea.y, maxY - this.cropArea.height));
    }

    /**
     * Obtiene los datos de recorte escalados al tamaño real del canvas
     */
    getCropData() {
        if (!this.cropArea || !this.canvasRect) return null;
        
        // Coordenadas relativas al canvas (restar el offset del wrapper)
        const relativeX = this.cropArea.x - (this.canvasOffsetX || 0);
        const relativeY = this.cropArea.y - (this.canvasOffsetY || 0);
        
        // Escalar al tamaño real del canvas
        const scaleX = this.canvas.width / this.canvasRect.width;
        const scaleY = this.canvas.height / this.canvasRect.height;
        
        return {
            x: Math.round(relativeX * scaleX),
            y: Math.round(relativeY * scaleY),
            width: Math.round(this.cropArea.width * scaleX),
            height: Math.round(this.cropArea.height * scaleY)
        };
    }

    /**
     * Renderiza el área de recorte
     */
    render() {
        if (!this.cropAreaElement || !this.cropArea) return;
        
        this.cropAreaElement.style.left = this.cropArea.x + 'px';
        this.cropAreaElement.style.top = this.cropArea.y + 'px';
        this.cropAreaElement.style.width = this.cropArea.width + 'px';
        this.cropAreaElement.style.height = this.cropArea.height + 'px';
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        if (!this.cropAreaElement) return;

        // Mouse events
        this.cropAreaElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());

        // Touch events para móviles
        this.cropAreaElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        document.addEventListener('touchmove', (e) => this.onTouchMove(e));
        document.addEventListener('touchend', () => this.onMouseUp());
    }

    /**
     * Maneja el inicio del arrastre
     */
    onMouseDown(e) {
        if (!this.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const rect = this.cropAreaElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Verificar si está sobre un handle de redimensión
        const handleSize = 20; // Área sensible
        
        if (x < handleSize && y < handleSize) {
            this.isResizing = true;
            this.resizeHandle = 'nw';
        } else if (x > rect.width - handleSize && y < handleSize) {
            this.isResizing = true;
            this.resizeHandle = 'ne';
        } else if (x < handleSize && y > rect.height - handleSize) {
            this.isResizing = true;
            this.resizeHandle = 'sw';
        } else if (x > rect.width - handleSize && y > rect.height - handleSize) {
            this.isResizing = true;
            this.resizeHandle = 'se';
        } else {
            // Arrastrar área completa
            this.isDragging = true;
        }
        
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    /**
     * Maneja el movimiento del mouse
     */
    onMouseMove(e) {
        if (!this.isActive || (!this.isDragging && !this.isResizing)) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        console.log('Move delta:', deltaX, deltaY, 'isDragging:', this.isDragging, 'isResizing:', this.isResizing);
        
        if (this.isDragging) {
            // Mover área
            const oldX = this.cropArea.x;
            const oldY = this.cropArea.y;
            
            this.cropArea.x += deltaX;
            this.cropArea.y += deltaY;
            
            console.log('Before constrain:', this.cropArea.x, this.cropArea.y);
            this.constrainToCanvas();
            console.log('After constrain:', this.cropArea.x, this.cropArea.y);
            
        } else if (this.isResizing) {
            // Redimensionar según el handle
            this.resize(deltaX, deltaY);
        }
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        this.render();
    }

    /**
     * Maneja el fin del arrastre
     */
    onMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
    }

    /**
     * Maneja touch start
     */
    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation()
            });
        }
    }

    /**
     * Maneja touch move
     */
    onTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseMove({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        }
    }

    /**
     * Redimensiona el área de recorte
     */
    resize(deltaX, deltaY) {
        const minSize = 50; // Tamaño mínimo
        
        switch (this.resizeHandle) {
            case 'nw':
                this.cropArea.x += deltaX;
                this.cropArea.y += deltaY;
                this.cropArea.width -= deltaX;
                this.cropArea.height -= deltaY;
                break;
            case 'ne':
                this.cropArea.y += deltaY;
                this.cropArea.width += deltaX;
                this.cropArea.height -= deltaY;
                break;
            case 'sw':
                this.cropArea.x += deltaX;
                this.cropArea.width -= deltaX;
                this.cropArea.height += deltaY;
                break;
            case 'se':
                this.cropArea.width += deltaX;
                this.cropArea.height += deltaY;
                break;
        }
        
        // Aplicar tamaño mínimo
        this.cropArea.width = Math.max(minSize, this.cropArea.width);
        this.cropArea.height = Math.max(minSize, this.cropArea.height);
        
        // Si hay aspect ratio, ajustar
        if (this.aspectRatio) {
            this.adjustToAspectRatio();
        }
        
        this.constrainToCanvas();
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CropTool;
}

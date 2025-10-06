/**
 * Herramienta de Reparación/Sanado (Healing Tool)
 * Permite eliminar manchas, defectos y rasguños de fotos antiguas
 */

class HealingTool {
    constructor() {
        this.isActive = false;
        this.isHealing = false;
        this.brushSize = 20;
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.originalImageData = null;
        
        // Cursor personalizado
        this.cursorElement = null;
        this.lastX = 0;
        this.lastY = 0;
        
        // Historial para deshacer
        this.healingHistory = [];
    }

    /**
     * Inicializa la herramienta
     */
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.createCursor();
        this.setupEventListeners();
    }

    /**
     * Crea el cursor personalizado
     */
    createCursor() {
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'healing-cursor';
        this.cursorElement.style.display = 'none';
        document.body.appendChild(this.cursorElement);
    }

    /**
     * Activa la herramienta
     */
    activate() {
        console.log('HealingTool: Activating...');
        this.isActive = true;
        this.canvas.style.cursor = 'none';
        this.cursorElement.style.display = 'block';
        this.updateCursorSize();
        
        // Guardar estado original
        this.originalImageData = this.ctx.getImageData(
            0, 0, this.canvas.width, this.canvas.height
        );
        
        console.log('HealingTool: Activated. Canvas size:', this.canvas.width, 'x', this.canvas.height);
    }

    /**
     * Desactiva la herramienta
     */
    deactivate() {
        this.isActive = false;
        this.canvas.style.cursor = 'default';
        this.cursorElement.style.display = 'none';
        this.healingHistory = [];
    }

    /**
     * Cambia el tamaño del pincel
     */
    setBrushSize(size) {
        this.brushSize = Math.max(5, Math.min(100, size));
        this.updateCursorSize();
    }

    /**
     * Actualiza el tamaño visual del cursor
     */
    updateCursorSize() {
        if (!this.cursorElement) return;
        this.cursorElement.style.width = this.brushSize + 'px';
        this.cursorElement.style.height = this.brushSize + 'px';
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.onMouseUp());
    }

    /**
     * Maneja mousedown
     */
    onMouseDown(e) {
        if (!this.isActive) return;
        
        e.preventDefault();
        this.isHealing = true;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        this.lastX = x;
        this.lastY = y;
        
        this.heal(x, y);
    }

    /**
     * Maneja mousemove
     */
    onMouseMove(e) {
        if (!this.isActive) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Actualizar posición del cursor
        this.cursorElement.style.left = (e.clientX - this.brushSize / 2) + 'px';
        this.cursorElement.style.top = (e.clientY - this.brushSize / 2) + 'px';
        
        if (this.isHealing) {
            const canvasX = x * (this.canvas.width / rect.width);
            const canvasY = y * (this.canvas.height / rect.height);
            
            this.heal(canvasX, canvasY);
            
            this.lastX = canvasX;
            this.lastY = canvasY;
        }
    }

    /**
     * Maneja mouseup
     */
    onMouseUp() {
        if (this.isHealing) {
            this.isHealing = false;
            // Guardar en historial después de cada trazo
            this.saveToHistory();
        }
    }

    /**
     * Maneja mouse leave
     */
    onMouseLeave() {
        if (this.isActive) {
            this.cursorElement.style.display = 'none';
        }
        this.onMouseUp();
    }

    /**
     * Maneja touch start
     */
    onTouchStart(e) {
        if (!this.isActive) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        
        this.isHealing = true;
        this.lastX = x;
        this.lastY = y;
        this.heal(x, y);
    }

    /**
     * Maneja touch move
     */
    onTouchMove(e) {
        if (!this.isActive || !this.isHealing) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        
        this.heal(x, y);
        this.lastX = x;
        this.lastY = y;
    }

    /**
     * Aplica el efecto de sanado/reparación
     * Usa un algoritmo de promedio de píxeles circundantes
     */
    heal(x, y) {
        console.log('Healing at:', x, y, 'brush size:', this.brushSize);
        
        const radius = this.brushSize / 2;
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const originalData = new Uint8ClampedArray(data); // Copiar datos originales
        
        // Para cada píxel en el área del pincel
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Pincel circular
                if (distance > radius) continue;
                
                const pixelX = Math.round(x + dx);
                const pixelY = Math.round(y + dy);
                
                // Verificar límites
                if (pixelX < 0 || pixelX >= this.canvas.width || 
                    pixelY < 0 || pixelY >= this.canvas.height) {
                    continue;
                }
                
                // Calcular el promedio de los píxeles circundantes
                const healedColor = this.getHealedColor(
                    originalData, this.canvas.width, this.canvas.height, pixelX, pixelY, radius
                );
                
                // Aplicar con suavizado (fade out hacia los bordes)
                const strength = Math.pow(1 - (distance / radius), 0.5); // Ajustado para mayor visibilidad
                const index = (pixelY * this.canvas.width + pixelX) * 4;
                
                data[index] = Math.round(originalData[index] * (1 - strength) + healedColor.r * strength);
                data[index + 1] = Math.round(originalData[index + 1] * (1 - strength) + healedColor.g * strength);
                data[index + 2] = Math.round(originalData[index + 2] * (1 - strength) + healedColor.b * strength);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        console.log('Healing applied successfully');
    }

    /**
     * Obtiene el color sanado promediando píxeles circundantes
     */
    getHealedColor(originalData, width, height, x, y, radius) {
        let r = 0, g = 0, b = 0, count = 0;
        
        // Muestrear píxeles en un anillo alrededor del punto
        const sampleRadius = radius * 2; // Aumentado para mejor muestreo
        const samples = 24; // Más muestras para mejor resultado
        
        for (let i = 0; i < samples; i++) {
            const angle = (i / samples) * Math.PI * 2;
            const sampleX = Math.round(x + Math.cos(angle) * sampleRadius);
            const sampleY = Math.round(y + Math.sin(angle) * sampleRadius);
            
            // Verificar límites
            if (sampleX < 0 || sampleX >= width || 
                sampleY < 0 || sampleY >= height) {
                continue;
            }
            
            const index = (sampleY * width + sampleX) * 4;
            r += originalData[index];
            g += originalData[index + 1];
            b += originalData[index + 2];
            count++;
        }
        
        if (count === 0) {
            // Fallback: usar el color actual
            const index = (y * width + x) * 4;
            return {
                r: originalData[index],
                g: originalData[index + 1],
                b: originalData[index + 2]
            };
        }
        
        return {
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count)
        };
    }

    /**
     * Guarda el estado actual en el historial
     */
    saveToHistory() {
        const currentState = this.ctx.getImageData(
            0, 0, this.canvas.width, this.canvas.height
        );
        
        this.healingHistory.push({
            imageData: new ImageData(
                new Uint8ClampedArray(currentState.data),
                currentState.width,
                currentState.height
            ),
            timestamp: Date.now()
        });
        
        // Limitar historial a 10 estados
        if (this.healingHistory.length > 10) {
            this.healingHistory.shift();
        }
    }

    /**
     * Deshace la última operación de sanado
     */
    undo() {
        if (this.healingHistory.length === 0) {
            // Restaurar al original
            if (this.originalImageData) {
                this.ctx.putImageData(this.originalImageData, 0, 0);
            }
            return false;
        }
        
        const lastState = this.healingHistory.pop();
        this.ctx.putImageData(lastState.imageData, 0, 0);
        return true;
    }

    /**
     * Resetea al estado original
     */
    reset() {
        if (this.originalImageData) {
            this.ctx.putImageData(this.originalImageData, 0, 0);
            this.healingHistory = [];
        }
    }

    /**
     * Obtiene el canvas actual
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Limpia recursos
     */
    cleanup() {
        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealingTool;
}

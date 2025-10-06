/**
 * Utilidades - Funciones auxiliares
 */

const Utils = {
    /**
     * Valida si el archivo es una imagen válida
     * @param {File} file - Archivo a validar
     * @returns {Object} - { valid: boolean, error: string }
     */
    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!file) {
            return { valid: false, error: 'No se seleccionó ningún archivo' };
        }

        if (!validTypes.includes(file.type)) {
            return { 
                valid: false, 
                error: 'Formato no válido. Usa JPG, PNG, WEBP o BMP' 
            };
        }

        if (file.size > maxSize) {
            return { 
                valid: false, 
                error: 'El archivo es demasiado grande. Máximo 10MB' 
            };
        }

        return { valid: true, error: null };
    },

    /**
     * Descarga una imagen del canvas
     * @param {HTMLCanvasElement} canvas - Canvas a descargar
     * @param {string} filename - Nombre del archivo
     * @param {string} format - Formato de imagen (jpeg, png, webp)
     * @param {number} quality - Calidad (0-1)
     */
    downloadImage(canvas, filename = 'restaurada', format = 'jpeg', quality = 0.95) {
        const mimeType = `image/${format}`;
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}_${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, mimeType, quality);
    },

    /**
     * Formatea el tamaño de archivo en formato legible
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} - Tamaño formateado
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Muestra una notificación toast
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    },

    /**
     * Muestra/oculta el spinner de carga
     * @param {boolean} show - Mostrar u ocultar
     */
    toggleLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    },

    /**
     * Clamp - Limita un valor entre min y max
     * @param {number} value - Valor
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @returns {number} - Valor limitado
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Debounce - Retrasa la ejecución de una función
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function} - Función debounced
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Obtiene información de la imagen
     * @param {HTMLImageElement} img - Imagen
     * @returns {Object} - Información de la imagen
     */
    getImageInfo(img) {
        return {
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspectRatio: img.naturalWidth / img.naturalHeight,
            megapixels: (img.naturalWidth * img.naturalHeight / 1000000).toFixed(2)
        };
    },

    /**
     * Copia un canvas
     * @param {HTMLCanvasElement} sourceCanvas - Canvas fuente
     * @returns {HTMLCanvasElement} - Canvas copiado
     */
    copyCanvas(sourceCanvas) {
        const destCanvas = document.createElement('canvas');
        destCanvas.width = sourceCanvas.width;
        destCanvas.height = sourceCanvas.height;
        const destCtx = destCanvas.getContext('2d');
        destCtx.drawImage(sourceCanvas, 0, 0);
        return destCanvas;
    },

    /**
     * Guarda el estado en localStorage
     * @param {string} key - Clave
     * @param {*} value - Valor
     */
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
    },

    /**
     * Recupera el estado de localStorage
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto
     * @returns {*} - Valor recuperado
     */
    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('No se pudo recuperar de localStorage:', e);
            return defaultValue;
        }
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

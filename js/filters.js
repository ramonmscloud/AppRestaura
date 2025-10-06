/**
 * Filtros de Procesamiento de Imágenes
 * Funciones puras que manipulan ImageData
 */

const Filters = {
    /**
     * Ajusta el brillo de la imagen
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Valor de brillo (-100 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    brightness(imageData, value) {
        const data = imageData.data;
        const adjustment = (value / 100) * 255;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Utils.clamp(data[i] + adjustment, 0, 255);     // R
            data[i + 1] = Utils.clamp(data[i + 1] + adjustment, 0, 255); // G
            data[i + 2] = Utils.clamp(data[i + 2] + adjustment, 0, 255); // B
        }
        
        return imageData;
    },

    /**
     * Ajusta el contraste de la imagen
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Valor de contraste (-100 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    contrast(imageData, value) {
        const data = imageData.data;
        const factor = (259 * (value + 255)) / (255 * (259 - value));
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Utils.clamp(factor * (data[i] - 128) + 128, 0, 255);
            data[i + 1] = Utils.clamp(factor * (data[i + 1] - 128) + 128, 0, 255);
            data[i + 2] = Utils.clamp(factor * (data[i + 2] - 128) + 128, 0, 255);
        }
        
        return imageData;
    },

    /**
     * Ajusta la saturación de la imagen
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Valor de saturación (-100 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    saturation(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calcular luminosidad
            const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
            
            data[i] = Utils.clamp(gray + adjustment * (r - gray), 0, 255);
            data[i + 1] = Utils.clamp(gray + adjustment * (g - gray), 0, 255);
            data[i + 2] = Utils.clamp(gray + adjustment * (b - gray), 0, 255);
        }
        
        return imageData;
    },

    /**
     * Aplica nitidez a la imagen mediante convolución
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Intensidad de nitidez (0 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    sharpen(imageData, value) {
        if (value === 0) return imageData;
        
        const amount = value / 100;
        const kernel = [
            0, -amount, 0,
            -amount, 1 + 4 * amount, -amount,
            0, -amount, 0
        ];
        
        return this.convolve(imageData, kernel);
    },

    /**
     * Reduce el ruido mediante blur gaussiano suave
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Intensidad de reducción (0 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    denoise(imageData, value) {
        if (value === 0) return imageData;
        
        const iterations = Math.floor(value / 25); // 0-4 iteraciones
        let result = imageData;
        
        for (let i = 0; i < iterations; i++) {
            result = this.boxBlur(result);
        }
        
        return result;
    },

    /**
     * Ajusta la temperatura de color
     * @param {ImageData} imageData - Datos de la imagen
     * @param {number} value - Valor de temperatura (-100 a 100)
     * @returns {ImageData} - ImageData modificado
     */
    temperature(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            if (adjustment > 0) {
                // Más cálido (más rojo, menos azul)
                data[i] = Utils.clamp(data[i] + adjustment * 30, 0, 255);
                data[i + 2] = Utils.clamp(data[i + 2] - adjustment * 30, 0, 255);
            } else {
                // Más frío (menos rojo, más azul)
                data[i] = Utils.clamp(data[i] + adjustment * 30, 0, 255);
                data[i + 2] = Utils.clamp(data[i + 2] - adjustment * 30, 0, 255);
            }
        }
        
        return imageData;
    },

    /**
     * Convierte a escala de grises
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {ImageData} - ImageData modificado
     */
    grayscale(imageData) {
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
        }
        
        return imageData;
    },

    /**
     * Aplica efecto sepia
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {ImageData} - ImageData modificado
     */
    sepia(imageData) {
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Utils.clamp(0.393 * r + 0.769 * g + 0.189 * b, 0, 255);
            data[i + 1] = Utils.clamp(0.349 * r + 0.686 * g + 0.168 * b, 0, 255);
            data[i + 2] = Utils.clamp(0.272 * r + 0.534 * g + 0.131 * b, 0, 255);
        }
        
        return imageData;
    },

    /**
     * Aplica efecto vintage
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {ImageData} - ImageData modificado
     */
    vintage(imageData) {
        // Combina sepia con ajustes de contraste
        this.sepia(imageData);
        this.contrast(imageData, 10);
        this.brightness(imageData, -5);
        
        return imageData;
    },

    /**
     * Auto-mejora automática
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {ImageData} - ImageData modificado
     */
    autoEnhance(imageData) {
        // Analiza el histograma y aplica ajustes automáticos
        const histogram = this.calculateHistogram(imageData);
        
        // Ajustes suaves para mejorar la imagen
        this.contrast(imageData, 15);
        this.brightness(imageData, 5);
        this.saturation(imageData, 10);
        
        return imageData;
    },

    /**
     * Convolución con kernel (para filtros como sharpen)
     * @param {ImageData} imageData - Datos de la imagen
     * @param {Array} kernel - Kernel de convolución 3x3
     * @returns {ImageData} - ImageData modificado
     */
    convolve(imageData, kernel) {
        const width = imageData.width;
        const height = imageData.height;
        const src = new Uint8ClampedArray(imageData.data);
        const dst = imageData.data;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            sum += src[idx] * kernel[kernelIdx];
                        }
                    }
                    
                    const idx = (y * width + x) * 4 + c;
                    dst[idx] = Utils.clamp(sum, 0, 255);
                }
            }
        }
        
        return imageData;
    },

    /**
     * Box blur simple
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {ImageData} - ImageData modificado
     */
    boxBlur(imageData) {
        const kernel = [
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9
        ];
        
        return this.convolve(imageData, kernel);
    },

    /**
     * Calcula el histograma de la imagen
     * @param {ImageData} imageData - Datos de la imagen
     * @returns {Object} - Histograma de R, G, B
     */
    calculateHistogram(imageData) {
        const data = imageData.data;
        const histogram = {
            r: new Array(256).fill(0),
            g: new Array(256).fill(0),
            b: new Array(256).fill(0)
        };
        
        for (let i = 0; i < data.length; i += 4) {
            histogram.r[data[i]]++;
            histogram.g[data[i + 1]]++;
            histogram.b[data[i + 2]]++;
        }
        
        return histogram;
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Filters;
}

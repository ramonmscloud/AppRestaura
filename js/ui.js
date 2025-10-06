/**
 * Interfaz de Usuario
 * Maneja todas las interacciones con el usuario
 */

const UI = {
    elements: {},
    processor: null,
    isComparing: false,
    compareSliderPosition: 50,

    /**
     * Inicializa la interfaz de usuario
     * @param {ImageProcessor} processor - Procesador de imágenes
     */
    init(processor) {
        this.processor = processor;
        this.cacheElements();
        this.setupEventListeners();
        this.loadTheme();
    },

    /**
     * Cachea referencias a elementos del DOM
     */
    cacheElements() {
        this.elements = {
            // Sections
            uploadSection: document.getElementById('uploadSection'),
            editorSection: document.getElementById('editorSection'),
            
            // Upload
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            
            // Canvas
            originalCanvas: document.getElementById('originalCanvas'),
            processedCanvas: document.getElementById('processedCanvas'),
            compareSlider: document.getElementById('compareSlider'),
            canvasInfo: document.getElementById('canvasInfo'),
            imageDimensions: document.getElementById('imageDimensions'),
            imageSize: document.getElementById('imageSize'),
            
            // Toolbar
            resetBtn: document.getElementById('resetBtn'),
            undoBtn: document.getElementById('undoBtn'),
            compareBtn: document.getElementById('compareBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            newImageBtn: document.getElementById('newImageBtn'),
            
            // Controls
            brightnessSlider: document.getElementById('brightnessSlider'),
            contrastSlider: document.getElementById('contrastSlider'),
            saturationSlider: document.getElementById('saturationSlider'),
            sharpnessSlider: document.getElementById('sharpnessSlider'),
            denoiseSlider: document.getElementById('denoiseSlider'),
            temperatureSlider: document.getElementById('temperatureSlider'),
            resetFiltersBtn: document.getElementById('resetFiltersBtn'),
            
            // Values
            brightnessValue: document.getElementById('brightnessValue'),
            contrastValue: document.getElementById('contrastValue'),
            saturationValue: document.getElementById('saturationValue'),
            sharpnessValue: document.getElementById('sharpnessValue'),
            denoiseValue: document.getElementById('denoiseValue'),
            temperatureValue: document.getElementById('temperatureValue'),
            
            // Quick filters
            filterBtns: document.querySelectorAll('.filter-btn'),
            
            // Theme
            themeToggle: document.getElementById('themeToggle'),
            
            // Modals
            helpBtn: document.getElementById('helpBtn'),
            helpModal: document.getElementById('helpModal'),
            closeHelpModal: document.getElementById('closeHelpModal'),
            privacyLink: document.getElementById('privacyLink')
        };
    },

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Upload
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });
        
        // Drag & Drop
        this.elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.add('drag-over');
        });
        
        this.elements.uploadArea.addEventListener('dragleave', () => {
            this.elements.uploadArea.classList.remove('drag-over');
        });
        
        this.elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            this.handleFileSelect(file);
        });
        
        // Toolbar
        this.elements.resetBtn.addEventListener('click', () => this.handleReset());
        this.elements.undoBtn.addEventListener('click', () => this.handleUndo());
        this.elements.compareBtn.addEventListener('click', () => this.toggleCompare());
        this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.elements.newImageBtn.addEventListener('click', () => this.handleNewImage());
        
        // Sliders con debounce para mejor rendimiento
        const handleSliderChange = Utils.debounce((slider, filterName, valueElement) => {
            const value = parseFloat(slider.value);
            valueElement.textContent = value;
            this.processor.updateFilter(filterName, value);
        }, 50);
        
        this.elements.brightnessSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'brightness', this.elements.brightnessValue);
        });
        
        this.elements.contrastSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'contrast', this.elements.contrastValue);
        });
        
        this.elements.saturationSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'saturation', this.elements.saturationValue);
        });
        
        this.elements.sharpnessSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'sharpness', this.elements.sharpnessValue);
        });
        
        this.elements.denoiseSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'denoise', this.elements.denoiseValue);
        });
        
        this.elements.temperatureSlider.addEventListener('input', (e) => {
            handleSliderChange(e.target, 'temperature', this.elements.temperatureValue);
        });
        
        this.elements.resetFiltersBtn.addEventListener('click', () => {
            this.resetAllSliders();
        });
        
        // Quick filters
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.filter;
                this.applyQuickFilter(filterType);
            });
        });
        
        // Theme
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Modals
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        this.elements.closeHelpModal.addEventListener('click', () => this.hideHelp());
        this.elements.privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyInfo();
        });
        
        // Cerrar modal al hacer clic fuera
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.hideHelp();
            }
        });
        
        // Compare slider
        this.setupCompareSlider();
    },

    /**
     * Maneja la selección de archivo
     * @param {File} file - Archivo seleccionado
     */
    async handleFileSelect(file) {
        const validation = Utils.validateFile(file);
        
        if (!validation.valid) {
            Utils.showToast(validation.error);
            return;
        }
        
        Utils.toggleLoading(true);
        
        try {
            const img = await this.processor.loadImage(file);
            this.showEditor();
            this.updateImageInfo(file);
            Utils.showToast('Imagen cargada correctamente');
        } catch (error) {
            Utils.showToast('Error al cargar la imagen: ' + error.message);
        } finally {
            Utils.toggleLoading(false);
        }
    },

    /**
     * Muestra la sección del editor
     */
    showEditor() {
        this.elements.uploadSection.classList.add('hidden');
        this.elements.editorSection.classList.remove('hidden');
        this.resetAllSliders();
    },

    /**
     * Actualiza la información de la imagen
     * @param {File} file - Archivo de imagen
     */
    updateImageInfo(file) {
        const info = this.processor.getImageInfo();
        if (info) {
            this.elements.imageDimensions.textContent = 
                `${info.width} × ${info.height} px`;
            this.elements.imageSize.textContent = 
                Utils.formatFileSize(file.size);
        }
    },

    /**
     * Resetea todos los sliders
     */
    resetAllSliders() {
        this.processor.resetFilters();
        
        const sliders = [
            { slider: this.elements.brightnessSlider, value: this.elements.brightnessValue },
            { slider: this.elements.contrastSlider, value: this.elements.contrastValue },
            { slider: this.elements.saturationSlider, value: this.elements.saturationValue },
            { slider: this.elements.sharpnessSlider, value: this.elements.sharpnessValue },
            { slider: this.elements.denoiseSlider, value: this.elements.denoiseValue },
            { slider: this.elements.temperatureSlider, value: this.elements.temperatureValue }
        ];
        
        sliders.forEach(({ slider, value }) => {
            slider.value = 0;
            value.textContent = '0';
        });
    },

    /**
     * Aplica un filtro rápido
     * @param {string} filterType - Tipo de filtro
     */
    applyQuickFilter(filterType) {
        this.processor.applyQuickFilter(filterType);
        this.resetAllSliders();
        Utils.showToast(`Filtro "${filterType}" aplicado`);
    },

    /**
     * Maneja el reset de la imagen
     */
    handleReset() {
        this.processor.reset();
        this.resetAllSliders();
        this.updateUndoButton();
        Utils.showToast('Imagen reiniciada');
    },

    /**
     * Maneja el deshacer
     */
    handleUndo() {
        if (this.processor.undo()) {
            // Actualizar sliders con el estado restaurado
            const state = this.processor.filterState;
            this.elements.brightnessSlider.value = state.brightness;
            this.elements.brightnessValue.textContent = state.brightness;
            this.elements.contrastSlider.value = state.contrast;
            this.elements.contrastValue.textContent = state.contrast;
            this.elements.saturationSlider.value = state.saturation;
            this.elements.saturationValue.textContent = state.saturation;
            this.elements.sharpnessSlider.value = state.sharpness;
            this.elements.sharpnessValue.textContent = state.sharpness;
            this.elements.denoiseSlider.value = state.denoise;
            this.elements.denoiseValue.textContent = state.denoise;
            this.elements.temperatureSlider.value = state.temperature;
            this.elements.temperatureValue.textContent = state.temperature;
            
            this.updateUndoButton();
            Utils.showToast('Cambio deshecho');
        }
    },

    /**
     * Actualiza el estado del botón deshacer
     */
    updateUndoButton() {
        this.elements.undoBtn.disabled = !this.processor.canUndo();
    },

    /**
     * Alterna la vista de comparación
     */
    toggleCompare() {
        this.isComparing = !this.isComparing;
        
        if (this.isComparing) {
            this.elements.originalCanvas.style.display = 'block';
            this.elements.compareSlider.classList.remove('hidden');
            this.updateCompareView(50);
            Utils.showToast('Modo comparación activado');
        } else {
            this.elements.originalCanvas.style.display = 'none';
            this.elements.compareSlider.classList.add('hidden');
        }
    },

    /**
     * Configura el slider de comparación
     */
    setupCompareSlider() {
        let isDragging = false;
        
        const updatePosition = (clientX) => {
            const rect = this.elements.processedCanvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Utils.clamp((x / rect.width) * 100, 0, 100);
            this.updateCompareView(percentage);
        };
        
        this.elements.compareSlider.addEventListener('mousedown', () => {
            isDragging = true;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && this.isComparing) {
                updatePosition(e.clientX);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch events para móviles
        this.elements.compareSlider.addEventListener('touchstart', () => {
            isDragging = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging && this.isComparing) {
                updatePosition(e.touches[0].clientX);
            }
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    },

    /**
     * Actualiza la vista de comparación
     * @param {number} percentage - Porcentaje de división
     */
    updateCompareView(percentage) {
        this.compareSliderPosition = percentage;
        this.elements.compareSlider.style.left = percentage + '%';
        
        // Clip del canvas procesado
        const clipWidth = (percentage / 100) * this.elements.processedCanvas.width;
        this.elements.processedCanvas.style.clipPath = 
            `inset(0 ${100 - percentage}% 0 0)`;
    },

    /**
     * Maneja la descarga de la imagen
     */
    handleDownload() {
        const canvas = this.processor.getProcessedCanvas();
        Utils.downloadImage(canvas, 'imagen_restaurada', 'jpeg', 0.95);
        Utils.showToast('Imagen descargada');
    },

    /**
     * Maneja la carga de una nueva imagen
     */
    handleNewImage() {
        if (this.processor.hasUnsavedChanges()) {
            const confirm = window.confirm(
                '¿Estás seguro? Se perderán los cambios no guardados.'
            );
            if (!confirm) return;
        }
        
        this.elements.uploadSection.classList.remove('hidden');
        this.elements.editorSection.classList.add('hidden');
        this.elements.fileInput.value = '';
        this.processor.reset();
    },

    /**
     * Alterna el tema claro/oscuro
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        this.elements.themeToggle.querySelector('.theme-icon').textContent = 
            newTheme === 'dark' ? '☀️' : '🌙';
        
        Utils.saveToStorage('theme', newTheme);
    },

    /**
     * Carga el tema guardado
     */
    loadTheme() {
        const savedTheme = Utils.loadFromStorage('theme', 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeToggle.querySelector('.theme-icon').textContent = 
            savedTheme === 'dark' ? '☀️' : '🌙';
    },

    /**
     * Muestra el modal de ayuda
     */
    showHelp() {
        this.elements.helpModal.classList.remove('hidden');
    },

    /**
     * Oculta el modal de ayuda
     */
    hideHelp() {
        this.elements.helpModal.classList.add('hidden');
    },

    /**
     * Muestra información de privacidad
     */
    showPrivacyInfo() {
        alert(
            'POLÍTICA DE PRIVACIDAD\n\n' +
            'AppRestaura procesa todas las imágenes localmente en tu navegador.\n\n' +
            '✓ Ninguna imagen se sube a servidores\n' +
            '✓ No guardamos datos personales\n' +
            '✓ No usamos cookies de seguimiento\n' +
            '✓ Código 100% open source\n\n' +
            'Tu privacidad está completamente protegida.'
        );
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}

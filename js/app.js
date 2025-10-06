/**
 * App Principal - Punto de entrada de la aplicación
 * AppRestaura v1.0.0
 */

// Estado global de la aplicación
const App = {
    processor: null,
    cropTool: null,
    healingTool: null,
    initialized: false,

    /**
     * Inicializa la aplicación
     */
    init() {
        if (this.initialized) {
            console.warn('App ya inicializada');
            return;
        }

        console.log('%c🖼️ AppRestaura v1.0.0', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
        console.log('%cProcesamiento 100% client-side - Tu privacidad está protegida', 'color: #10b981;');

        // Verificar compatibilidad del navegador
        if (!this.checkBrowserCompatibility()) {
            this.showCompatibilityError();
            return;
        }

        try {
            // Inicializar procesador de imágenes
            const originalCanvas = document.getElementById('originalCanvas');
            const processedCanvas = document.getElementById('processedCanvas');
            
            this.processor = new ImageProcessor(originalCanvas, processedCanvas);

            // Inicializar herramienta de recorte
            const cropOverlay = document.getElementById('cropOverlay');
            const cropArea = document.getElementById('cropArea');
            
            this.cropTool = new CropTool();
            this.cropTool.init(processedCanvas, cropOverlay, cropArea);

            // Inicializar herramienta de reparación
            this.healingTool = new HealingTool();
            this.healingTool.init(processedCanvas);

            // Inicializar UI
            UI.init(this.processor, this.cropTool, this.healingTool);

            // Marcar como inicializada
            this.initialized = true;

            // Registrar service worker para PWA (opcional)
            this.registerServiceWorker();

            console.log('✅ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this.showInitError(error);
        }
    },

    /**
     * Verifica la compatibilidad del navegador
     * @returns {boolean} - true si el navegador es compatible
     */
    checkBrowserCompatibility() {
        // Verificar Canvas API
        const canvas = document.createElement('canvas');
        if (!canvas.getContext || !canvas.getContext('2d')) {
            console.error('❌ Canvas API no soportado');
            return false;
        }

        // Verificar File API
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            console.error('❌ File API no soportado');
            return false;
        }

        // localStorage es opcional, solo advertir si no está disponible
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
        } catch (e) {
            console.warn('⚠️ localStorage no disponible, algunas funciones pueden no funcionar');
        }

        // Si llegamos aquí, el navegador es compatible
        return true;
    },

    /**
     * Muestra un error de compatibilidad
     */
    showCompatibilityError() {
        const message = `
            <div style="text-align: center; padding: 2rem; max-width: 600px; margin: 2rem auto;">
                <h2 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Navegador No Compatible</h2>
                <p>Lo sentimos, tu navegador no soporta las características necesarias para ejecutar AppRestaura.</p>
                <p style="margin-top: 1rem;">Por favor, actualiza tu navegador o usa uno de los siguientes:</p>
                <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                    <li>✓ Chrome 90+</li>
                    <li>✓ Firefox 88+</li>
                    <li>✓ Safari 14+</li>
                    <li>✓ Edge 90+</li>
                </ul>
            </div>
        `;
        
        document.body.innerHTML = message;
    },

    /**
     * Muestra un error de inicialización
     * @param {Error} error - Error ocurrido
     */
    showInitError(error) {
        const message = `
            <div style="text-align: center; padding: 2rem; max-width: 600px; margin: 2rem auto;">
                <h2 style="color: #ef4444; margin-bottom: 1rem;">❌ Error de Inicialización</h2>
                <p>Ocurrió un error al inicializar la aplicación:</p>
                <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: left;">
${error.message}
                </pre>
                <p style="margin-top: 1rem;">Por favor, recarga la página o contacta con soporte.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Recargar Página
                </button>
            </div>
        `;
        
        document.body.innerHTML = message;
    },

    /**
     * Registra el service worker para PWA (opcional)
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Comentado por ahora - implementar en versión PWA futura
            /*
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar Service Worker:', error);
                });
            */
        }
    },

    /**
     * Obtiene información de la aplicación
     * @returns {Object} - Información de la app
     */
    getInfo() {
        return {
            name: 'AppRestaura',
            version: '1.0.0',
            description: 'Restauración de imágenes antiguas 100% client-side',
            author: 'AppRestaura Team',
            license: 'MIT',
            repository: 'https://github.com/tu-usuario/AppRestaura'
        };
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Exponer App globalmente para debugging
window.AppRestaura = App;

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
    Utils.showToast('Ocurrió un error inesperado. Por favor, recarga la página.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
    Utils.showToast('Error al procesar la operación.');
});

// Prevenir que el navegador abra imágenes arrastradas
window.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);

window.addEventListener('drop', (e) => {
    e.preventDefault();
}, false);

// Log de información en consola para developers
console.log('%cAppRestaura - Developer Info', 'font-size: 14px; font-weight: bold;');
console.table(App.getInfo());
console.log('%cPara debugging, usa: window.AppRestaura', 'color: #8b5cf6;');

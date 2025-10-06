# 🖼️ AppRestaura - Restauración de Imágenes Antiguas

Aplicación web moderna y eficiente para la restauración y mejora de imágenes antiguas, completamente del lado del cliente.

## 🎯 Características Principales

- ✅ **100% Client-Side**: Todo el procesamiento ocurre en tu navegador
- 🚀 **Alto Rendimiento**: Optimizado para operaciones rápidas
- ✂️ **Herramienta de Recorte**: Selección interactiva con ratios de aspecto
- 🩹 **Herramienta de Reparación**: Elimina manchas, rasguños y defectos
- 📱 **Responsive**: Funciona en desktop, tablet y móvil
- 🎨 **Múltiples Filtros**: Brillo, contraste, saturación, nitidez y más
- 🔒 **Privacidad Total**: Tus imágenes nunca salen de tu dispositivo
- 🌐 **Compatible GitHub Pages**: Deploy simple y gratuito
- 🎭 **Tema Claro/Oscuro**: Interfaz adaptable
- ⚡ **Sin Backend**: No requiere servidor

## 🚀 Inicio Rápido

### Opción 1: Usar directamente desde GitHub Pages
```
https://[tu-usuario].github.io/AppRestaura
```

### Opción 2: Clonar y ejecutar localmente
```bash
git clone https://github.com/[tu-usuario]/AppRestaura.git
cd AppRestaura
# Abrir index.html en tu navegador o usar un servidor local
python -m http.server 8000
# O con Node.js
npx serve
```

## 📋 Requisitos

- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript habilitado
- Mínimo 2GB RAM recomendado

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Lógica de la aplicación
- **Canvas API**: Procesamiento de imágenes
- **Fabric.js** (opcional): Manipulación avanzada de canvas
- **Pica.js** (opcional): Redimensionamiento de alta calidad

## 📁 Estructura del Proyecto

```
AppRestaura/
├── index.html              # Página principal
├── README.md               # Este archivo
├── REQUIREMENTS.md         # Documento de requerimientos detallado
├── LICENSE                 # Licencia del proyecto
├── css/
│   ├── styles.css         # Estilos principales
│   ├── responsive.css     # Media queries
│   └── themes.css         # Temas claro/oscuro
├── js/
│   ├── app.js             # Punto de entrada
│   ├── image-processor.js # Procesamiento de imágenes
│   ├── filters.js         # Filtros y efectos
│   ├── ui.js              # Manejo de UI
│   └── utils.js           # Funciones auxiliares
├── assets/
│   ├── icons/             # Iconos SVG
│   └── images/            # Recursos de UI
└── docs/
    └── examples/          # Imágenes de ejemplo
```

## 🎨 Funcionalidades

### Básicas
- ✨ Ajuste de brillo y contraste
- 🌈 Corrección de color (saturación, temperatura)
- 🔍 Enfoque y nitidez
- 🎭 Reducción de ruido
- ↩️ Deshacer/Rehacer cambios
- 💾 Descarga de imagen procesada

### Avanzadas (Planificadas)
- 🩹 Restauración de áreas dañadas
- 🧹 Eliminación de manchas y arañazos
- 📏 Recorte y rotación
- 📊 Vista de histograma
- 🔄 Procesamiento por lotes

## 🚀 Deploy en GitHub Pages

1. **Fork o clona este repositorio**
2. **Activa GitHub Pages en tu repositorio**:
   - Ve a Settings → Pages
   - Selecciona la rama `main` o `gh-pages`
   - Guarda los cambios
3. **Tu app estará disponible en**: `https://[tu-usuario].github.io/AppRestaura`

## 📖 Uso

1. **Cargar Imagen**: Haz clic en "Seleccionar Imagen" o arrastra una imagen
2. **Aplicar Filtros**: Usa los controles deslizantes para ajustar
3. **Vista Previa**: Compara antes/después con el slider
4. **Descargar**: Guarda tu imagen restaurada

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Canvas API por hacer posible el procesamiento client-side
- Comunidad de código abierto
- Todos los contribuidores

## 📞 Contacto

- **Repositorio**: [GitHub](https://github.com/[tu-usuario]/AppRestaura)
- **Issues**: [Reportar un problema](https://github.com/[tu-usuario]/AppRestaura/issues)

## 🗺️ Roadmap

- [x] MVP con funcionalidades básicas
- [ ] Más filtros avanzados
- [ ] Soporte PWA (Progressive Web App)
- [ ] Modo offline completo
- [ ] Procesamiento por lotes
- [ ] Integración con IA para restauración automática
- [ ] Exportar a múltiples formatos
- [ ] Presets de restauración

---

**Nota**: Esta aplicación procesa todas las imágenes localmente en tu navegador. Ninguna imagen se envía a servidores externos, garantizando tu privacidad.

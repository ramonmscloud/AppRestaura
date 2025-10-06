# 🚀 Guía de Inicio Rápido

## Instalación Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/AppRestaura.git
cd AppRestaura
```

2. **Abrir con un servidor local:**

### Opción 1: Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opción 2: Node.js
```bash
npx serve
```

### Opción 3: VS Code
- Instalar extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

3. **Abrir en el navegador:**
```
http://localhost:8000
```

## Deploy en GitHub Pages

1. **Crear un repositorio en GitHub**

2. **Push del código:**
```bash
git init
git add .
git commit -m "Initial commit - AppRestaura v1.0"
git branch -M main
git remote add origin https://github.com/tu-usuario/AppRestaura.git
git push -u origin main
```

3. **Activar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / (root)
   - Save

4. **Tu app estará disponible en:**
```
https://tu-usuario.github.io/AppRestaura
```

## Uso

1. **Cargar imagen:** Arrastra o selecciona una imagen antigua
2. **Ajustar filtros:** Usa los controles deslizantes
3. **Comparar:** Activa el modo comparación para ver antes/después
4. **Descargar:** Guarda tu imagen restaurada

## Características Disponibles (v1.0)

✅ Carga de imágenes (JPG, PNG, WEBP, BMP)
✅ Ajuste de brillo y contraste
✅ Control de saturación
✅ Nitidez
✅ Reducción de ruido
✅ Temperatura de color
✅ Filtros rápidos (Sepia, B/N, Vintage, Auto-mejorar)
✅ Comparación antes/después
✅ Deshacer cambios
✅ Tema claro/oscuro
✅ Responsive (móvil, tablet, desktop)
✅ 100% privado (sin servidores)

## Troubleshooting

**Problema:** La imagen no se carga
- Verifica el formato (JPG, PNG, WEBP, BMP)
- Verifica el tamaño (máx. 10MB)

**Problema:** Los filtros son lentos
- Reduce el tamaño de la imagen
- Usa un navegador moderno actualizado

**Problema:** Error en navegador antiguo
- Actualiza a Chrome 90+, Firefox 88+, Safari 14+ o Edge 90+

## Contribuir

Las contribuciones son bienvenidas! Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## Licencia

MIT - Ver [LICENSE](LICENSE)

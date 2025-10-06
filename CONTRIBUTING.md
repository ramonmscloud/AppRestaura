# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a AppRestaura!

## Cómo Contribuir

### 1. Reportar Bugs

Abre un issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Capturas de pantalla si aplica
- Navegador y versión
- Consola de errores (F12)

### 2. Sugerir Características

Abre un issue con:
- Descripción de la característica
- Caso de uso
- Mockups o ejemplos si es posible

### 3. Código

#### Setup del Entorno

```bash
# Fork el repositorio
git clone https://github.com/tu-usuario/AppRestaura.git
cd AppRestaura

# Crear rama para tu feature
git checkout -b feature/mi-caracteristica

# Iniciar servidor local
python -m http.server 8000
```

#### Estándares de Código

**JavaScript:**
- ES6+ moderno
- Comentarios JSDoc para funciones
- Nombres descriptivos
- Evitar dependencias externas innecesarias

**CSS:**
- Usar variables CSS existentes
- Mobile-first
- BEM naming opcional

**HTML:**
- Semántico
- Accesible (ARIA labels)
- Validado

#### Estructura de Commits

```
tipo(scope): descripción

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambio de código)
- `refactor`: Refactorización
- `perf`: Mejora de rendimiento
- `test`: Añadir tests
- `chore`: Mantenimiento

**Ejemplos:**
```bash
git commit -m "feat(filters): añadir filtro de vignette"
git commit -m "fix(upload): corregir validación de archivos grandes"
git commit -m "docs(readme): actualizar instrucciones de instalación"
```

#### Testing

Antes de hacer PR:
- [ ] Probar en Chrome, Firefox, Safari
- [ ] Probar en móvil (responsive)
- [ ] No hay errores en consola
- [ ] Lighthouse score > 90
- [ ] Código comentado y documentado

#### Pull Request

1. **Asegúrate que tu código:**
   - Sigue los estándares
   - No rompe funcionalidad existente
   - Está documentado
   - Es responsive

2. **Crea el PR:**
   - Título descriptivo
   - Descripción detallada
   - Screenshots si aplica
   - Referencias a issues relacionados

3. **Template de PR:**
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Mi código sigue los estándares
- [ ] He añadido comentarios
- [ ] He probado en múltiples navegadores
- [ ] Es responsive
- [ ] No hay warnings en consola

## Screenshots
[Si aplica]
```

## Roadmap de Características

### v1.1 (Próximo)
- [ ] Historial de deshacer mejorado
- [ ] Más filtros avanzados
- [ ] Crop y rotación
- [ ] Exportar en múltiples formatos

### v2.0 (Futuro)
- [ ] PWA (offline support)
- [ ] Procesamiento por lotes
- [ ] Presets guardados
- [ ] Integración con IA

## Preguntas?

Abre un issue con la etiqueta `question` o contacta en [tu-email@example.com]

## Código de Conducta

Sé respetuoso, inclusivo y constructivo. Este es un proyecto open source para aprender y colaborar.

---

¡Gracias por contribuir a AppRestaura! 🎨

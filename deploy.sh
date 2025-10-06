#!/bin/bash

# Script de Deploy para GitHub Pages
# AppRestaura v1.0

echo "🚀 Deploy de AppRestaura a GitHub Pages"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encuentra index.html"
    echo "   Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

echo "✅ Verificando archivos del proyecto..."
echo ""

# Lista de archivos requeridos
required_files=(
    "index.html"
    "css/styles.css"
    "css/responsive.css"
    "js/app.js"
    "js/ui.js"
    "js/image-processor.js"
    "js/filters.js"
    "js/utils.js"
    "README.md"
    "LICENSE"
)

# Verificar cada archivo
all_files_present=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (FALTA)"
        all_files_present=false
    fi
done

echo ""

if [ "$all_files_present" = false ]; then
    echo "❌ Faltan archivos requeridos. Abortando."
    exit 1
fi

echo "✅ Todos los archivos presentes"
echo ""

# Preguntar por el repositorio
echo "📝 Configuración del repositorio:"
read -p "Ingresa tu usuario de GitHub: " github_user
read -p "Ingresa el nombre del repositorio [AppRestaura]: " repo_name
repo_name=${repo_name:-AppRestaura}

echo ""
echo "📋 Resumen:"
echo "   Usuario: $github_user"
echo "   Repositorio: $repo_name"
echo "   URL: https://github.com/$github_user/$repo_name"
echo "   GitHub Pages: https://$github_user.github.io/$repo_name"
echo ""

read -p "¿Continuar? (s/n): " confirm
if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "Abortado."
    exit 0
fi

echo ""
echo "🔧 Inicializando repositorio Git..."

# Inicializar git si no existe
if [ ! -d ".git" ]; then
    git init
    echo "  ✓ Git inicializado"
else
    echo "  ✓ Git ya inicializado"
fi

# Agregar todos los archivos
echo ""
echo "📦 Agregando archivos..."
git add .
echo "  ✓ Archivos agregados"

# Commit
echo ""
echo "💾 Creando commit..."
git commit -m "Initial commit - AppRestaura v1.0.0"
echo "  ✓ Commit creado"

# Crear rama main
echo ""
echo "🌿 Configurando rama principal..."
git branch -M main
echo "  ✓ Rama main configurada"

# Agregar remote
echo ""
echo "🔗 Configurando remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_user/$repo_name.git"
echo "  ✓ Remote configurado"

# Push
echo ""
echo "⬆️  Subiendo a GitHub..."
echo "   (Se abrirá el navegador para autenticación si es necesario)"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Deploy completado exitosamente!"
    echo ""
    echo "📌 Próximos pasos:"
    echo ""
    echo "   1. Ve a: https://github.com/$github_user/$repo_name/settings/pages"
    echo "   2. En 'Source', selecciona: Branch: main"
    echo "   3. Haz clic en 'Save'"
    echo "   4. Espera 1-2 minutos"
    echo "   5. Tu app estará en: https://$github_user.github.io/$repo_name"
    echo ""
    echo "🎉 ¡Listo para compartir!"
else
    echo ""
    echo "❌ Error al hacer push"
    echo "   Verifica que el repositorio exista en GitHub"
    echo "   Crea el repositorio en: https://github.com/new"
fi

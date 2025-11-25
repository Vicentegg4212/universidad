#!/bin/bash

# Script para desplegar a GitHub Pages usando git push con SSH

echo "🚀 Preparando despliegue a GitHub Pages..."

# Volver a main
git checkout main

# Crear carpeta dist con los archivos estáticos
echo "📦 Creando carpeta de distribución..."
mkdir -p dist
cp -r js dist/
cp -r assets dist/
cp -r css dist/ 2>/dev/null || true
cp index.html dist/

# Ir a la rama gh-pages
git checkout gh-pages || git checkout -b gh-pages

# Copiar archivos a raíz (excepto .git)
cp -r dist/* .
rm -rf dist

# Hacer commit
git add .
git commit -m "🚀 Desplegar a GitHub Pages" || echo "Sin cambios nuevos"

# Push a gh-pages
echo "📤 Subiendo a GitHub Pages..."
git push -u origin gh-pages

echo "✅ Despliegue completado"
echo "📍 Tu sitio estará disponible en: https://vicentegg4212.github.io/universidad/"

# Volver a main
git checkout main

#!/bin/bash

# FlashWords - Script de Build Optimisé
# Usage: ./build.sh [platform]
# Platform: all, mac, win, linux (défaut: all)

set -e

PLATFORM=${1:-all}

echo "🚀 FlashWords - Build Optimisé pour $PLATFORM"
echo "============================================="

# Nettoyer le dossier dist
echo "🧹 Nettoyage du dossier dist..."
rm -rf dist/

# Vérifier que les dépendances sont installées
echo "📦 Vérification des dépendances..."
npm install

# Build selon la plateforme
case $PLATFORM in
  "mac")
    echo "🍎 Build pour macOS..."
    npx electron-builder --mac
    ;;
  "win")
    echo "🪟 Build pour Windows..."
    npx electron-builder --win
    ;;
  "linux")
    echo "🐧 Build pour Linux..."
    npx electron-builder --linux
    ;;
  "all")
    echo "🌍 Build pour toutes les plateformes..."
    npx electron-builder --win --mac --linux
    ;;
  *)
    echo "❌ Plateforme non reconnue: $PLATFORM"
    echo "Usage: $0 [all|mac|win|linux]"
    exit 1
    ;;
esac

echo "✅ Build terminé !"
echo "📁 Fichiers générés dans le dossier 'dist/'"

# Lister les fichiers générés
if [ -d "dist" ]; then
  echo ""
  echo "📋 Fichiers générés:"
  ls -la dist/

  echo ""
  echo "📊 Taille des builds:"
  du -sh dist/*
fi

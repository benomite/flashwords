#!/bin/bash
# Script de build pour FlashWords Electron

echo "🚀 Build de FlashWords Electron..."

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Build selon la plateforme
case "$1" in
    "win")
        echo "🪟 Build pour Windows..."
        npm run build:win
        ;;
    "mac")
        echo "🍎 Build pour macOS..."
        npm run build:mac
        ;;
    "linux")
        echo "🐧 Build pour Linux..."
        npm run build:linux
        ;;
    "all")
        echo "🌍 Build pour toutes les plateformes..."
        npm run build
        ;;
    *)
        echo "📱 Build pour la plateforme actuelle..."
        npm run build
        ;;
esac

echo "✅ Build terminé !"
echo "📁 Fichiers dans le dossier 'dist/'"

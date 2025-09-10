#!/bin/bash

# FlashWords - Script de préparation de release
# Crée un dossier release avec tous les builds

set -e

echo "🚀 FlashWords - Préparation de la Release V1.0"
echo "=============================================="

# Créer le dossier release
echo "📁 Création du dossier release..."
rm -rf release/
mkdir -p release/

# Build pour toutes les plateformes
echo "🔨 Build pour toutes les plateformes..."

# macOS
echo "🍎 Build macOS..."
npx electron-builder --mac

# Windows
echo "🪟 Build Windows..."
npx electron-builder --win

# Linux
echo "🐧 Build Linux..."
npx electron-builder --linux

# Copier les fichiers de distribution
echo "📦 Copie des fichiers de distribution..."
cp dist/*.dmg release/ 2>/dev/null || true
cp dist/*.exe release/ 2>/dev/null || true
cp dist/*.AppImage release/ 2>/dev/null || true
cp dist/*.deb release/ 2>/dev/null || true

# Créer un fichier de description
cat > release/README-RELEASE.md << EOF
# FlashWords V1.0.0 - Release

## 📦 Fichiers de Distribution

### macOS
- \`FlashWords-1.0.0-x64.dmg\` - Intel Macs
- \`FlashWords-1.0.0-arm64.dmg\` - Apple Silicon Macs

### Windows
- \`FlashWords Setup 1.0.0.exe\` - Installateur NSIS

### Linux
- \`FlashWords-1.0.0.AppImage\` - Application portable
- \`flashwords_1.0.0_amd64.deb\` - Package Debian/Ubuntu

## 🚀 Installation

### macOS
1. Téléchargez le DMG correspondant à votre Mac
2. Double-cliquez sur le fichier .dmg
3. Glissez FlashWords vers le dossier Applications
4. Lancez l'application

### Windows
1. Téléchargez le fichier .exe
2. Double-cliquez pour lancer l'installateur
3. Suivez les instructions d'installation
4. Lancez FlashWords depuis le menu Démarrer

### Linux
1. Téléchargez l'AppImage ou le DEB
2. Pour AppImage: \`chmod +x FlashWords-1.0.0.AppImage && ./FlashWords-1.0.0.AppImage\`
3. Pour DEB: \`sudo dpkg -i flashwords_1.0.0_amd64.deb\`

## ⚠️ Notes Importantes

- Les applications ne sont pas signées (développement local)
- Sur macOS, vous devrez peut-être autoriser l'application dans les Préférences Système
- Sur Windows, l'antivirus peut afficher un avertissement (normal pour les applications non signées)

## 🎯 Fonctionnalités

- Exercice de lecture rapide pour l'orthophonie
- Gestion des listes de mots via fichiers .txt
- Sélection de dossier personnalisé
- Exercice infini avec mots aléatoires
- Interface moderne et intuitive
- Multi-plateforme (Mac, Windows, Linux)

## 📞 Support

Pour toute question ou problème, créez une issue sur GitHub.
EOF

echo "✅ Release préparée dans le dossier 'release/'"
echo "📁 Fichiers générés:"
ls -la release/

echo ""
echo "🎯 Prochaines étapes:"
echo "1. Vérifiez les fichiers dans release/"
echo "2. Créez une release sur GitHub"
echo "3. Uploadez les fichiers .dmg, .exe, .AppImage, .deb"
echo "4. Publiez la release !"

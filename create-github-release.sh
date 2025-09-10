#!/bin/bash

# FlashWords - Script de création de release GitHub
# Crée une release V1.0.0 avec tous les fichiers de distribution

set -e

echo "🚀 FlashWords - Création de la Release GitHub V1.0.0"
echo "=================================================="

# Vérifier que gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) n'est pas installé."
    echo "📥 Installez-le depuis: https://cli.github.com/"
    exit 1
fi

# Vérifier la connexion GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Non connecté à GitHub."
    echo "🔐 Connectez-vous avec: gh auth login"
    exit 1
fi

# Vérifier que les fichiers de release existent
if [ ! -d "release" ]; then
    echo "❌ Dossier 'release' introuvable."
    echo "🔨 Lancez d'abord: ./prepare-release.sh"
    exit 1
fi

echo "📦 Fichiers de distribution trouvés:"
ls -la release/

echo ""
echo "🏷️  Création de la release GitHub..."

# Créer la release avec les fichiers
gh release create v1.0.0 \
  --title "FlashWords V1.0.0 - Application d'Exercice de Lecture Rapide" \
  --notes "## 🎯 FlashWords V1.0.0 - Application d'Exercice de Lecture Rapide pour l'Orthophonie

### ✨ Fonctionnalités
- **Exercice de lecture rapide** - Mots affichés séquentiellement
- **Gestion des listes** - Création et organisation de listes de mots
- **Sélection de dossier** - Accès à vos propres fichiers .txt
- **Exercice infini** - Continue jusqu'à arrêt manuel
- **Mots aléatoires** - Mélange automatique des mots
- **Pause configurable** - Temps entre les mots ajustable
- **Taille de police** - Ajustement de la lisibilité
- **Interface moderne** - Design épuré et intuitif

### 📦 Plateformes Supportées
- **macOS** : Intel + Apple Silicon (DMG)
- **Windows** : 32-bit + 64-bit + Universal (EXE)
- **Linux** : AppImage + DEB Package

### 🚀 Installation
1. Téléchargez le fichier correspondant à votre système
2. Suivez les instructions d'installation
3. Lancez l'application et commencez vos exercices !

### ⚠️ Notes
- Les applications ne sont pas signées (développement local)
- Sur macOS, autorisez l'application dans les Préférences Système
- Sur Windows, l'antivirus peut afficher un avertissement (normal)

### 📞 Support
- **GitHub** : [benomite/flashwords](https://github.com/benomite/flashwords)
- **Issues** : Signalez les bugs et demandez des fonctionnalités

Développé avec ❤️ pour l'orthophonie moderne." \
  --prerelease=false \
  --latest \
  release/*.dmg \
  release/*.exe \
  release/*.AppImage \
  release/*.deb

echo ""
echo "✅ Release V1.0.0 créée avec succès !"
echo "🌐 Consultez: https://github.com/benomite/flashwords/releases"
echo ""
echo "📋 Fichiers uploadés:"
echo "  🍎 macOS: DMG (Intel + Apple Silicon)"
echo "  🪟 Windows: EXE (32-bit + 64-bit + Universal)"
echo "  🐧 Linux: AppImage + DEB"
echo ""
echo "🎉 FlashWords V1.0.0 est maintenant disponible !"

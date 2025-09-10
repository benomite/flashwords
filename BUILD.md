# FlashWords - Guide de Build

## 🚀 Build Multi-Plateforme

FlashWords peut être compilé pour toutes les plateformes principales grâce à Electron Builder.

### 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm installé
- Pour Windows : Visual Studio Build Tools (pour les builds natifs)

### 🛠️ Scripts de Build Disponibles

```bash
# Build pour la plateforme actuelle
npm run build

# Build pour toutes les plateformes
npm run build:all

# Build spécifique par plateforme
npm run build:mac     # macOS (Intel + Apple Silicon)
npm run build:win     # Windows (x64 + x86)
npm run build:linux   # Linux (AppImage + DEB)

# Nettoyage du dossier dist
npm run clean
```

### 🎯 Script de Build Automatisé

Utilisez le script `build-all.sh` pour un build simplifié :

```bash
# Build pour toutes les plateformes
./build-all.sh

# Build pour une plateforme spécifique
./build-all.sh mac
./build-all.sh win
./build-all.sh linux
```

### 📁 Fichiers Générés

Les builds sont générés dans le dossier `dist/` :

#### macOS

- `FlashWords-1.0.0.dmg` - Intel Macs
- `FlashWords-1.0.0-arm64.dmg` - Apple Silicon Macs

#### Windows

- `FlashWords Setup 1.0.0.exe` - Installateur NSIS (x64 + x86)

#### Linux

- `FlashWords-1.0.0.AppImage` - Application portable
- `flashwords_1.0.0_amd64.deb` - Package Debian/Ubuntu

### 🔧 Configuration

La configuration du build est dans `package.json` :

```json
{
  "build": {
    "appId": "com.flashwords.app",
    "productName": "FlashWords",
    "mac": {
      "target": ["dmg"],
      "arch": ["x64", "arm64"]
    },
    "win": {
      "target": ["nsis"],
      "arch": ["x64", "ia32"]
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "arch": ["x64"]
    }
  }
}
```

### 📦 Distribution

Les fichiers générés peuvent être distribués directement :

1. **macOS** : Les utilisateurs peuvent installer via le DMG
2. **Windows** : Les utilisateurs peuvent installer via l'exécutable NSIS
3. **Linux** : Les utilisateurs peuvent exécuter l'AppImage ou installer le DEB

### ⚠️ Notes Importantes

- Les builds ne sont pas signés (pas de certificat de développeur)
- Sur macOS, les utilisateurs devront peut-être autoriser l'application dans les Préférences Système
- Les builds Windows peuvent déclencher des avertissements de sécurité (normal pour les applications non signées)

### 🐛 Dépannage

Si le build échoue :

1. Vérifiez que toutes les dépendances sont installées : `npm install`
2. Nettoyez le dossier dist : `npm run clean`
3. Vérifiez les logs d'erreur dans le terminal
4. Assurez-vous d'avoir les outils de build requis pour votre plateforme

# FlashWords - Application Electron

Application desktop standalone d'exercice de lecture rapide pour l'orthophonie, basée sur Electron.

## 🚀 **Avantages d'Electron**

- ✅ **Standalone** : Pas de serveur, pas d'installation complexe
- ✅ **Cross-platform** : Windows, macOS, Linux
- ✅ **Accès direct aux fichiers** : Gestion native du dossier `listes/`
- ✅ **Interface moderne** : HTML/CSS/JS dans une app desktop
- ✅ **Distribution simple** : Un seul fichier .exe/.app/.AppImage

## 📦 **Installation et Utilisation**

### Prérequis

- **Node.js** 16+ (pour le développement)
- **npm** (inclus avec Node.js)

### Démarrage Rapide

1. **Cloner le projet**
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Lancer l'application** :
   ```bash
   npm start
   # ou
   npm run dev  # avec DevTools
   ```

### Build et Distribution

```bash
# Build pour la plateforme actuelle
npm run build

# Build pour Windows
npm run build:win

# Build pour macOS
npm run build:mac

# Build pour Linux
npm run build:linux

# Ou utiliser le script
./build.sh
```

## 🏗️ **Architecture Electron**

### Structure des Fichiers

```
flashwords/
├── main.js              # Processus principal Electron
├── preload.js           # Script de préchargement sécurisé
├── index.html           # Interface utilisateur
├── styles.css           # Styles de l'application
├── script.js            # Logique de l'application
├── package.json         # Configuration npm/Electron
├── build.sh             # Script de build
├── listes/              # Base de données des listes
│   ├── liste_par_defaut.txt
│   ├── vocabulaire_medical.txt
│   └── animaux_ferme.txt
└── dist/                # Fichiers de distribution
```

### Communication IPC

- **Main Process** (`main.js`) : Gestion des fenêtres et accès aux fichiers
- **Renderer Process** (`script.js`) : Interface utilisateur
- **Preload Script** (`preload.js`) : API sécurisée entre main et renderer

### Gestion des Fichiers

L'application utilise l'API Node.js pour :

- **Lecture** : `fs.readFile()` pour charger les listes
- **Écriture** : `fs.writeFile()` pour sauvegarder
- **Suppression** : `fs.unlink()` pour supprimer
- **Dossiers** : `fs.mkdir()` et `fs.readdir()` pour la gestion

## 🎯 **Fonctionnalités**

### Exercice de Lecture Rapide

- **Affichage séquentiel** des mots
- **Vitesse configurable** (millisecondes)
- **Temps entre mots** ajustable
- **Mélange des mots** optionnel
- **Interface épurée** sans distraction

### Gestion des Listes

- **Création** de nouvelles listes
- **Édition** des mots et groupes
- **Suppression** des listes
- **Import** de fichiers .txt
- **Sauvegarde automatique** dans le dossier `listes/`

### Contrôles

- **Clavier** : Espace (start/stop), P (pause), Échap (quitter)
- **Souris** : Boutons d'interface
- **Dialogue de fichiers** : Import natif

## 🔧 **Configuration**

### Personnalisation de l'App

Modifiez `package.json` pour :

- **Nom** : `"productName": "FlashWords"`
- **Version** : `"version": "1.0.0"`
- **Icône** : Ajoutez `"icon": "assets/icon.png"`

### Configuration Electron

Modifiez `main.js` pour :

- **Taille de fenêtre** : `width: 1200, height: 800`
- **Propriétés** : `minWidth`, `minHeight`, etc.
- **DevTools** : `mainWindow.webContents.openDevTools()`

### Build Configuration

Modifiez `package.json` > `"build"` pour :

- **App ID** : `"appId": "com.flashwords.app"`
- **Plateformes** : `"mac"`, `"win"`, `"linux"`
- **Fichiers inclus** : `"files": ["**/*", "!node_modules"]`

## 🚀 **Distribution**

### Fichiers Générés

Après le build, vous trouverez dans `dist/` :

- **Windows** : `FlashWords Setup.exe`
- **macOS** : `FlashWords.dmg`
- **Linux** : `FlashWords.AppImage`

### Installation

- **Windows** : Exécuter le .exe
- **macOS** : Monter le .dmg et glisser dans Applications
- **Linux** : `chmod +x FlashWords.AppImage && ./FlashWords.AppImage`

## 🐛 **Dépannage**

### Problèmes Courants

**L'app ne se lance pas**

- Vérifiez que Node.js est installé
- Exécutez `npm install`
- Vérifiez les logs dans la console

**Erreurs de fichiers**

- Vérifiez les permissions du dossier `listes/`
- L'app crée automatiquement le dossier si nécessaire

**Build échoue**

- Vérifiez que `electron-builder` est installé
- Exécutez `npm install electron-builder --save-dev`

### Debug

```bash
# Mode développement avec DevTools
npm run dev

# Logs détaillés
DEBUG=* npm start
```

## 📋 **Scripts Disponibles**

```bash
npm start          # Lancer l'app
npm run dev        # Mode développement
npm run build      # Build pour la plateforme actuelle
npm run build:win  # Build Windows
npm run build:mac  # Build macOS
npm run build:linux # Build Linux
npm run dist       # Build complet
```

## 🔒 **Sécurité**

- **Context Isolation** : Activé par défaut
- **Node Integration** : Désactivé dans le renderer
- **Preload Script** : API sécurisée uniquement
- **Sandbox** : Protection des processus

## 🌟 **Avantages vs Web App**

| Fonctionnalité     | Web App     | Electron          |
| ------------------ | ----------- | ----------------- |
| **Serveur requis** | ❌ Oui      | ✅ Non            |
| **Installation**   | ❌ Complexe | ✅ Simple         |
| **Accès fichiers** | ❌ Limité   | ✅ Complet        |
| **Performance**    | ⚠️ Variable | ✅ Native         |
| **Distribution**   | ❌ Serveur  | ✅ Fichier unique |
| **Offline**        | ❌ Non      | ✅ Oui            |

---

**FlashWords Electron** - Application desktop moderne pour l'orthophonie 🚀💻

# FlashWords - Exercice de Lecture Rapide pour l'Orthophonie

## 🎯 Description

FlashWords est une application Electron standalone pour l'exercice de lecture rapide en orthophonie. L'application permet d'afficher des listes de mots de manière séquentielle avec un timing configurable.

## ✨ Fonctionnalités

- **Affichage séquentiel** des mots avec timing configurable
- **Gestion des listes de mots** via fichiers .txt
- **Sélection de dossier** personnalisé pour les listes
- **Exercice infini** avec mots aléatoires
- **Pause entre les mots** configurable
- **Taille de police** ajustable
- **Interface moderne** et intuitive
- **Multi-plateforme** (Mac, Windows, Linux)

## 🚀 Installation et Utilisation

### Développement

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm start
```

### Build de Production

```bash
# Build pour toutes les plateformes
./build.sh

# Build pour une plateforme spécifique
./build.sh mac
./build.sh win
./build.sh linux
```

## 📁 Structure des Listes de Mots

Les listes de mots sont stockées dans des fichiers `.txt` dans le dossier `listes/` :

```
listes/
├── vocabulaire_medical.txt
├── animaux_ferme.txt
└── votre_liste.txt
```

**Format des fichiers :**

- Un mot par ligne
- Utilisez `-----` pour séparer les groupes de mots
- L'application ignore automatiquement les lignes vides

## ⚙️ Configuration

### Paramètres d'Exercice

- **Vitesse d'affichage** : Temps d'affichage de chaque mot (ms)
- **Temps entre les mots** : Pause sans affichage entre les mots (ms)
- **Taille de police** : Ajustable avec slider et presets
- **Exercice infini** : Continue jusqu'à l'arrêt manuel
- **Mots aléatoires** : Mélange l'ordre des mots

### Gestion des Dossiers

- **Sélection de dossier** : Choisissez n'importe quel dossier sur votre ordinateur
- **Persistance** : Le dernier dossier sélectionné est sauvegardé
- **Synchronisation** : Les listes sont automatiquement rechargées

## 🎮 Contrôles

### Raccourcis Clavier

- **Espace** : Démarrer/Arrêter l'exercice
- **P** : Pause/Reprendre
- **S** : Arrêter l'exercice
- **Échap** : Retour à la configuration

### Interface

- **Bouton Démarrer** : Lance l'exercice (désactivé si aucune liste sélectionnée)
- **Bouton Pause** : Met en pause/reprend l'exercice
- **Bouton Arrêter** : Termine l'exercice
- **Gestion des listes** : Accès à la sélection de dossier et gestion des listes

## 🔧 Build et Distribution

### Configuration Electron Builder

L'application utilise Electron Builder avec les optimisations suivantes :

- **Compression maximale** pour réduire la taille
- **ASAR packaging** pour la sécurité
- **Exclusion des fichiers inutiles**
- **Support multi-architecture** (x64, arm64)

### Formats de Distribution

- **macOS** : DMG (Intel + Apple Silicon)
- **Windows** : NSIS Installer (x64 + x86)
- **Linux** : AppImage + DEB (x64)

## 📊 Taille de l'Application

- **Taille finale** : ~60-80Mo
- **Raison** : Electron inclut Chromium complet pour l'accès aux fichiers locaux
- **Avantage** : Application standalone avec accès complet au système de fichiers

## 🎯 Cas d'Usage

FlashWords est conçu spécifiquement pour :

- **Orthophonistes** : Exercices de lecture rapide avec leurs propres listes
- **Éducateurs** : Outil pédagogique pour l'apprentissage de la lecture
- **Particuliers** : Entraînement personnel à la lecture rapide

## 🛠️ Technologies

- **Electron** : Framework desktop multi-plateforme
- **HTML/CSS/JavaScript** : Interface utilisateur
- **Node.js** : Accès au système de fichiers
- **Electron Builder** : Build et distribution

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Ajouter de nouvelles fonctionnalités

## 📞 Support

Pour toute question ou problème, créez une issue sur le repository GitHub.

# Structure du Projet FlashWords

## 📁 Organisation des dossiers

```
flashwords/
├── lib/                    # Code source de l'application
│   ├── main.js            # Point d'entrée Electron (processus principal)
│   ├── preload.js         # Script de préchargement sécurisé
│   ├── script.js          # Logique métier de l'application
│   ├── index.html         # Interface utilisateur
│   └── styles.css         # Styles CSS
├── tests/                  # Fichiers de test et debug
│   ├── test-app.js        # Tests de l'application
│   ├── test-cross-platform.js  # Tests de compatibilité
│   └── debug-dropdown.html     # Page de debug
├── bin/                    # Scripts et binaires
│   └── server.py          # Serveur de développement (optionnel)
├── config/                 # Fichiers de configuration
│   └── paths.js           # Configuration des chemins
├── listes/                 # Données de l'application
│   ├── animaux_ferme.txt
│   └── vocabulaire_medical.txt
├── assets/                 # Ressources (icônes, images)
├── dist/                   # Builds de distribution
└── node_modules/           # Dépendances npm
```

## 🚀 Scripts disponibles

### Développement
```bash
npm start          # Lancer l'application
npm run dev        # Lancer en mode développement (avec DevTools)
```

### Tests
```bash
npm test                    # Tests de base
npm run test:cross-platform # Tests de compatibilité
npm run test:all           # Tous les tests
```

### Build
```bash
npm run build:win    # Build pour Windows
npm run build:mac    # Build pour Mac
npm run build:linux  # Build pour Linux
npm run build:all    # Build pour toutes les plateformes
```

## 🔧 Configuration

### Chemins
Les chemins sont centralisés dans `config/paths.js` pour faciliter la maintenance.

### Electron
- **Point d'entrée** : `lib/main.js`
- **Préchargement** : `lib/preload.js`
- **Interface** : `lib/index.html`

### Données
- **Listes de mots** : `listes/` (fichiers .txt)
- **Cache** : Géré automatiquement en mémoire

## 📝 Notes de développement

### Ajout de nouvelles fonctionnalités
1. Code principal dans `lib/script.js`
2. Interface dans `lib/index.html` et `lib/styles.css`
3. Tests dans `tests/`

### Debug
- Utiliser `tests/debug-dropdown.html` pour tester l'interface
- Logs détaillés dans la console (F12)

### Cross-platform
- Utiliser `path.join()` pour les chemins
- Tester avec `npm run test:cross-platform`

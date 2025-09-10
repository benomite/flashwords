# FlashWords - Application d'Exercice de Lecture Rapide

Une application web moderne pour l'exercice de lecture rapide en orthophonie, recréée à partir de l'application Java originale `mot_flash.jar`.

## 🎯 Fonctionnalités

### Exercice de Lecture Rapide

- **Affichage séquentiel** : Les mots apparaissent un par un à l'écran
- **Vitesse configurable** : Contrôle de la durée d'affichage de chaque mot (en millisecondes)
- **Temps entre mots** : Délai configurable entre l'affichage des mots
- **Mélange des mots** : Option pour randomiser l'ordre des mots
- **Interface épurée** : Design minimaliste pour éviter toute distraction
- **Contrôles clavier** :
  - `Espace` : Démarrer/Arrêter l'exercice
  - `P` : Mettre en pause/Reprendre
  - `Échap` : Arrêter et revenir à la configuration

### Gestion des Listes de Mots

- **Listes prédéfinies** : Vocabulaire médical, animaux de ferme, etc.
- **Création de listes** : Interface pour ajouter de nouvelles listes
- **Édition des listes** : Modification des mots et groupes existants
- **Suppression** : Suppression des listes personnalisées
- **Import/Export** : Chargement de fichiers .txt externes

### Configuration Avancée

- **Sélection de liste** : Choix de la liste de mots à utiliser
- **Paramètres de vitesse** : Réglage fin de la vitesse d'affichage
- **Aperçu des mots** : Visualisation de la liste sélectionnée
- **Groupes de mots** : Organisation en catégories avec séparateurs `-----`

## 🚀 Installation et Utilisation

### Prérequis

- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Python 3.x (pour le serveur de développement)

### Démarrage Rapide

1. **Cloner ou télécharger** le projet
2. **Démarrer le serveur** :
   ```bash
   ./start.sh
   # ou
   python3 server.py
   ```
3. **Ouvrir l'application** : http://localhost:8080
4. **Commencer l'exercice** : Sélectionner une liste et cliquer sur "Démarrer l'exercice"

### Structure des Fichiers

```
flashwords/
├── index.html          # Interface principale
├── styles.css          # Styles de l'application
├── script.js           # Logique de l'application
├── server.py           # Serveur de développement
├── start.sh            # Script de démarrage
├── listes/             # Base de données des listes de mots
│   ├── liste_par_defaut.txt
│   ├── vocabulaire_medical.txt
│   └── animaux_ferme.txt
└── README.md           # Ce fichier
```

## 📁 Base de Données des Listes de Mots

### Gestion Automatique

Le dossier `listes/` fonctionne comme une **base de données** :

- **Lecture automatique** : L'application charge les listes au démarrage
- **Sauvegarde directe** : Les modifications sont immédiatement persistées
- **Synchronisation bidirectionnelle** : Les changements sont répercutés instantanément
- **Gestion transparente** : L'utilisateur n'a pas besoin de gérer les fichiers

### Format des Fichiers .txt

Les listes sont stockées dans le dossier `listes/` au format texte simple :

```
mot1
mot2
mot3
-----
groupe2_mot1
groupe2_mot2
-----
groupe3_mot1
```

- **Un mot par ligne**
- **Séparateur de groupe** : `-----` (5 tirets)
- **Encodage** : UTF-8

### Création et Modification

1. **Via l'interface** : Bouton "Nouvelle liste" dans la gestion
2. **Import de fichier** : Chargement d'un fichier .txt existant
3. **Sauvegarde automatique** : Les listes sont immédiatement sauvegardées dans le dossier `listes/`
4. **Téléchargement** : Les fichiers sont automatiquement téléchargés pour sauvegarde

## 🎮 Utilisation de l'Application

### Configuration de l'Exercice

1. **Sélectionner une liste** dans le dropdown
2. **Ajuster la vitesse** : Durée d'affichage de chaque mot (ms)
3. **Configurer le délai** : Temps entre les mots (ms)
4. **Activer le mélange** : Randomiser l'ordre des mots
5. **Aperçu** : Vérifier la liste sélectionnée

### Pendant l'Exercice

- **Interface épurée** : Seul le mot actuel est affiché
- **Compteur de progression** : Position actuelle / total
- **Contrôles** : Boutons pause/stop ou raccourcis clavier
- **Statistiques** : Temps écoulé et vitesse moyenne

### Gestion des Listes

- **Visualisation** : Grille des listes disponibles
- **Création** : Formulaire pour nouvelles listes
- **Édition** : Modification des mots et groupes
- **Suppression** : Suppression des listes personnalisées
- **Import** : Chargement de fichiers externes

## 🔧 Personnalisation

### Modification des Listes

Éditez directement les fichiers .txt dans le dossier `listes/` :

```bash
# Exemple : modifier la liste par défaut
nano listes/liste_par_defaut.txt
```

### Ajout de Nouvelles Listes

1. **Créer un fichier .txt** dans le dossier `listes/`
2. **Suivre le format** : un mot par ligne, groupes séparés par `-----`
3. **Recharger l'application** : Les nouvelles listes apparaîtront automatiquement

### Configuration du Serveur

Modifiez `server.py` pour changer :

- **Port** : `PORT = 8080`
- **Hôte** : `HOST = "localhost"`
- **Dossier** : `directory=os.getcwd()`

## 🐛 Dépannage

### Problèmes Courants

**L'application ne charge pas les listes**

- Vérifiez que le serveur Python est démarré
- Vérifiez que le dossier `listes/` existe
- Consultez la console du navigateur pour les erreurs

**Les modifications ne sont pas sauvegardées**

- Vérifiez les permissions du dossier `listes/`
- L'application téléchargera les fichiers en cas d'échec
- Vérifiez que le serveur est accessible

**Erreurs CORS**

- Utilisez le serveur Python fourni
- Ne pas ouvrir directement `index.html` dans le navigateur

### Logs et Debug

- **Console navigateur** : F12 → Console
- **Logs serveur** : Terminal où le serveur est lancé
- **Fichiers de log** : Vérifiez les permissions du dossier

## 📋 Fonctionnalités Techniques

### Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design responsive et animations
- **JavaScript ES6+** : Logique de l'application
- **Python HTTP Server** : Serveur de développement
- **Fetch API** : Communication avec le serveur

### Architecture

- **Frontend** : Application web pure (HTML/CSS/JS)
- **Backend** : Serveur Python simple pour servir les fichiers
- **Base de données** : Fichiers .txt dans le dossier `listes/`
- **Synchronisation** : Fetch API + téléchargement automatique

### Compatibilité

- **Navigateurs** : Tous les navigateurs modernes
- **Serveur** : Python 3.x requis
- **Système** : Multiplateforme (Windows, macOS, Linux)

## 🤝 Contribution

### Ajout de Fonctionnalités

1. **Fork** le projet
2. **Créer une branche** : `git checkout -b nouvelle-fonctionnalite`
3. **Développer** et tester
4. **Commit** : `git commit -m "Ajout de la fonctionnalité X"`
5. **Push** : `git push origin nouvelle-fonctionnalite`
6. **Pull Request** : Créer une PR sur GitHub

### Signaler des Bugs

Utilisez les **Issues GitHub** avec :

- Description détaillée du problème
- Étapes pour reproduire
- Navigateur et version
- Logs de la console

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Application originale** : `mot_flash.jar` pour l'inspiration
- **Communauté orthophonique** : Pour les retours et suggestions
- **Développeurs web** : Pour les technologies utilisées

---

**FlashWords** - Exercice de lecture rapide moderne pour l'orthophonie 🚀📚

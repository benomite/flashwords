# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-19

### Ajouté

- Application Electron standalone pour exercices de lecture rapide
- Interface moderne et professionnelle optimisée pour l'orthophonie
- Exercice de lecture rapide infini avec contrôle total (pause/reprise/arrêt)
- Gestion complète des listes de mots personnalisées
- Paramètres configurables :
  - Vitesse d'affichage (200ms - 2000ms)
  - Temps de pause entre les mots
  - Taille de police ajustable (24px - 120px)
  - Mélange des mots optionnel
- Persistance des données en fichiers .txt dans un dossier choisi
- Support multi-plateforme (Windows, macOS, Linux)
- Interface de gestion des listes avec vue tableau triée alphabétiquement
- Bouton de démarrage intelligent (désactivé si aucune liste sélectionnée)
- Message de pause discret (icône uniquement)
- Styles CSS modernes avec animations fluides

### Technique

- Architecture Electron avec processus principal et renderer
- Communication IPC sécurisée entre les processus
- Gestion des fichiers via l'API Node.js
- Interface responsive et accessible
- Code modulaire et bien documenté

### Documentation

- README complet avec instructions d'installation
- Documentation Electron dédiée
- Exemples de listes de mots inclus
- Scripts de build et de démarrage

---

**Note** : Cette version initiale est une réécriture complète de l'application Java originale `mot_flash.jar` en utilisant des technologies web modernes.

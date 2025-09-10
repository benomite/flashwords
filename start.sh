#!/bin/bash
# Script de démarrage pour FlashWords

echo "🚀 Démarrage de FlashWords..."
echo "📁 Dossier de travail: $(pwd)"

# Vérifier que Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur http://localhost:8080"
python3 server.py

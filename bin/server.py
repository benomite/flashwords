#!/usr/bin/env python3
"""
Serveur simple pour servir l'application FlashWords
Permet l'accès aux fichiers .txt du dossier listes/
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
HOST = "localhost"

class FlashWordsHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        # Ajouter les headers CORS pour permettre l'accès aux fichiers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # Gérer les requêtes OPTIONS pour CORS
        self.send_response(200)
        self.end_headers()

def main():
    # Vérifier que le dossier listes/ existe
    listes_dir = Path("listes")
    if not listes_dir.exists():
        print("📁 Création du dossier listes/...")
        listes_dir.mkdir()

        # Créer les fichiers par défaut
        default_files = {
            "liste_par_defaut.txt": "chat\nchien\noiseau\npoisson\n-----\nmaison\nvoiture\narbre\nfleur\n-----\nmanger\nboire\ndormir\njouer",
            "vocabulaire_medical.txt": "stéthoscope\nthermomètre\ntensiomètre\n-----\nsymptôme\ndiagnostic\ntraitement\n-----\nmédecin\ninfirmière\npatient",
            "animaux_ferme.txt": "vache\ncochon\nmouton\n-----\npoule\ncanard\noie\n-----\ncheval\nâne\nchèvre"
        }

        for filename, content in default_files.items():
            file_path = listes_dir / filename
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Créé: {filename}")

    print(f"🚀 Serveur FlashWords démarré sur http://{HOST}:{PORT}")
    print(f"📁 Dossier listes/: {listes_dir.absolute()}")
    print("💡 Ouvrez http://localhost:8080 dans votre navigateur")
    print("⏹️  Appuyez sur Ctrl+C pour arrêter")

    try:
        with socketserver.TCPServer((HOST, PORT), FlashWordsHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Erreur: Le port {PORT} est déjà utilisé")
            print("💡 Essayez de tuer le processus ou changez le port")
        else:
            print(f"❌ Erreur: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()


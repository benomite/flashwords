// FlashWords - Application d'Exercice de Lecture Rapide pour l'Orthophonie

// Gestionnaire de base de données de fichiers pour le dossier listes/
class DatabaseManager {
  constructor() {
    this.listesDir = "listes"; // Dossier par défaut (sera résolu côté main)
    this.cache = new Map(); // Cache des listes
  }

  // Définir le dossier des listes
  setDirectory(path) {
    this.listesDir = path;
    this.cache.clear(); // Vider le cache quand on change de dossier
  }

  // Obtenir le dossier actuel
  getDirectory() {
    return this.listesDir;
  }

  // Charger toutes les listes depuis le dossier listes/
  async loadAllLists() {
    try {
      // Vérifier que l'API Electron est disponible
      if (!window.electronAPI) {
        console.warn(
          "⚠️ API Electron non disponible, utilisation des listes par défaut"
        );
        return this.getDefaultLists();
      }

      // S'assurer que le dossier listes/ existe
      await window.electronAPI.ensureDir(this.listesDir);

      // Lire le contenu du dossier
      const result = await window.electronAPI.readDir(this.listesDir);
      if (!result.success) {
        throw new Error(result.error);
      }

      const lists = [];
      const txtFiles = result.files.filter(
        (file) => file.isFile && file.name.endsWith(".txt")
      );

      // Charger chaque fichier .txt
      for (const file of txtFiles) {
        try {
          const list = await this.loadList(file.name);
          if (list) {
            lists.push(list);
            this.cache.set(list.id, list);
          }
        } catch (error) {
          console.warn(`⚠️ Impossible de charger ${file.name}:`, error);
        }
      }

      return lists;
    } catch (error) {
      console.error("Erreur lors du chargement des listes:", error);
      return this.getDefaultLists();
    }
  }

  // Obtenir les listes par défaut (fallback)
  getDefaultLists() {
    return [];
  }

  // Charger une liste spécifique
  async loadList(filename) {
    try {
      const filePath = await window.electronAPI.path.join(
        this.listesDir,
        filename
      );
      const result = await window.electronAPI.readFile(filePath);

      if (!result.success) {
        throw new Error(result.error);
      }

      return this.parseFileContent(result.data, filename);
    } catch (error) {
      console.error(`Erreur lors du chargement de ${filename}:`, error);
      // Retourner null au lieu de throw pour éviter de casser le chargement des autres listes
      return null;
    }
  }

  // Sauvegarder une liste
  async saveList(list) {
    try {
      const content = this.listToFileContent(list);
      const filePath = await window.electronAPI.path.join(
        this.listesDir,
        list.filename
      );

      const result = await window.electronAPI.writeFile(filePath, content);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Mettre à jour le cache
      this.cache.set(list.id, list);

      console.log(`✅ Liste sauvegardée: ${list.filename}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${list.filename}:`, error);
      throw error;
    }
  }

  // Supprimer une liste
  async deleteList(filename) {
    try {
      const filePath = await window.electronAPI.path.join(
        this.listesDir,
        filename
      );
      const result = await window.electronAPI.deleteFile(filePath);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(`✅ Fichier supprimé: ${filename}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${filename}:`, error);
      throw error;
    }
  }

  // Parser le contenu d'un fichier en liste de mots
  parseFileContent(text, filename) {
    const words = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Créer les groupes basés sur les séparateurs -----
    const groups = [];
    let currentGroup = [];
    words.forEach((word) => {
      if (word === "-----") {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(word);
      }
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return {
      id: filename.replace(".txt", ""),
      name: filename
        .replace(".txt", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      words: words,
      groups: groups,
      filename: filename,
      createdAt: new Date().toISOString(),
    };
  }

  // Convertir une liste en contenu de fichier
  listToFileContent(list) {
    return list.words.join("\n");
  }
}

class FlashWordsApp {
  constructor() {
    this.wordLists = [];
    this.currentList = null;
    this.currentWords = [];
    this.currentWordIndex = 0;
    this.isExerciseRunning = false;
    this.isPaused = false;
    this.timeoutIds = []; // Pour stocker les IDs des timeouts
    this.speed = 1000; // ms - durée d'affichage d'un mot
    this.delay = 200; // ms - temps entre les mots
    this.shuffleWords = true;
    this.fontSize = 48; // Taille de police par défaut
    this.editingListId = null;
    this.database = new DatabaseManager();
    this.wordsDisplayed = 0; // Compteur de mots affichés pour l'exercice infini

    this.initializeApp();
  }

  // Initialisation de l'application
  async initializeApp() {
    this.bindEvents();
    this.updateUI();

    // Charger le dossier sauvegardé ou utiliser le dossier par défaut
    const hasSavedFolder = await this.loadSavedFolder();
    if (!hasSavedFolder) {
      // Afficher le dossier par défaut
      this.updateFolderDisplay(this.database.getDirectory());
    }

    await this.loadWordLists(hasSavedFolder);

    // Aller directement à la configuration
    this.showExerciseConfig();
    
    // Réattacher les événements après le chargement des listes
    this.bindListEvents();
  }

  // Gestion des événements
  bindEvents() {
    // Boutons principaux
    document
      .getElementById("startExerciseBtn")
      .addEventListener("click", () => this.startExercise());
    document
      .getElementById("pauseBtn")
      .addEventListener("click", () => this.togglePause());
    document
      .getElementById("stopBtn")
      .addEventListener("click", () => this.stopExercise());
    document
      .getElementById("manageListsBtn")
      .addEventListener("click", () => this.showListsManagement());
    document
      .getElementById("addNewListBtn")
      .addEventListener("click", () => this.showAddListModal());
    document
      .getElementById("addFirstListBtn")
      .addEventListener("click", () => this.showAddListModal());
    document
      .getElementById("selectFolderBtn")
      .addEventListener("click", () => this.selectFolder());
    document
      .getElementById("fileInput")
      .addEventListener("change", (e) => this.handleFileImport(e));
    document
      .getElementById("configSpeedSlider")
      .addEventListener("input", (e) => this.updateConfigSpeed(e.target.value));
    document
      .getElementById("configDelaySlider")
      .addEventListener("input", (e) => this.updateConfigDelay(e.target.value));
    document
      .getElementById("configShuffleWords")
      .addEventListener("change", (e) =>
        this.updateShuffleSetting(e.target.checked)
      );

    // Presets de vitesse
    document.querySelectorAll("[data-speed]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const speed = parseInt(e.target.dataset.speed);
        this.setConfigSpeed(speed);
      });
    });

    // Contrôles de taille de police
    document
      .getElementById("configFontSizeSlider")
      .addEventListener("input", (e) =>
        this.setConfigFontSize(parseInt(e.target.value))
      );

    // Presets de taille de police
    document.querySelectorAll("[data-font-size]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const fontSize = parseInt(e.target.dataset.fontSize);
        this.setConfigFontSize(fontSize);
      });
    });

    // Presets de délai
    document.querySelectorAll("[data-delay]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const delay = parseInt(e.target.dataset.delay);
        this.setConfigDelay(delay);
      });
    });

    // Gestion des listes
    document
      .getElementById("backToWelcomeBtn")
      .addEventListener("click", () => this.showExerciseConfig());

    // Modal
    document
      .getElementById("closeModalBtn")
      .addEventListener("click", () => this.hideModal());
    document
      .getElementById("cancelBtn")
      .addEventListener("click", () => this.hideModal());
    document
      .getElementById("saveListBtn")
      .addEventListener("click", () => this.saveList());

    // Settings Modal
    document
      .getElementById("closeSettingsBtn")
      .addEventListener("click", () => this.hideSettingsModal());
    document
      .getElementById("cancelSettingsBtn")
      .addEventListener("click", () => this.hideSettingsModal());
    document
      .getElementById("applySettingsBtn")
      .addEventListener("click", () => this.applySettings());

    // Fermer les modals en cliquant à l'extérieur
    document.getElementById("listModal").addEventListener("click", (e) => {
      if (e.target.id === "listModal") this.hideModal();
    });
    document.getElementById("settingsModal").addEventListener("click", (e) => {
      if (e.target.id === "settingsModal") this.hideSettingsModal();
    });

    // Raccourcis clavier
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  // Gestion des événements spécifiques aux listes
  bindListEvents() {
    // Événement pour le sélecteur de liste principal
    const configSelect = document.getElementById("configWordListSelect");
    if (configSelect) {
      // Supprimer tous les anciens événements
      configSelect.removeEventListener("change", this.handleListChange);
      
      // Créer une nouvelle fonction de gestion
      this.handleListChange = (e) => {
        console.log("🔄 Liste sélectionnée:", e.target.value);
        console.log("🔄 Événement déclenché sur:", e.target.id);
        
        // Vérifier que la valeur a vraiment changé
        if (e.target.value && e.target.value !== this.currentList?.id) {
          this.selectWordList(e.target.value);
          this.updateListPreview(e.target.value);
        } else {
          console.log("⚠️ Même liste sélectionnée ou valeur vide");
        }
      };
      
      configSelect.addEventListener("change", this.handleListChange);
      console.log("✅ Événement attaché au dropdown");
    } else {
      console.log("❌ Élément configWordListSelect non trouvé");
    }
  }

  // Charger les listes de mots depuis la base de données
  async loadWordLists(autoSelectFirst = true) {
    try {
      this.wordLists = await this.database.loadAllLists();
      console.log(`📚 Total des listes chargées: ${this.wordLists.length}`);
      this.updateWordListSelects();

      // Sélectionner automatiquement la première liste seulement si demandé
      if (autoSelectFirst && this.wordLists.length > 0) {
        this.selectWordList(this.wordLists[0].id);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des listes:", error);
      // Aucune liste disponible en cas d'erreur
      this.wordLists = [];
      this.updateWordListSelects();
    }
  }

  // Charger les listes sauvegardées depuis localStorage
  loadSavedLists() {
    try {
      const saved = localStorage.getItem("flashwords_saved_lists");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Erreur lors du chargement des listes sauvegardées:", error);
      return [];
    }
  }

  // Sauvegarder les listes personnalisées dans localStorage
  saveCustomLists() {
    try {
      const customLists = this.wordLists;
      localStorage.setItem(
        "flashwords_saved_lists",
        JSON.stringify(customLists)
      );
    } catch (error) {
      console.warn("Erreur lors de la sauvegarde des listes:", error);
    }
  }

  // Charger une liste depuis un fichier .txt
  async loadListFromFile(filename) {
    try {
      // Essayer d'abord avec l'API File System Access
      if ("showOpenFilePicker" in window) {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            types: [
              {
                description: "Fichiers texte",
                accept: { "text/plain": [".txt"] },
              },
            ],
            suggestedName: filename,
            mode: "read",
          });

          const file = await fileHandle.getFile();
          const text = await file.text();

          return this.parseListFromText(text, filename);
        } catch (error) {
          console.warn(
            `Impossible d'ouvrir ${filename} avec File System Access:`,
            error
          );
        }
      }

      // Fallback: essayer de charger depuis le serveur local
      try {
        const response = await fetch(`listes/${filename}`);
        if (!response.ok) {
          throw new Error(`Fichier ${filename} non trouvé`);
        }
        const text = await response.text();
        return this.parseListFromText(text, filename);
      } catch (error) {
        console.warn(
          `Impossible de charger ${filename} depuis le serveur:`,
          error
        );
        throw error;
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de ${filename}:`, error);
      throw error;
    }
  }

  // Parser le texte d'une liste
  parseListFromText(text, filename) {
    const words = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Créer les groupes basés sur les séparateurs -----
    const groups = [];
    let currentGroup = [];
    words.forEach((word) => {
      if (word === "-----") {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(word);
      }
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return {
      id: filename.replace(".txt", ""),
      name: filename
        .replace(".txt", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      words: words,
      groups: groups,
      filename: filename,
      createdAt: new Date().toISOString(),
    };
  }

  // Créer un fichier s'il n'existe pas
  async createFileIfNotExists(filename, list) {
    try {
      if ("showSaveFilePicker" in window) {
        const fileHandle = await window.showSaveFilePicker({
          types: [
            {
              description: "Fichiers texte",
              accept: { "text/plain": [".txt"] },
            },
          ],
          suggestedName: filename,
        });

        const content = list.words.join("\n");
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        console.log(`✅ Fichier créé: ${filename}`);
        return true;
      }
    } catch (error) {
      console.warn(`Impossible de créer le fichier ${filename}:`, error);
    }
    return false;
  }

  // Sauvegarder une liste dans un fichier .txt
  async saveListToFile(list) {
    try {
      // Essayer d'abord avec l'API File System Access
      if ("showSaveFilePicker" in window) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            types: [
              {
                description: "Fichiers texte",
                accept: { "text/plain": [".txt"] },
              },
            ],
            suggestedName: list.filename,
          });

          const content = list.words.join("\n");
          const writable = await fileHandle.createWritable();
          await writable.write(content);
          await writable.close();

          console.log(`✅ Fichier sauvegardé: ${list.filename}`);
          return true;
        } catch (error) {
          console.warn(
            `Impossible de sauvegarder avec File System Access:`,
            error
          );
        }
      }

      // Fallback: téléchargement classique
      const content = list.words.join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      // Créer un lien de téléchargement
      const a = document.createElement("a");
      a.href = url;
      a.download = list.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`✅ Fichier téléchargé: ${list.filename}`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      return false;
    }
  }

  // Démarrer l'exercice
  startExercise() {
    // Appliquer les paramètres de configuration
    const selectedListId = document.getElementById(
      "configWordListSelect"
    ).value;
    this.selectWordList(selectedListId);

    if (this.currentWords.length === 0) {
      alert("Aucune liste de mots sélectionnée ou liste vide.");
      return;
    }

    // Vérifier si le bouton est désactivé
    const startBtn = document.getElementById("startExerciseBtn");
    if (startBtn && startBtn.disabled) {
      return;
    }

    this.isExerciseRunning = true;
    this.isPaused = true; // Commencer en mode pause
    this.currentWordIndex = 0;
    this.wordsDisplayed = 0; // Réinitialiser le compteur
    this.showExerciseMode();

    // Afficher le message de pause au lieu de commencer l'exercice
    this.displayPauseMessage();
    this.updatePauseButton();
  }

  // Afficher le mode exercice
  showExerciseMode() {
    document.getElementById("listsManagement").classList.add("hidden");
    document.getElementById("exerciseConfig").classList.add("hidden");
    document.getElementById("exerciseMode").classList.remove("hidden");
  }

  // Afficher la gestion des listes
  showListsManagement() {
    document.getElementById("exerciseMode").classList.add("hidden");
    document.getElementById("exerciseConfig").classList.add("hidden");
    document.getElementById("listsManagement").classList.remove("hidden");
    this.renderListsGrid();
  }

  // Afficher l'écran d'accueil (maintenant la configuration)
  showWelcome() {
    this.showExerciseConfig();
  }

  // Afficher la configuration de l'exercice
  showExerciseConfig() {
    document.getElementById("listsManagement").classList.add("hidden");
    document.getElementById("exerciseMode").classList.add("hidden");
    document.getElementById("exerciseConfig").classList.remove("hidden");

    // Mettre à jour les contrôles avec les valeurs actuelles
    this.updateConfigControls();
  }

  // Mettre à jour les contrôles de configuration
  updateConfigControls() {
    // Mettre à jour le sélecteur de liste
    const listSelect = document.getElementById("configWordListSelect");
    listSelect.innerHTML = "";
    this.wordLists.forEach((list) => {
      const option = document.createElement("option");
      option.value = list.id;
      option.textContent = list.name;
      if (this.currentList && list.id === this.currentList.id) {
        option.selected = true;
      }
      listSelect.appendChild(option);
    });

    // Mettre à jour la vitesse
    document.getElementById("configSpeedSlider").value = this.speed;
    document.getElementById("configSpeedValue").textContent = `${this.speed}ms`;

    // Mettre à jour le délai
    document.getElementById("configDelaySlider").value = this.delay;
    document.getElementById("configDelayValue").textContent = `${this.delay}ms`;

    // Mettre à jour les options
    document.getElementById("configShuffleWords").checked = this.shuffleWords;

    // Mettre à jour la taille de police
    document.getElementById("configFontSizeSlider").value = this.fontSize;
    document.getElementById(
      "configFontSizeValue"
    ).textContent = `${this.fontSize}px`;
    this.updateFontSizePresets();

    // Mettre à jour l'aperçu de la liste
    if (this.currentList) {
      this.updateListPreview(this.currentList.id);
    } else {
      this.updateListPreview(null);
    }

    // Mettre à jour l'état du bouton démarrer
    this.updateStartButton();
  }

  // Mettre à jour l'aperçu de la liste
  updateListPreview(listId) {
    console.log("🔄 updateListPreview appelé avec:", listId);
    const list = this.wordLists.find((l) => l.id === listId);
    const previewContent = document.getElementById("previewContent");

    if (!previewContent) {
      console.log("❌ Élément previewContent non trouvé");
      return;
    }

    if (!list) {
      console.log("❌ Aucune liste trouvée pour l'aperçu");
      previewContent.innerHTML = "Aucune liste sélectionnée";
      return;
    }

    console.log("✅ Liste trouvée pour l'aperçu:", list.name);
    const words = list.words.filter((word) => word !== "-----");
    const previewWords = words.slice(0, 10); // Afficher seulement les 10 premiers mots

    console.log("📝 Mots à afficher:", previewWords.length);

    previewContent.innerHTML = `
      <div class="preview-words">
        ${previewWords
          .map((word) => `<span class="preview-word">${word}</span>`)
          .join("")}
        ${
          words.length > 10
            ? `<span class="preview-word">... +${
                words.length - 10
              } autres</span>`
            : ""
        }
      </div>
      <div style="margin-top: 8px; font-size: 12px; color: #999;">
        Total: ${words.length} mots en ${list.groups.length} groupe(s)
      </div>
    `;
    
    console.log("✅ Aperçu mis à jour");
  }

  // Mettre à jour la vitesse de configuration
  updateConfigSpeed(speed) {
    this.speed = parseInt(speed);
    document.getElementById("configSpeedValue").textContent = `${this.speed}ms`;
  }

  // Définir la vitesse avec les presets
  setConfigSpeed(speed) {
    document.getElementById("configSpeedSlider").value = speed;
    this.updateConfigSpeed(speed);
  }

  // Mettre à jour le délai de configuration
  updateConfigDelay(delay) {
    this.delay = parseInt(delay);
    document.getElementById("configDelayValue").textContent = `${this.delay}ms`;
  }

  // Définir le délai avec les presets
  setConfigDelay(delay) {
    document.getElementById("configDelaySlider").value = delay;
    this.updateConfigDelay(delay);
  }

  // Mettre à jour le paramètre de mélange
  updateShuffleSetting(shuffle) {
    this.shuffleWords = shuffle;
  }

  // Définir la taille de police
  setConfigFontSize(fontSize) {
    this.fontSize = fontSize;
    document.getElementById(
      "configFontSizeValue"
    ).textContent = `${fontSize}px`;

    // Mettre à jour le slider
    const slider = document.getElementById("configFontSizeSlider");
    if (slider) {
      slider.value = fontSize;
    }

    this.updateFontSizePresets();

    // Appliquer immédiatement si l'exercice est en cours
    if (this.isExerciseRunning) {
      this.applyFontSize();
    }
  }

  // Mettre à jour les presets de taille de police
  updateFontSizePresets() {
    document.querySelectorAll("[data-font-size]").forEach((btn) => {
      const btnFontSize = parseInt(btn.dataset.fontSize);
      if (btnFontSize === this.fontSize) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Appliquer la taille de police au mot affiché
  applyFontSize() {
    const currentWordElement = document.getElementById("currentWord");
    if (currentWordElement) {
      currentWordElement.style.fontSize = `${this.fontSize}px`;
    }
  }

  // Mettre à jour l'état du bouton démarrer
  updateStartButton() {
    const startBtn = document.getElementById("startExerciseBtn");
    if (!startBtn) return;

    const hasValidList =
      this.currentList && this.currentWords && this.currentWords.length > 0;

    if (hasValidList) {
      startBtn.disabled = false;
      startBtn.classList.remove("btn-disabled");
    } else {
      startBtn.disabled = true;
      startBtn.classList.add("btn-disabled");
    }
  }

  // Démarrer l'affichage des mots
  startWordDisplay() {
    this.updateWordCounter();
    this.displayCurrentWord();
    this.scheduleNextWord();
  }

  // Programmer le prochain mot avec pause
  scheduleNextWord() {
    // Nettoyer les timeouts existants avant d'en créer de nouveaux
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];

    // Phase 1: Afficher le mot pendant 'speed' ms
    const timeout1 = setTimeout(() => {
      if (!this.isExerciseRunning || this.isPaused) return;

      // Phase 2: Pause sans mot pendant 'delay' ms
      this.hideCurrentWord();
      const timeout2 = setTimeout(() => {
        if (!this.isExerciseRunning || this.isPaused) return;
        this.nextWord();
        this.scheduleNextWord(); // Programmer le mot suivant
      }, this.delay);
      this.timeoutIds.push(timeout2);
    }, this.speed);
    this.timeoutIds.push(timeout1);
  }

  // Afficher le mot actuel
  displayCurrentWord() {
    const wordDisplay = document.getElementById("currentWord");
    const word = this.currentWords[this.currentWordIndex];

    if (!word) return;

    // Affichage direct sans animation
    wordDisplay.textContent = word;
    // Remettre la couleur en noir
    wordDisplay.style.color = "#333";
    // Appliquer la taille de police
    this.applyFontSize();
  }

  // Masquer le mot actuel (pendant la pause)
  hideCurrentWord() {
    const wordDisplay = document.getElementById("currentWord");
    if (wordDisplay) {
      wordDisplay.textContent = "";
    }
  }

  // Afficher le message de pause
  displayPauseMessage() {
    const wordDisplay = document.getElementById("currentWord");
    if (wordDisplay) {
      wordDisplay.textContent = "⏸️";
      wordDisplay.style.fontSize = "4rem";
      wordDisplay.style.color = "#ccc";
    }
  }

  // Mettre à jour l'apparence du bouton pause
  updatePauseButton() {
    const pauseBtn = document.getElementById("pauseBtn");
    if (!pauseBtn) return;

    if (this.isPaused) {
      pauseBtn.innerHTML = '<i class="fas fa-play"></i> Démarrer';
      pauseBtn.classList.remove("btn-outline");
      pauseBtn.classList.add("btn-primary");
    } else {
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      pauseBtn.classList.remove("btn-primary");
      pauseBtn.classList.add("btn-outline");
    }
  }

  // Mot suivant
  nextWord() {
    if (this.isPaused) return;

    this.currentWordIndex++;
    this.wordsDisplayed++;
    this.updateWordCounter();

    // Pour l'exercice infini, on continue indéfiniment
    // Si on arrive à la fin de la liste, on la mélange et on recommence
    if (this.currentWordIndex >= this.currentWords.length) {
      this.currentWordIndex = 0;
      if (this.shuffleWords) {
        this.shuffleArray(this.currentWords);
      }
    }

    this.displayCurrentWord();
  }

  // Mettre à jour le compteur de mots
  updateWordCounter() {
    const wordCounterElement = document.getElementById("wordCounter");
    if (wordCounterElement) {
      wordCounterElement.textContent = `${this.wordsDisplayed} mots`;
    }
  }

  // Arrêter l'exercice
  stopExercise() {
    this.isExerciseRunning = false;
    this.isPaused = false;

    // Nettoyer tous les timeouts
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];

    // Réinitialiser le bouton pause
    this.updatePauseButton();

    this.showExerciseConfig();
  }

  // Basculer pause/reprise
  togglePause() {
    if (!this.isExerciseRunning) return;

    this.isPaused = !this.isPaused;
    this.updatePauseButton();

    if (!this.isPaused) {
      // Reprendre : commencer l'exercice
      this.startWordDisplay();
    } else {
      // Pause : nettoyer les timeouts et afficher le message de pause
      this.timeoutIds.forEach((id) => clearTimeout(id));
      this.timeoutIds = [];
      this.displayPauseMessage();
    }
  }

  // Sélectionner une liste de mots
  selectWordList(listId) {
    console.log("🔍 selectWordList appelé avec:", listId);
    console.log("🔍 wordLists disponibles:", this.wordLists.map(l => ({id: l.id, name: l.name})));
    
    const list = this.wordLists.find((l) => l.id === listId);

    if (!list) {
      console.log("❌ Aucune liste trouvée pour l'ID:", listId);
      // Aucune liste trouvée, réinitialiser
      this.currentList = null;
      this.currentWords = [];
      this.updateStartButton();
      return;
    }

    console.log("✅ Liste trouvée:", list.name);
    this.currentList = list;
    this.currentWords = this.prepareWordsForExercise(list.words);
    console.log("📝 Mots préparés:", this.currentWords.length);
    
    // Ne pas appeler updateWordListSelects() ici pour éviter la réinitialisation
    this.updateStartButton();
  }

  // Préparer les mots pour l'exercice
  prepareWordsForExercise(words) {
    // Filtrer les mots (enlever les séparateurs -----)
    const filteredWords = words.filter((word) => word !== "-----");

    // Mélanger si demandé
    if (this.shuffleWords) {
      return this.shuffleArray([...filteredWords]);
    }

    return filteredWords;
  }

  // Mélanger un tableau
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Mettre à jour les sélecteurs de liste
  updateWordListSelects() {
    const selects = [
      "wordListSelect",
      "modalWordListSelect",
      "configWordListSelect",
    ];

    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      // Sauvegarder la valeur sélectionnée avant de vider
      const currentValue = select.value;
      
      select.innerHTML = "";
      this.wordLists.forEach((list) => {
        const option = document.createElement("option");
        option.value = list.id;
        option.textContent = list.name;
        select.appendChild(option);
      });
      
      // Restaurer la valeur sélectionnée si elle existe encore
      if (currentValue && this.wordLists.find(l => l.id === currentValue)) {
        select.value = currentValue;
      }
    });
    
    // Réattacher les événements après la mise à jour des options
    this.bindListEvents();
  }

  // Afficher le modal d'ajout de liste
  showAddListModal() {
    this.editingListId = null;
    document.getElementById("modalTitle").textContent = "Nouvelle liste";
    document.getElementById("listNameInput").value = "";
    document.getElementById("wordsInput").value = "";
    document.getElementById("listModal").classList.remove("hidden");
  }

  // Afficher le modal d'édition de liste
  showEditListModal(listId) {
    const list = this.wordLists.find((l) => l.id === listId);
    if (!list) return;

    this.editingListId = listId;
    document.getElementById("modalTitle").textContent = "Modifier la liste";
    document.getElementById("listNameInput").value = list.name;
    document.getElementById("wordsInput").value = list.words.join("\n");
    document.getElementById("listModal").classList.remove("hidden");
  }

  // Masquer le modal
  hideModal() {
    document.getElementById("listModal").classList.add("hidden");
  }

  // Sauvegarder une liste
  async saveList() {
    const name = document.getElementById("listNameInput").value.trim();
    const wordsText = document.getElementById("wordsInput").value.trim();

    if (!name || !wordsText) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Parser les mots
    const words = wordsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Créer les groupes
    const groups = [];
    let currentGroup = [];
    words.forEach((word) => {
      if (word === "-----") {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(word);
      }
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // Créer le nom de fichier
    const filename =
      name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") + ".txt";

    let listToSave;

    if (this.editingListId) {
      // Modifier une liste existante
      const listIndex = this.wordLists.findIndex(
        (l) => l.id === this.editingListId
      );
      if (listIndex !== -1) {
        this.wordLists[listIndex] = {
          ...this.wordLists[listIndex],
          name,
          words,
          groups,
          filename: filename,
        };
        listToSave = this.wordLists[listIndex];
      }
    } else {
      // Créer une nouvelle liste
      const newList = {
        id: filename.replace(".txt", ""),
        name,
        words,
        groups,
        filename: filename,
        createdAt: new Date().toISOString(),
      };
      this.wordLists.push(newList);
      listToSave = newList;
    }

    // Sauvegarder dans la base de données
    if (listToSave) {
      try {
        await this.database.saveList(listToSave);
        console.log(`✅ Liste sauvegardée: ${filename}`);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        alert("Erreur lors de la sauvegarde. Le fichier sera téléchargé.");
      }
    }

    this.hideModal();
    this.renderListsGrid();
    this.updateWordListSelects();
  }

  // Supprimer une liste
  async deleteList(listId) {
    const list = this.wordLists.find((l) => l.id === listId);
    if (!list) return;

    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la liste "${list.name}" ?\n\nLe fichier ${list.filename} sera également supprimé.`
      )
    ) {
      // Supprimer de la base de données
      if (list.filename) {
        try {
          await this.database.deleteList(list.filename);
          console.log(`✅ Liste supprimée: ${list.filename}`);
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          alert(
            "Erreur lors de la suppression. Supprimez le fichier manuellement dans le dossier listes/"
          );
        }
      }

      // Supprimer de la liste
      this.wordLists = this.wordLists.filter((l) => l.id !== listId);
      this.renderListsGrid();
      this.updateWordListSelects();
    }
  }

  // Rendre la grille des listes
  renderListsGrid() {
    const listsTable = document.getElementById("listsTable");
    const tableBody = document.getElementById("listsTableBody");
    const emptyState = document.getElementById("emptyState");

    if (this.wordLists.length === 0) {
      listsTable.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    listsTable.classList.remove("hidden");

    // Trier les listes par ordre alphabétique
    const sortedLists = [...this.wordLists].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    tableBody.innerHTML = sortedLists
      .map(
        (list) => `
            <div class="table-row">
                <div class="col-name">${list.name}</div>
                <div class="col-words">${
                  list.words.filter((w) => w !== "-----").length
                } mots</div>
                <div class="col-actions">
                    <button class="btn btn-sm btn-outline" onclick="app.showEditListModal('${
                      list.id
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteList('${
                      list.id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Afficher le modal des paramètres
  showSettingsModal() {
    document.getElementById("settingsModal").classList.remove("hidden");
  }

  // Masquer le modal des paramètres
  hideSettingsModal() {
    document.getElementById("settingsModal").classList.add("hidden");
  }

  // Appliquer les paramètres
  applySettings() {
    const modalSpeed = document.getElementById("modalSpeedSlider").value;
    const modalList = document.getElementById("modalWordListSelect").value;
    const shuffle = document.getElementById("shuffleWords").checked;

    this.speed = parseInt(modalSpeed);
    this.shuffleWords = shuffle;

    // Mettre à jour les contrôles de l'exercice
    document.getElementById("speedSlider").value = this.speed;
    document.getElementById("speedValue").textContent = `${this.speed}ms`;
    document.getElementById("wordListSelect").value = modalList;

    // Sélectionner la nouvelle liste
    this.selectWordList(modalList);

    this.hideSettingsModal();
  }

  // Gestion des raccourcis clavier
  handleKeydown(e) {
    if (!this.isExerciseRunning) return;

    switch (e.key) {
      case " ":
        e.preventDefault();
        this.togglePause();
        break;
      case "Escape":
        e.preventDefault();
        this.stopExercise();
        break;
      case "ArrowRight":
        e.preventDefault();
        if (this.isPaused) {
          this.nextWord();
        }
        break;
    }
  }

  // Sélectionner un dossier pour les listes
  async selectFolder() {
    try {
      console.log("🔍 Tentative de sélection de dossier...");
      console.log("🔍 window.electronAPI:", window.electronAPI);
      console.log("🔍 typeof window.electronAPI:", typeof window.electronAPI);

      // Vérifier que l'API Electron est disponible
      if (!window.electronAPI) {
        throw new Error(
          "API Electron non disponible - window.electronAPI est undefined"
        );
      }

      if (!window.electronAPI.showOpenDialog) {
        throw new Error("API Electron incomplète - showOpenDialog manquant");
      }

      const result = await window.electronAPI.showOpenDialog({
        title: "Sélectionner le dossier des listes de mots",
        properties: ["openDirectory"],
        buttonLabel: "Sélectionner ce dossier",
      });

      console.log("📁 Résultat du dialogue:", result);

      if (
        result.canceled ||
        !result.filePaths ||
        result.filePaths.length === 0
      ) {
        console.log("❌ Sélection annulée");
        return;
      }

      const selectedPath = result.filePaths[0];
      console.log("✅ Dossier sélectionné:", selectedPath);

      // Mettre à jour le dossier dans la base de données
      this.database.setDirectory(selectedPath);

      // Sauvegarder le chemin dans localStorage
      localStorage.setItem("flashwords_selected_folder", selectedPath);

      // Mettre à jour l'affichage du dossier
      this.updateFolderDisplay(selectedPath);

      // Recharger les listes depuis le nouveau dossier
      this.wordLists = await this.database.loadAllLists();
      console.log("📚 Listes chargées:", this.wordLists.length);

      // Rafraîchir l'interface
      this.renderListsGrid();
      this.updateWordListSelects();

      // Sélectionner automatiquement la première liste si disponible
      if (this.wordLists.length > 0) {
        this.selectWordList(this.wordLists[0].id);
      }

      alert(
        `✅ Dossier sélectionné : ${selectedPath}\n📚 ${this.wordLists.length} liste(s) trouvée(s)`
      );
    } catch (error) {
      console.error("❌ Erreur lors de la sélection du dossier:", error);
      alert(`Erreur lors de la sélection du dossier: ${error.message}`);
    }
  }

  // Mettre à jour l'affichage du dossier
  updateFolderDisplay(folderPath) {
    const folderPathElement = document.getElementById("folderPath");
    if (folderPathElement) {
      folderPathElement.textContent = folderPath;
      console.log("📁 Dossier affiché:", folderPath);
    } else {
      console.warn("⚠️ Élément folderPath non trouvé");
    }
  }

  // Charger le dossier sauvegardé au démarrage
  async loadSavedFolder() {
    try {
      const savedFolder = localStorage.getItem("flashwords_selected_folder");
      if (savedFolder) {
        this.database.setDirectory(savedFolder);
        this.updateFolderDisplay(savedFolder);

        // Charger les listes du dossier sauvegardé et sélectionner la première
        this.wordLists = await this.database.loadAllLists();
        console.log(
          `📚 Listes chargées depuis le dossier sauvegardé: ${this.wordLists.length}`
        );
        this.updateWordListSelects();

        if (this.wordLists.length > 0) {
          this.selectWordList(this.wordLists[0].id);
        }

        return true;
      }
    } catch (error) {
      console.warn("Impossible de charger le dossier sauvegardé:", error);
    }
    return false;
  }

  // Charger un fichier depuis le système de fichiers
  async loadFileFromSystem() {
    try {
      const result = await window.electronAPI.showOpenDialog({
        title: "Importer une liste de mots",
        filters: [
          { name: "Fichiers texte", extensions: ["txt"] },
          { name: "Tous les fichiers", extensions: ["*"] },
        ],
        properties: ["openFile"],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return;
      }

      const filePath = result.filePaths[0];
      const filename = await window.electronAPI.path.basename(filePath);

      // Lire le fichier
      const fileResult = await window.electronAPI.readFile(filePath);
      if (!fileResult.success) {
        throw new Error(fileResult.error);
      }

      // Parser le contenu
      const list = this.database.parseFileContent(fileResult.data, filename);

      // Vérifier si la liste existe déjà
      const existingList = this.wordLists.find((l) => l.filename === filename);
      if (existingList) {
        if (
          confirm(
            `Une liste avec le nom "${list.name}" existe déjà. Voulez-vous la remplacer ?`
          )
        ) {
          existingList.words = list.words;
          existingList.groups = list.groups;
        } else {
          return;
        }
      } else {
        // Ajouter la nouvelle liste
        this.wordLists.push(list);
      }

      this.renderListsGrid();
      this.updateWordListSelects();
      alert(`✅ Liste "${list.name}" importée avec succès !`);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      alert("Erreur lors de l'import du fichier.");
    }
  }

  // Déclencher l'import de fichier
  triggerFileImport() {
    document.getElementById("fileInput").click();
  }

  // Gérer l'import de fichier
  async handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      alert("Veuillez sélectionner un fichier .txt");
      return;
    }

    try {
      const text = await file.text();
      const words = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      // Créer les groupes
      const groups = [];
      let currentGroup = [];
      words.forEach((word) => {
        if (word === "-----") {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else {
          currentGroup.push(word);
        }
      });
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      // Créer le nom de la liste à partir du nom de fichier
      const listName = file.name
        .replace(".txt", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const filename = file.name;

      // Vérifier si la liste existe déjà
      const existingList = this.wordLists.find((l) => l.filename === filename);
      if (existingList) {
        if (
          confirm(
            `Une liste avec le nom "${listName}" existe déjà. Voulez-vous la remplacer ?`
          )
        ) {
          existingList.words = words;
          existingList.groups = groups;
        } else {
          return;
        }
      } else {
        // Créer une nouvelle liste
        const newList = {
          id: filename.replace(".txt", ""),
          name: listName,
          words: words,
          groups: groups,
          filename: filename,
          createdAt: new Date().toISOString(),
        };
        this.wordLists.push(newList);
      }

      this.renderListsGrid();
      this.updateWordListSelects();
      alert(`Liste "${listName}" importée avec succès !`);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      alert("Erreur lors de l'import du fichier");
    }

    // Réinitialiser l'input
    event.target.value = "";
  }

  // Exporter une liste
  async exportList(listId) {
    const list = this.wordLists.find((l) => l.id === listId);
    if (!list) return;

    try {
      await this.saveListToFile(list);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export de la liste");
    }
  }

  // Mettre à jour l'interface utilisateur
  updateUI() {
    this.renderListsGrid();
    this.updateWordListSelects();
  }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  window.app = new FlashWordsApp();
});

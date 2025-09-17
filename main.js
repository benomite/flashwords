const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs").promises;

// Garder une référence globale de l'objet window
let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    // Icon sera géré par electron-builder selon la plateforme
    // icon: path.join(__dirname, "assets", "icon.png"), // Optionnel
    title: "FlashWords - Exercice de Lecture Rapide",
    show: false, // Ne pas afficher immédiatement
  });

  // Charger l'application
  mainWindow.loadFile("index.html");

  // Afficher la fenêtre quand elle est prête
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Ouvrir les DevTools en mode développement
    if (process.argv.includes("--dev")) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Gérer la fermeture de la fenêtre
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.on("ready", createWindow);

// Quitter quand toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  // Sur macOS, il est courant que les applications restent actives
  // jusqu'à ce qu'elles soient explicitement fermées avec Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // Sur macOS, il est courant de recréer une fenêtre dans l'app quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion des fichiers via IPC
ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("write-file", async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, "utf8");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("read-dir", async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          path: filePath,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
        };
      })
    );
    return { success: true, files: fileStats };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("ensure-dir", async (event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-file", async (event, filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Gestion des dialogues de fichiers
ipcMain.handle("show-save-dialog", async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(
      mainWindow || BrowserWindow.getFocusedWindow(),
      options
    );
    return result;
  } catch (error) {
    console.error("Erreur dans show-save-dialog:", error);
    return { 
      canceled: true, 
      error: error.message,
      filePaths: []
    };
  }
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(
      mainWindow || BrowserWindow.getFocusedWindow(),
      options
    );
    return result;
  } catch (error) {
    console.error("Erreur dans show-open-dialog:", error);
    return { 
      canceled: true, 
      error: error.message,
      filePaths: []
    };
  }
});

// Handlers pour les fonctions path
ipcMain.handle("path-join", async (event, ...args) => {
  return path.join(...args);
});

ipcMain.handle("path-basename", async (event, filePath) => {
  return path.basename(filePath);
});

ipcMain.handle("path-dirname", async (event, filePath) => {
  return path.dirname(filePath);
});

ipcMain.handle("path-extname", async (event, filePath) => {
  return path.extname(filePath);
});

// Handler pour obtenir le séparateur de chemin de la plateforme
ipcMain.handle("path-sep", async (event) => {
  return path.sep;
});

// Handler pour normaliser les chemins
ipcMain.handle("path-normalize", async (event, filePath) => {
  return path.normalize(filePath);
});

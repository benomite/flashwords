const { contextBridge, ipcRenderer } = require("electron");

console.log("🔧 Preload script chargé");

// Exposer les APIs sécurisées au contexte de rendu
contextBridge.exposeInMainWorld("electronAPI", {
  // Gestion des fichiers
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) =>
    ipcRenderer.invoke("write-file", filePath, content),
  readDir: (dirPath) => ipcRenderer.invoke("read-dir", dirPath),
  ensureDir: (dirPath) => ipcRenderer.invoke("ensure-dir", dirPath),
  deleteFile: (filePath) => ipcRenderer.invoke("delete-file", filePath),

  // Dialogues de fichiers
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),

  // Utilitaires path (implémentation côté main)
  path: {
    join: (...args) => ipcRenderer.invoke("path-join", ...args),
    basename: (filePath) => ipcRenderer.invoke("path-basename", filePath),
    dirname: (filePath) => ipcRenderer.invoke("path-dirname", filePath),
    extname: (filePath) => ipcRenderer.invoke("path-extname", filePath),
    sep: () => ipcRenderer.invoke("path-sep"),
    normalize: (filePath) => ipcRenderer.invoke("path-normalize", filePath),
  },

  // Informations sur l'environnement
  platform: process.platform,
  isElectron: true,
});

console.log("✅ electronAPI exposé dans window");

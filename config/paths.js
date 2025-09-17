// Configuration des chemins pour FlashWords
const path = require('path');

const config = {
  // Chemins de base
  root: path.join(__dirname, '..'),
  lib: path.join(__dirname, '..', 'lib'),
  tests: path.join(__dirname, '..', 'tests'),
  bin: path.join(__dirname, '..', 'bin'),
  config: path.join(__dirname, '..', 'config'),
  
  // Chemins de l'application
  main: path.join(__dirname, '..', 'lib', 'main.js'),
  preload: path.join(__dirname, '..', 'lib', 'preload.js'),
  index: path.join(__dirname, '..', 'lib', 'index.html'),
  styles: path.join(__dirname, '..', 'lib', 'styles.css'),
  script: path.join(__dirname, '..', 'lib', 'script.js'),
  
  // Chemins des données
  listes: path.join(__dirname, '..', 'listes'),
  
  // Chemins de build
  dist: path.join(__dirname, '..', 'dist'),
  
  // Chemins des assets
  assets: path.join(__dirname, '..', 'assets'),
  icons: {
    win: path.join(__dirname, '..', 'assets', 'icon.ico'),
    mac: path.join(__dirname, '..', 'assets', 'icon.icns'),
    linux: path.join(__dirname, '..', 'assets', 'icon.png')
  }
};

module.exports = config;

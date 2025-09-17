// Script de test pour FlashWords
// Ce script peut être exécuté avec: node test-app.js

const { app, BrowserWindow } = require('electron');
const path = require('path');

// Test de l'API Electron
function testElectronAPI() {
  console.log('🧪 Test de l\'API Electron...');
  
  // Vérifier que les modules sont disponibles
  const requiredModules = ['app', 'BrowserWindow', 'ipcMain', 'dialog'];
  const missingModules = requiredModules.filter(module => {
    try {
      require(module);
      return false;
    } catch (e) {
      return true;
    }
  });
  
  if (missingModules.length > 0) {
    console.error('❌ Modules manquants:', missingModules);
    return false;
  }
  
  console.log('✅ Tous les modules Electron sont disponibles');
  return true;
}

// Test de la structure des fichiers
function testFileStructure() {
  console.log('🧪 Test de la structure des fichiers...');
  
  const fs = require('fs');
  const requiredFiles = [
    'main.js',
    'preload.js', 
    'script.js',
    'index.html',
    'styles.css',
    'package.json'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    try {
      fs.accessSync(file);
      return false;
    } catch (e) {
      return true;
    }
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Fichiers manquants:', missingFiles);
    return false;
  }
  
  console.log('✅ Tous les fichiers requis sont présents');
  return true;
}

// Test de la configuration package.json
function testPackageConfig() {
  console.log('🧪 Test de la configuration package.json...');
  
  try {
    const packageJson = require('./package.json');
    
    // Vérifier les champs requis
    const requiredFields = ['name', 'version', 'main', 'scripts'];
    const missingFields = requiredFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Champs manquants dans package.json:', missingFields);
      return false;
    }
    
    // Vérifier les scripts
    const requiredScripts = ['start', 'dev', 'build'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      console.error('❌ Scripts manquants dans package.json:', missingScripts);
      return false;
    }
    
    console.log('✅ Configuration package.json valide');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la lecture de package.json:', error.message);
    return false;
  }
}

// Exécuter tous les tests
function runAllTests() {
  console.log('🚀 Démarrage des tests FlashWords...\n');
  
  const tests = [
    testElectronAPI,
    testFileStructure,
    testPackageConfig
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  tests.forEach((test, index) => {
    console.log(`\n--- Test ${index + 1}/${totalTests} ---`);
    if (test()) {
      passedTests++;
    }
  });
  
  console.log(`\n📊 Résultats: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Tous les tests sont passés ! L\'application est prête.');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }
  
  return passedTests === totalTests;
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testElectronAPI,
  testFileStructure,
  testPackageConfig,
  runAllTests
};

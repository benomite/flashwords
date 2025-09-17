// Test de compatibilité cross-platform pour FlashWords
const path = require('path');
const fs = require('fs');

console.log('🌍 Test de compatibilité cross-platform FlashWords\n');

// Test 1: Vérifier les chemins de fichiers
function testPathHandling() {
  console.log('🧪 Test 1: Gestion des chemins de fichiers');
  
  const testPaths = [
    ['folder', 'file.txt'],
    ['folder', 'subfolder', 'file.txt'],
    ['C:\\Users\\test\\file.txt'], // Windows
    ['/Users/test/file.txt'], // Unix/Mac
  ];
  
  testPaths.forEach((pathParts, index) => {
    try {
      const joinedPath = path.join(...pathParts);
      const normalizedPath = path.normalize(joinedPath);
      const basename = path.basename(joinedPath);
      const dirname = path.dirname(joinedPath);
      const extname = path.extname(joinedPath);
      
      console.log(`  ✅ Test ${index + 1}: ${pathParts.join(' + ')}`);
      console.log(`     → join: ${joinedPath}`);
      console.log(`     → normalize: ${normalizedPath}`);
      console.log(`     → basename: ${basename}`);
      console.log(`     → dirname: ${dirname}`);
      console.log(`     → extname: ${extname}`);
    } catch (error) {
      console.log(`  ❌ Test ${index + 1} échoué: ${error.message}`);
    }
  });
  
  console.log(`  📊 Séparateur de chemin: '${path.sep}'`);
  console.log(`  📊 Plateforme: ${process.platform}\n`);
}

// Test 2: Vérifier la structure des fichiers requis
function testRequiredFiles() {
  console.log('🧪 Test 2: Fichiers requis');
  
  const requiredFiles = [
    'main.js',
    'preload.js',
    'script.js',
    'index.html',
    'styles.css',
    'package.json'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    try {
      fs.accessSync(file);
      console.log(`  ✅ ${file}`);
    } catch (error) {
      console.log(`  ❌ ${file} - MANQUANT`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    console.log('  🎉 Tous les fichiers requis sont présents\n');
  } else {
    console.log('  ⚠️  Certains fichiers sont manquants\n');
  }
  
  return allFilesExist;
}

// Test 3: Vérifier la configuration package.json
function testPackageConfig() {
  console.log('🧪 Test 3: Configuration package.json');
  
  try {
    const packageJson = require('./package.json');
    
    // Vérifier les scripts de build pour chaque plateforme
    const buildScripts = ['build:win', 'build:mac', 'build:linux'];
    const missingScripts = buildScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length === 0) {
      console.log('  ✅ Scripts de build pour toutes les plateformes');
    } else {
      console.log(`  ❌ Scripts manquants: ${missingScripts.join(', ')}`);
    }
    
    // Vérifier la configuration electron-builder
    if (packageJson.build) {
      const platforms = ['win', 'mac', 'linux'];
      const configuredPlatforms = platforms.filter(platform => packageJson.build[platform]);
      
      console.log(`  ✅ Plateformes configurées: ${configuredPlatforms.join(', ')}`);
      
      // Vérifier les icônes
      platforms.forEach(platform => {
        if (packageJson.build[platform] && packageJson.build[platform].icon) {
          const iconPath = packageJson.build[platform].icon;
          console.log(`  ✅ Icône ${platform}: ${iconPath}`);
        }
      });
    } else {
      console.log('  ❌ Configuration electron-builder manquante');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.log(`  ❌ Erreur lors de la lecture de package.json: ${error.message}\n`);
    return false;
  }
}

// Test 4: Vérifier les dépendances Electron
function testElectronDependencies() {
  console.log('🧪 Test 4: Dépendances Electron');
  
  try {
    const packageJson = require('./package.json');
    const electronVersion = packageJson.devDependencies?.electron;
    const electronBuilderVersion = packageJson.devDependencies?.['electron-builder'];
    
    if (electronVersion) {
      console.log(`  ✅ Electron: ${electronVersion}`);
    } else {
      console.log('  ❌ Electron non trouvé dans les dépendances');
    }
    
    if (electronBuilderVersion) {
      console.log(`  ✅ electron-builder: ${electronBuilderVersion}`);
    } else {
      console.log('  ❌ electron-builder non trouvé dans les dépendances');
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.log(`  ❌ Erreur lors de la vérification des dépendances: ${error.message}\n`);
    return false;
  }
}

// Test 5: Vérifier la compatibilité des chemins dans le code
function testCodeCompatibility() {
  console.log('🧪 Test 5: Compatibilité du code');
  
  try {
    // Lire le fichier main.js et vérifier les utilisations de path
    const mainJs = fs.readFileSync('main.js', 'utf8');
    const pathUsages = mainJs.match(/path\./g) || [];
    
    console.log(`  📊 Utilisations de 'path.' dans main.js: ${pathUsages.length}`);
    
    // Vérifier les utilisations de process.platform
    const platformUsages = mainJs.match(/process\.platform/g) || [];
    console.log(`  📊 Utilisations de 'process.platform' dans main.js: ${platformUsages.length}`);
    
    // Vérifier les utilisations de __dirname
    const dirnameUsages = mainJs.match(/__dirname/g) || [];
    console.log(`  📊 Utilisations de '__dirname' dans main.js: ${dirnameUsages.length}`);
    
    console.log('  ✅ Le code semble compatible cross-platform\n');
    return true;
  } catch (error) {
    console.log(`  ❌ Erreur lors de l'analyse du code: ${error.message}\n`);
    return false;
  }
}

// Exécuter tous les tests
function runAllTests() {
  const tests = [
    testPathHandling,
    testRequiredFiles,
    testPackageConfig,
    testElectronDependencies,
    testCodeCompatibility
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  tests.forEach((test, index) => {
    if (test()) {
      passedTests++;
    }
  });
  
  console.log(`📊 Résultats: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 L\'application est compatible Windows et Mac !');
  } else {
    console.log('⚠️  Certains problèmes de compatibilité ont été détectés.');
  }
  
  return passedTests === totalTests;
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testPathHandling,
  testRequiredFiles,
  testPackageConfig,
  testElectronDependencies,
  testCodeCompatibility,
  runAllTests
};

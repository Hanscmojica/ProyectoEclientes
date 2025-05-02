const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ruta al directorio del frontend
const frontendDir = path.resolve(__dirname, '../frontend');
const buildDir = path.join(frontendDir, 'build');

console.log('======= SETUP FRONTEND =======');
console.log(`Verificando directorio frontend en: ${frontendDir}`);

// Verificar si el directorio frontend existe
if (!fs.existsSync(frontendDir)) {
  console.error(`ERROR: El directorio frontend no existe en ${frontendDir}`);
  process.exit(1);
}

// Verificar si existe la carpeta build y si contiene index.html
const buildExists = fs.existsSync(buildDir);
let hasIndexHtml = false;

if (buildExists) {
  try {
    const files = fs.readdirSync(buildDir);
    hasIndexHtml = files.includes('index.html');
    console.log('Contenido del directorio build:');
    files.forEach(file => {
      console.log(` - ${file}`);
    });
  } catch (error) {
    console.error(`ERROR al leer el directorio build: ${error.message}`);
  }
}

if (!buildExists || !hasIndexHtml) {
  console.log('El directorio build no existe o no contiene index.html. Reconstruyendo...');
  
  try {
    // Cambiar al directorio del frontend
    console.log(`Cambiando al directorio: ${frontendDir}`);
    process.chdir(frontendDir);
    
    // Confirmar el directorio actual
    console.log('Directorio actual:', process.cwd());
    
    // Ejecutar npm install
    console.log('Instalando dependencias del frontend...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Ejecutar npm run build
    console.log('Construyendo el frontend...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('Frontend construido correctamente.');
  } catch (error) {
    console.error('ERROR al construir el frontend:', error.message);
    process.exit(1);
  }
  
  // Volver al directorio raíz del proyecto
  process.chdir(path.resolve(__dirname, '..'));
} else {
  console.log('El directorio build existe y contiene index.html.');
}

// Verificar el contenido de build después de la construcción
if (fs.existsSync(buildDir)) {
  console.log('Contenido final del directorio build:');
  fs.readdirSync(buildDir).forEach(file => {
    console.log(` - ${file}`);
  });
} else {
  console.error('ERROR: El directorio build sigue sin existir después de la construcción.');
  process.exit(1);
}

console.log('Verificación completada. El frontend está listo.');
console.log('=============================='); 
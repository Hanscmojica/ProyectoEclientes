const fs = require('fs');
const path = require('path');

// Directorio para almacenar los logs de errores
const LOG_DIR = path.join(__dirname, '../logs');

// Asegurar que el directorio de logs existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Registra un error de API en un archivo de log
 * @param {string} source - Origen del error (componente o servicio)
 * @param {string} endpoint - Endpoint de la API que falló
 * @param {Error} error - Objeto de error
 * @param {Object} [usuario] - Información del usuario que realizó la petición
 */
const registrarErrorAPI = (source, endpoint, error, usuario = null) => {
  try {
    const fecha = new Date();
    const nombreArchivo = `api_errors_${fecha.toISOString().split('T')[0]}.log`;
    const rutaArchivo = path.join(LOG_DIR, nombreArchivo);
    
    // Formatear el error para el log
    const errorLog = {
      timestamp: fecha.toISOString(),
      source,
      endpoint,
      usuario: usuario ? {
        id: usuario.id,
        nombre: usuario.nombre
      } : 'No autenticado',
      error: {
        message: error.message,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }
    };
    
    // Convertir a formato legible
    const logString = JSON.stringify(errorLog, null, 2) + '\n\n';
    
    // Añadir al archivo de log
    fs.appendFileSync(rutaArchivo, logString);
    
    console.log(`Error de API registrado en: ${rutaArchivo}`);
    return true;
  } catch (logError) {
    console.error('Error al registrar error de API:', logError);
    return false;
  }
};

/**
 * Obtener los últimos errores de API registrados
 * @param {number} [limit=10] - Número máximo de errores a retornar
 * @returns {Array} - Lista de errores
 */
const obtenerUltimosErrores = (limit = 10) => {
  try {
    // Obtener lista de archivos de log ordenados por fecha (más reciente primero)
    const archivos = fs.readdirSync(LOG_DIR)
      .filter(file => file.startsWith('api_errors_'))
      .sort()
      .reverse();
    
    if (archivos.length === 0) {
      return [];
    }
    
    // Leer el archivo más reciente
    const archivoReciente = path.join(LOG_DIR, archivos[0]);
    const contenido = fs.readFileSync(archivoReciente, 'utf8');
    
    // Dividir por doble salto de línea que separa cada entrada
    const entradas = contenido.split('\n\n').filter(entry => entry.trim());
    
    // Parsear las entradas JSON más recientes (hasta el límite)
    const errores = entradas
      .map(entry => {
        try {
          return JSON.parse(entry);
        } catch (e) {
          return null;
        }
      })
      .filter(entry => entry !== null)
      .slice(0, limit);
    
    return errores;
  } catch (error) {
    console.error('Error al obtener últimos errores:', error);
    return [];
  }
};

module.exports = {
  registrarErrorAPI,
  obtenerUltimosErrores
}; 
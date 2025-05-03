// src/controllers/ftpController.js
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const { registrarErrorAPI } = require('../services/apiErrorService');

// Configuración de almacenamiento temporal para archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../../storage/temp');
    fs.ensureDirSync(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB límite
});

// Simulación de estructura de documentos en memoria
const documentosSimulados = {
  'VER25-000524': [
    {
      id: '1',
      nombre: 'Pedimento_VER25-000524.pdf',
      tipo: 'pdf',
      categoria: 'Pedimentos',
      fechaCreacion: '2023-10-15',
      tamano: '1.2 MB',
      ruta: '/archivos/referencias/VER25-000524/pedimentos/pedimento_ver25_000524.pdf'
    },
    {
      id: '2',
      nombre: 'Factura_VER25-000524.pdf',
      tipo: 'pdf',
      categoria: 'Facturas',
      fechaCreacion: '2023-10-15',
      tamano: '850 KB',
      ruta: '/archivos/referencias/VER25-000524/facturas/factura_ver25_000524.pdf'
    }
  ],
  'VER25-000523': [
    {
      id: '3',
      nombre: 'Pedimento_VER25-000523.pdf',
      tipo: 'pdf',
      categoria: 'Pedimentos',
      fechaCreacion: '2023-09-28',
      tamano: '1.1 MB',
      ruta: '/archivos/referencias/VER25-000523/pedimentos/pedimento_ver25_000523.pdf'
    },
    {
      id: '4',
      nombre: 'Factura_VER25-000523.pdf',
      tipo: 'pdf',
      categoria: 'Facturas',
      fechaCreacion: '2023-09-28',
      tamano: '780 KB',
      ruta: '/archivos/referencias/VER25-000523/facturas/factura_ver25_000523.pdf'
    }
  ]
};

// Simulación de categorías
const categoriasSimuladas = [
  { id: 1, nombre: 'Pedimentos' },
  { id: 2, nombre: 'Facturas' },
  { id: 3, nombre: 'Reportes' },
  { id: 4, nombre: 'Otros' }
];

/**
 * Obtener archivos por referencia
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerArchivosPorReferencia = (req, res) => {
  try {
    const { referenciaId } = req.params;
    
    console.log(`Obteniendo archivos para la referencia: ${referenciaId}`);
    
    // Simular obtención de archivos desde la BD o sistema de archivos
    const archivos = documentosSimulados[referenciaId] || [];
    
    res.status(200).json(archivos);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    
    // Registrar el error
    registrarErrorAPI(
      'ftpController.obtenerArchivosPorReferencia', 
      `obtener archivos de referencia ${req.params.referenciaId}`, 
      error, 
      req.usuario
    );
    
    res.status(500).json({ 
      message: 'Error al obtener archivos de la referencia'
    });
  }
};

/**
 * Obtener categorías para archivos
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerCategorias = (req, res) => {
  try {
    res.status(200).json(categoriasSimuladas);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    
    // Registrar el error
    registrarErrorAPI(
      'ftpController.obtenerCategorias', 
      'obtener categorías de documentos', 
      error, 
      req.usuario
    );
    
    res.status(500).json({ 
      message: 'Error al obtener las categorías disponibles'
    });
  }
};

/**
 * Subir archivo a una referencia
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const subirArchivo = (req, res) => {
  upload.single('archivo')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: 'No se ha proporcionado ningún archivo'
        });
      }
      
      const { referencia, categoria = 'Otros', descripcion = '' } = req.body;
      
      if (!referencia) {
        // Eliminar el archivo temporal
        if (req.file && req.file.path) {
          await fs.unlink(req.file.path);
        }
        
        return res.status(400).json({
          ok: false,
          message: 'La referencia es obligatoria'
        });
      }
      
      // Simular el almacenamiento del archivo
      // En un caso real, aquí se movería el archivo a su ubicación final
      
      // Crear un nuevo registro de documento (simulado)
      const nuevoArchivo = {
        id: Math.floor(Math.random() * 1000).toString(),
        nombre: req.file.originalname,
        tipo: obtenerTipoArchivo(req.file.originalname),
        categoria: categoria,
        fechaCreacion: new Date().toISOString().split('T')[0],
        tamano: formatearTamano(req.file.size),
        ruta: `/archivos/referencias/${referencia}/${categoria.toLowerCase()}/${req.file.filename}`
      };
      
      // Añadir a la simulación en memoria
      if (!documentosSimulados[referencia]) {
        documentosSimulados[referencia] = [];
      }
      documentosSimulados[referencia].push(nuevoArchivo);
      
      // En producción, esto sería guardado en la base de datos
      
      // Eliminar el archivo temporal
      if (req.file && req.file.path) {
        await fs.unlink(req.file.path);
      }
      
      res.status(200).json({
        ok: true,
        message: 'Archivo subido correctamente',
        archivo: nuevoArchivo
      });
      
    } catch (error) {
      console.error('Error al subir archivo:', error);
      
      // Intentar eliminar el archivo temporal en caso de error
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (cleanupError) {
          console.error('Error al eliminar archivo temporal:', cleanupError);
        }
      }
      
      // Registrar el error
      registrarErrorAPI(
        'ftpController.subirArchivo', 
        'subir archivo', 
        error, 
        req.usuario
      );
      
      res.status(500).json({
        ok: false,
        message: 'Error al procesar la subida del archivo'
      });
    }
  });
};

/**
 * Descargar un archivo específico
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const descargarArchivo = (req, res) => {
  try {
    const { archivoId } = req.params;
    
    // Buscar el archivo en nuestra simulación
    let archivoEncontrado = null;
    
    for (const referencia in documentosSimulados) {
      const encontrado = documentosSimulados[referencia].find(a => a.id === archivoId);
      if (encontrado) {
        archivoEncontrado = encontrado;
        break;
      }
    }
    
    if (!archivoEncontrado) {
      return res.status(404).json({ 
        message: 'Archivo no encontrado' 
      });
    }
    
    // En un caso real, aquí se enviaría el archivo desde su ubicación física
    // Para este ejemplo, simulamos una respuesta exitosa
    
    res.status(200).json({ 
      message: 'Archivo listo para descarga',
      archivo: archivoEncontrado
    });
    
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    
    // Registrar el error
    registrarErrorAPI(
      'ftpController.descargarArchivo', 
      `descargar archivo ${req.params.archivoId}`, 
      error, 
      req.usuario
    );
    
    res.status(500).json({ 
      message: 'Error al preparar el archivo para descarga'
    });
  }
};

/**
 * Registrar visualización de un archivo
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const registrarVisualizacion = (req, res) => {
  try {
    const { archivoId } = req.body;
    
    if (!archivoId) {
      return res.status(400).json({ 
        message: 'ID de archivo requerido' 
      });
    }
    
    // Buscar el archivo en nuestra simulación
    let archivoEncontrado = null;
    
    for (const referencia in documentosSimulados) {
      const encontrado = documentosSimulados[referencia].find(a => a.id === archivoId);
      if (encontrado) {
        archivoEncontrado = encontrado;
        break;
      }
    }
    
    if (!archivoEncontrado) {
      return res.status(404).json({ 
        message: 'Archivo no encontrado' 
      });
    }
    
    // Simulamos registro de visualización
    console.log(`Visualización registrada: Archivo ${archivoId} por usuario ${req.usuario?.id || 'desconocido'}`);
    
    res.status(200).json({ 
      message: 'Visualización registrada correctamente' 
    });
    
  } catch (error) {
    console.error('Error al registrar visualización:', error);
    
    // Registrar el error
    registrarErrorAPI(
      'ftpController.registrarVisualizacion', 
      `registrar visualización de archivo ${req.body.archivoId}`, 
      error, 
      req.usuario
    );
    
    res.status(500).json({ 
      message: 'Error al registrar la visualización del archivo'
    });
  }
};

/**
 * Obtener el tipo de archivo basado en la extensión
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Tipo de archivo
 */
const obtenerTipoArchivo = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  
  const tiposArchivo = {
    '.pdf': 'pdf',
    '.doc': 'word',
    '.docx': 'word',
    '.xls': 'excel',
    '.xlsx': 'excel',
    '.ppt': 'powerpoint',
    '.pptx': 'powerpoint',
    '.txt': 'texto',
    '.jpg': 'imagen',
    '.jpeg': 'imagen',
    '.png': 'imagen',
    '.gif': 'imagen',
    '.zip': 'comprimido',
    '.rar': 'comprimido',
    '.xml': 'xml',
    '.csv': 'csv'
  };
  
  return tiposArchivo[ext] || 'otro';
};

/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
const formatearTamano = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
};

module.exports = {
  obtenerArchivosPorReferencia,
  obtenerCategorias,
  subirArchivo,
  descargarArchivo,
  registrarVisualizacion
};
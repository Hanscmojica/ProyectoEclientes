const path = require('path');
const fs = require('fs');
const ftpController = require('./ftpController');

// Directorio para almacenar archivos (mantener para compatibilidad)
const ARCHIVOS_DIR = path.join(__dirname, '../archivos');

// Asegurar que el directorio existe
if (!fs.existsSync(ARCHIVOS_DIR)) {
    fs.mkdirSync(ARCHIVOS_DIR, { recursive: true });
}

// Datos de ejemplo para simular la respuesta de la BD (mantener para compatibilidad)
const archivosMock = {
    // Mantener tus datos mock existentes...
    'VER25-000524': [
        {
            id: '1',
            nombre: 'Pedimento_VER25-000524.pdf',
            tipo: 'pdf',
            categoria: 'Pedimentos',
            fechaCreacion: '2023-10-15',
            tamano: '1.2 MB',
            url: '/archivos/pedimento_ver25_000524.pdf'
        },
        {
            id: '2',
            nombre: 'Factura_VER25-000524.pdf',
            tipo: 'pdf',
            categoria: 'Facturas',
            fechaCreacion: '2023-10-15',
            tamano: '850 KB',
            url: '/archivos/factura_ver25_000524.pdf'
        },
        {
            id: '3',
            nombre: 'Reporte_Operacion_VER25-000524.xlsx',
            tipo: 'excel',
            categoria: 'Reportes',
            fechaCreacion: '2023-10-16',
            tamano: '345 KB',
            url: '/archivos/reporte_ver25_000524.xlsx'
        }
    ],
    'VER25-000523': [
        {
            id: '4',
            nombre: 'Pedimento_VER25-000523.pdf',
            tipo: 'pdf',
            categoria: 'Pedimentos',
            fechaCreacion: '2023-09-28',
            tamano: '1.1 MB',
            url: '/archivos/pedimento_ver25_000523.pdf'
        },
        {
            id: '5',
            nombre: 'Factura_VER25-000523.pdf',
            tipo: 'pdf',
            categoria: 'Facturas',
            fechaCreacion: '2023-09-28',
            tamano: '780 KB',
            url: '/archivos/factura_ver25_000523.pdf'
        },
        {
            id: '6',
            nombre: 'Documento_Transporte_VER25-000523.pdf',
            tipo: 'pdf',
            categoria: 'Otros',
            fechaCreacion: '2023-09-29',
            tamano: '950 KB',
            url: '/archivos/transporte_ver25_000523.pdf'
        },
        {
            id: '7',
            nombre: 'Fotos_Mercancia_VER25-000523.jpg',
            tipo: 'imagen',
            categoria: 'Otros',
            fechaCreacion: '2023-09-30',
            tamano: '2.5 MB',
            url: '/archivos/fotos_ver25_000523.jpg'
        }
    ]
};

// Lista de visualizaciones de archivos (mantener para compatibilidad)
const visualizaciones = [];

/**
 * Obtener archivos asociados a una referencia
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerArchivosPorReferencia = (req, res) => {
    // Verificar si el controlador FTP está disponible
    if (ftpController && ftpController.obtenerArchivosPorReferencia) {
        // Usar el nuevo sistema FTP
        return ftpController.obtenerArchivosPorReferencia(req, res);
    }
    
    // Lógica anterior como respaldo
    try {
        const { referenciaId } = req.params;
        
        console.log(`Obteniendo archivos para la referencia: ${referenciaId}`);
        
        // Simular obtención de archivos desde la BD
        const archivos = archivosMock[referenciaId] || [];
        
        res.status(200).json(archivos);
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({ 
            message: 'Error al obtener archivos de la referencia'
        });
    }
};

/**
 * Obtener categorías disponibles para los archivos
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerCategorias = (req, res) => {
    // Verificar si el controlador FTP está disponible
    if (ftpController && ftpController.obtenerCategorias) {
        // Usar el nuevo sistema FTP
        return ftpController.obtenerCategorias(req, res);
    }
    
    // Lógica anterior como respaldo
    try {
        // Categorías predefinidas
        const categorias = [
            { id: 1, nombre: 'Pedimentos' },
            { id: 2, nombre: 'Facturas' },
            { id: 3, nombre: 'Reportes' },
            { id: 4, nombre: 'Otros' }
        ];
        
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ 
            message: 'Error al obtener las categorías disponibles'
        });
    }
};

/**
 * Descargar un archivo específico
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const descargarArchivo = (req, res) => {
    // Verificar si el controlador FTP está disponible
    if (ftpController && ftpController.descargarArchivo) {
        // Usar el nuevo sistema FTP
        return ftpController.descargarArchivo(req, res);
    }
    
    // Lógica anterior como respaldo
    try {
        const { archivoId } = req.params;
        
        console.log(`Descargando archivo: ${archivoId}`);
        
        // Buscar el archivo en los datos mock
        let archivoEncontrado = null;
        
        for (const referencia in archivosMock) {
            const encontrado = archivosMock[referencia].find(a => a.id === archivoId);
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
        
        // En un entorno real, aquí buscaríamos el archivo físico
        // Para efectos de demostración, respondemos con un mensaje de éxito
        
        // Registrar descarga
        registrarVisualizacionArchivo(req.usuario, archivoEncontrado, 'descarga');
        
        res.status(200).json({ 
            message: 'Archivo listo para descarga',
            archivo: archivoEncontrado
        });
    } catch (error) {
        console.error('Error al descargar archivo:', error);
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
    // Verificar si el controlador FTP está disponible
    if (ftpController && ftpController.registrarVisualizacion) {
        // Usar el nuevo sistema FTP
        return ftpController.registrarVisualizacion(req, res);
    }
    
    // Lógica anterior como respaldo
    try {
        const { archivoId } = req.body;
        
        if (!archivoId) {
            return res.status(400).json({ 
                message: 'ID de archivo requerido' 
            });
        }
        
        // Buscar el archivo
        let archivoEncontrado = null;
        
        for (const referencia in archivosMock) {
            const encontrado = archivosMock[referencia].find(a => a.id === archivoId);
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
        
        // Registrar visualización
        registrarVisualizacionArchivo(req.usuario, archivoEncontrado, 'visualizacion');
        
        res.status(200).json({ 
            message: 'Visualización registrada correctamente' 
        });
    } catch (error) {
        console.error('Error al registrar visualización:', error);
        res.status(500).json({ 
            message: 'Error al registrar la visualización del archivo'
        });
    }
};

/**
 * Subir un archivo a una referencia
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const subirArchivo = (req, res) => {
    // Verificar si el controlador FTP está disponible
    if (ftpController && ftpController.subirArchivo) {
        // Usar el nuevo sistema FTP
        return ftpController.subirArchivo(req, res);
    }
    
    // Si no está disponible el controlador FTP, responder con error
    res.status(501).json({
        message: 'Funcionalidad de subida de archivos no implementada'
    });
};

/**
 * Función auxiliar para registrar visualizaciones y descargas (mantener para compatibilidad)
 * @param {Object} usuario - Información del usuario
 * @param {Object} archivo - Información del archivo
 * @param {string} tipo - Tipo de acción (visualizacion o descarga)
 */
const registrarVisualizacionArchivo = (usuario, archivo, tipo) => {
    visualizaciones.push({
        id: Date.now().toString(),
        archivoId: archivo.id,
        archivoNombre: archivo.nombre,
        tipo,
        fecha: new Date().toISOString(),
        usuario: {
            id: usuario?.id || 'invitado',
            nombre: usuario?.nombre || 'Usuario Invitado'
        },
        ip: usuario?.ip || '127.0.0.1'
    });
    
    console.log(`Registrada ${tipo} del archivo ${archivo.nombre} por ${usuario?.nombre || 'Usuario Invitado'}`);
};

module.exports = {
    obtenerArchivosPorReferencia,
    obtenerCategorias,
    descargarArchivo,
    registrarVisualizacion,
    subirArchivo // Añadido para soportar la nueva funcionalidad de subida
};
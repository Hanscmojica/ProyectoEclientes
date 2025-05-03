const express = require('express');
const { 
    obtenerArchivosPorReferencia, 
    obtenerCategorias, 
    descargarArchivo, 
    registrarVisualizacion 
} = require('../../controllers/bibliotecaController');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(validarJWT);

// Obtener archivos de una referencia específica
router.get('/archivos/:referenciaId', obtenerArchivosPorReferencia);

// Obtener categorías disponibles
router.get('/categorias', obtenerCategorias);

// Descargar un archivo específico
router.get('/descargar/:archivoId', descargarArchivo);

// Registrar visualización de archivo
router.post('/registrar-visualizacion', registrarVisualizacion);

module.exports = router; 
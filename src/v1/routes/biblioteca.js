const express = require('express');
const bibliotecaController = require('../../controllers/bibliotecaController');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(validarJWT);

// Obtener archivos de una referencia específica
router.get('/archivos/:referenciaId', bibliotecaController.obtenerArchivosPorReferencia);

// Obtener categorías disponibles
router.get('/categorias', bibliotecaController.obtenerCategorias);

// Descargar un archivo específico
router.get('/descargar/:archivoId', bibliotecaController.descargarArchivo);

// Registrar visualización de archivo
router.post('/registrar-visualizacion', bibliotecaController.registrarVisualizacion);

// Usar el controlador completo para evitar errores de referencia
// Comentamos esta línea que causa el error
// router.post('/subir', subirArchivo);

// Simplemente omitimos esta ruta temporalmente hasta resolver el problema
// o la implementamos así:
// router.post('/subir', (req, res) => {
//    res.status(501).json({ message: 'Funcionalidad en desarrollo' });
// });

module.exports = router;
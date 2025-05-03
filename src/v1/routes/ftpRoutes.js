// src/v1/routes/ftpRoutes.js
const express = require('express');
const router = express.Router();
const ftpController = require('../../controllers/ftpController');
const { validarJWT } = require('../../middlewares/validar-jwt');

// Todas las rutas requieren autenticación
router.use(validarJWT);

// Rutas de gestión de archivos
router.get('/archivos/:referenciaId', ftpController.obtenerArchivosPorReferencia);
router.get('/categorias', ftpController.obtenerCategorias);
router.post('/subir', ftpController.subirArchivo);
router.get('/descargar/:archivoId', ftpController.descargarArchivo);
router.post('/registrar-visualizacion', ftpController.registrarVisualizacion);

module.exports = router;
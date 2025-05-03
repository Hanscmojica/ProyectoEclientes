const express = require("express");
const router = express.Router();
const registroConsultaController = require("../../controllers/registroConsultaController");
const { validarJWT } = require("../../middlewares/validar-jwt");

// Todas las rutas requieren autenticación
router.use(validarJWT);

// Obtener historial de consultas del usuario autenticado
router.get("/historial", registroConsultaController.obtenerHistorialConsultas);

// Obtener estadísticas de consultas (para administradores)
router.get("/estadisticas", registroConsultaController.obtenerEstadisticasConsultas);

module.exports = router; 
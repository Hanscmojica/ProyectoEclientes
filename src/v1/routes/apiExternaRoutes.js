const express = require("express");
const router = express.Router();
const apiExternaController = require("../../controllers/apiExternaController");
const { validarJWT } = require("../../middlewares/validar-jwt");

// Todas las rutas requieren autenticación
router.use(validarJWT);

// Ruta para probar la conexión con SAGA
router.get("/probar-conexion", apiExternaController.probarConexion);

// Rutas para las referencias de SAGA
router.get("/referencias", apiExternaController.obtenerReferencias);
router.get("/referencias/buscar", apiExternaController.buscarReferencias);
router.get("/referencias/:id", apiExternaController.obtenerDetalleReferencia);

// Rutas para auditoría y trazabilidad
router.post("/referencias/registrar-consulta", apiExternaController.registrarConsulta);
router.get("/referencias/historial-consultas", apiExternaController.obtenerHistorialConsultas);

module.exports = router;

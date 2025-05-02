const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const apiExternaRoutes = require("./apiExternaRoutes");
const registroConsultaRoutes = require("./registroConsultaRoutes");

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de API externa
router.use("/apiExterna", apiExternaRoutes);

// Rutas de registro de consultas
router.use("/registroConsulta", registroConsultaRoutes);

module.exports = router; 
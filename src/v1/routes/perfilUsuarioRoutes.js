const express = require("express");
const router = express.Router();
const perfilUsuarioController = require("../../controllers/perfilUsuarioController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");

router
	.post("/",validarJWT,validarPerfil(['ADMINISTRADOR']),perfilUsuarioController.crearPerfilUsuario)
	.get("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), perfilUsuarioController.obtenerPerfilesPorIdUsuario)

module.exports = router;

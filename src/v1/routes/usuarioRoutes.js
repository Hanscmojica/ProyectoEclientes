const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/usuarioController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");
const { validarPermiso } = require("../../middlewares/validar-permiso");
const uploadImage = require('../../middlewares/uploadImageMiddleware');

// MIDLEWARE PERMISOS
// validarPermiso('USUARIOS', 'nLeer')

router
	.get("/",validarJWT,validarPerfil(['ADMINISTRADOR']),usuarioController.obtenerUsuarios)
	.post("/",
		validarJWT,
		validarPerfil(['ADMINISTRADOR']),
		uploadImage.single(
			'usuarioImagen',
		),
		usuarioController.crearUsuario)
	.get("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), usuarioController.obtenerUsuarioPorId)
	.put("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), usuarioController.editarUsuarioPorId)
	.delete("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), usuarioController.eliminarUsuarioPorId)
	
module.exports = router;

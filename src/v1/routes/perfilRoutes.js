const express = require("express");
const router = express.Router();
const perfilController = require("../../controllers/perfilController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");

router
	.post("/",validarJWT,validarPerfil(['ADMINISTRADOR']),perfilController.crearPerfil)
	.get("/",validarJWT,validarPerfil(['ADMINISTRADOR']), perfilController.consultarPerfiles)
	.get("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), perfilController.consultarPerfilPorId)
	.put("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), perfilController.editarPerfilPorId)
	.delete("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), perfilController.eliminarPerfilPorId)


module.exports = router;

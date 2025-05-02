const express = require("express");
const router = express.Router();
const permisoController = require("../../controllers/permisoController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");

router
	.post("/",validarJWT,validarPerfil(['ADMINISTRADOR']),permisoController.crearPermiso)
	.get("/",validarJWT,validarPerfil(['ADMINISTRADOR']), permisoController.consultarPermisos)
	.get("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), permisoController.consultarPermisoPorId)
	.put("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), permisoController.editarPermisoPorId)
	.delete("/:id",validarJWT,validarPerfil(['ADMINISTRADOR']), permisoController.eliminarPermisoPorId)

module.exports = router;

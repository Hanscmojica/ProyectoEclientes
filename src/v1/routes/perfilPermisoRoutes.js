const express = require("express");
const router = express.Router();
const perfilPermisoController = require("../../controllers/perfilPermisoController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");

router
	.post("/",validarJWT,validarPerfil(['ADMINISTRADOR']),perfilPermisoController.crearPerfilPermiso)
	// .get("/",permisoController.crearUsuario)
	// .get("/:id",validarJWT, permisoController.revalidarToken)
	// .put("/:id",validarJWT, permisoController.revalidarToken)
	// .delete("/:id",validarJWT, permisoController.revalidarToken)

module.exports = router;

const express = require("express");
const router = express.Router();
const imagesController = require("../../controllers/imagesController");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");
const upload = require('../../middlewares/uploadImageMiddleware');

router
	.get("/:nombre",validarJWT,validarPerfil(['ADMINISTRADOR']),imagesController.consultarImagenes)
	.post("/",
		validarJWT,validarPerfil(['ADMINISTRADOR']),
		upload.fields([
			{ name: 'imagen1', maxCount: 10 }, // múltiple
			{ name: 'imagen2', maxCount: 1 },
			{ name: 'imagen3', maxCount: 1 },
		  ]),
		imagesController.crearImagen)


module.exports = router;

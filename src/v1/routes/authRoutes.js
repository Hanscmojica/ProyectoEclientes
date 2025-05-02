const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const { validarJWT } = require("../../middlewares/validar-jwt");

router
	.post("/", authController.loginUsuario)
	.post("/new",authController.crearUsuario)
	.get("/renew",validarJWT, authController.revalidarToken)

module.exports = router;

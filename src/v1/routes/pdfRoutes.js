const express = require("express");
const router = express.Router();
const { validarJWT } = require("../../middlewares/validar-jwt");
const { validarPerfil } = require("../../middlewares/validar-perfil");
const pdfController = require("../../controllers/pdfController");
const upload = require('../../middlewares/uploadDocsMiddleware');

// Ruta para ver un PDF
router
  .get("/:nombre",validarJWT,validarPerfil(["ADMINISTRADOR"]),pdfController.verPdf)  
  .post("/",validarJWT,validarPerfil(["ADMINISTRADOR"]),upload.single('archivo'),pdfController.crearPdf)  

module.exports = router;
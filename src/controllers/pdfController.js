const path = require("path");
const fs = require("fs");

const verPdf = (req, res) => {
  const nombreArchivo = req.params.nombre;
  const ruta = path.join(__dirname, "../../public/pdfs", nombreArchivo);

  if (!fs.existsSync(ruta)) {
    return res.status(404).json({
      status: "Error",
      message: "PDF no encontrado",
    });
  }

  res.sendFile(ruta);
};

const crearPdf = (req, res) => {

  const {nombre} = req.body;
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "Error", message: "No se subió ningún archivo válido" });
  }

  res.json({
    status: 'Ok',
    message: 'Archivo subido exitosamente',
    url: `/docs/${req.file.filename}`,
    nombre: nombre
  });
};

module.exports = {
  verPdf,
  crearPdf,
};

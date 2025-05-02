const path = require("path");
const fs = require("fs");


const consultarImagenes = async (req, res) => {
  const nombreArchivo = req.params.nombre;

  try {
    const ruta = path.join(__dirname, "../../public/images/usuarios", nombreArchivo);

    // Verificar si el archivo existe
    if (!fs.existsSync(ruta)) {
      return res.status(404).json({ msg: "Imagen no encontrada" });
    }

    res.sendFile(ruta);
  } catch (error) {
    if (error.message) {
      res.status(400).send({
        status: "Error",
        message: error.message,
      });
    } else {
      res.status(500).send({
        status: "Error",
        message: "Error inesperado al obtener la imagen",
        message: error.message,
      });
    }
  }
};

const crearImagen = async (req, res) => {
  const archivosFile1 = req.files['imagen1'] || [];
  const archivoFile2 = req.files['imagen2']?.[0];
  const archivoFile3 = req.files['imagen3']?.[0];

  const getRutaPublica = (filePath) => {
    const relativePath = path.relative(path.join(__dirname, '../../public'), filePath);
    return `/public/${relativePath.replace(/\\/g, '/')}`;
  };

  const rutasDB = {
    imagen1: archivosFile1.map(file => getRutaPublica(file.path)),
    imagen2: archivoFile2 ? getRutaPublica(archivoFile2.path) : null,
    imagen3: archivoFile3 ? getRutaPublica(archivoFile3.path) : null
  };

  console.log('📦 Rutas para guardar en BD:', rutasDB);

  try {

    res.status(201).send({
      status: "Ok",
      message: "Usuario creado exitosamente",
      rutas: rutasDB
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message || "Error inesperado al crear el usuario",
    });
  }
}

module.exports = {
  consultarImagenes,
  crearImagen
};

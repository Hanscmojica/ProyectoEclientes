const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limita el tamaño del archivo a 5MB
  },
  fileFilter: function(req, file, cb) {
    if (file.mimetype!== 'image/jpeg' && file.mimetype!== 'image/png') {
      // Lanza un error personalizado para archivos no permitidos
      return cb('Archivo no permitido', false);
    }
    cb(undefined, true);
  }
  
}).array("images", 1)

module.exports = upload;

// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getDestinationPath = (fieldname) => {
  if (fieldname === 'imagen1') {
    return path.join(__dirname, '../../public/images/img1');
  }else if(fieldname === 'usuarioImagen'){
    return path.join(__dirname, '../../public/images/usuarios');
  }
  return path.join(__dirname, '../../public/images');
};

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = getDestinationPath(file.fieldname);
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

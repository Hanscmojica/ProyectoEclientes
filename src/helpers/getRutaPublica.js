const path = require("path");

  const getRutaPublica = (filePath) => {
    const relativePath = path.relative(path.join(__dirname, '../../public'), filePath);
    return `/public/${relativePath.replace(/\\/g, '/')}`;
  };

  module.exports = {
    getRutaPublica
}

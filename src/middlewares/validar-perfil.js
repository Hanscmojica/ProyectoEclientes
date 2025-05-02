const { response } = require("express");
const jwt = require("jsonwebtoken");
const usuarioService = require("../services/usuarioService")

const validarPerfil = (perfilesPermitidos = []) => {
  return async (req, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token en la petición",
      });
    }

    try {
      const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
      req.uid = uid;
      req.name = name;

      const { perfil } = await usuarioService.obtenerPerfilUsuario(uid);

      if (!perfil.some(p => perfilesPermitidos.includes(p))) {
        return res.status(403).json({
          ok: false,
          msg: "Acceso denegado: perfil no autorizado",
        });
      }

      next();
    } catch (error) {
      console.error("Error al validar token:", error.message);
      return res.status(403).json({
        ok: false,
        msg: "Token no válido",
      });
    }
  };
};

module.exports = {
  validarPerfil
};

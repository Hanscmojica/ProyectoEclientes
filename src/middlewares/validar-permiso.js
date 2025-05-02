const { response } = require("express");
const jwt = require("jsonwebtoken");
const usuarioService = require("../services/usuarioService")

const validarPermiso = (modulo, accion) => {
  return async (req, res, next) => {
    try {
      const { uid } = req;
      const permisos = await usuarioService.obtenerPermisosUsuario(uid);

      const permiso = permisos.find(p => p.sModulo === modulo);

      if (!permiso || permiso[accion] !== true) {
        return res.status(403).json({
          ok: false,
          msg: `Permiso denegado para ${accion} en módulo ${modulo}`,
        });
      }

      next();
    } catch (error) {
      console.error("Error al validar permiso:", error);
      return res.status(500).json({
        ok: false,
        msg: "Error interno al validar permisos",
      });
    }
  };
};

module.exports = {
  validarPermiso
};

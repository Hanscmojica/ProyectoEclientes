const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = async (req, res = response, next) => {
  // x-token headers
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

    // const usuario = await Usuario.findOne({ _id: uid, is_delete: false });

    // if (usuario.rol !== "3") {
    //   return res.status(401).json({
    //     ok: false,
    //     msg: "No tienes acceso",
    //   });
    // }


  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = {
  validarJWT,
};

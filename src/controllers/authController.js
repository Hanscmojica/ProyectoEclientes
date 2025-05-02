const authService = require("../services/authService")

const crearUsuario = async (req,res) => {

    const {sNombre,sApellidoPaterno,sApellidoMaterno,sUsuario,sEmail,sPassword} = req.body;

    try {

        const { user, token } = await authService.newUsuario(sNombre,sApellidoPaterno,sApellidoMaterno,sUsuario,sEmail,sPassword );
        
        res.status(201).send({
            status: "Ok",
            message: "Usuario creado exitosamente",
            data: {
                user: user.sName,
                token: token,
            },
        });
    } catch (error) {
        // Si el error es por correo ya registrado
        if (error.message) {
            res.status(400).send({
                status: "Error",
                message: error.message,
            });
        } else {
            // Manejo de otros tipos de errores
            res.status(500).send({
                status: "Error",
                message: "Error inesperado al crear el usuario",
                message: error.message,

            });
        }
    }
}

const revalidarToken = async (req, res = response) => {

    const tokenObtenido = req.header("x-token");

    const { uid,token,perfil } = await authService.revalidarToken(tokenObtenido);

    res.json({
      ok: true,
      id: uid,
      perfil,
      token,
    });
};
  
  // LOGIN
const loginUsuario = async (req, res = response) => {

    const { sEmail, sPassword } = req.body;
  
    try {

    const { uid,token,perfil } = await authService.loginUsuario(sEmail,sPassword);

      res.json({
        ok: true,
        id: uid,
        perfil,
        token,
      });
    }  catch (error) {
      // Si el error es por correo ya registrado
      
      if (error.message) {
          res.status(400).send({
              status: "Error",
              message: error.message,
          });
      } else {
          // Manejo de otros tipos de errores
          res.status(500).send({
              status: "Error",
              message: "Error inesperado al crear el permiso",
              message: error.message,

          });
      }
  }
  };


module.exports = {
    crearUsuario,
    revalidarToken,
    loginUsuario
}
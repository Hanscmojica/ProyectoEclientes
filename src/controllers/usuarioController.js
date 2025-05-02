const usuarioService = require("../services/usuarioService")
const {toInt} = require("../helpers/toInt")
const {getRutaPublica} = require("../helpers/getRutaPublica")

const obtenerUsuarios = async (req,res) => {

    const { sNombre, page = 1, limit = 5 } = req.query;

    const filtros = {
      sNombre,
      page: parseInt(page),
      limit: parseInt(limit),
    };

  try {
    const data = await usuarioService.obtenerUsuarios(filtros);

    res.status(201).send({
      status: "Ok",
      message: "Usuarios obtenidos correctamente",
      data,
    });
  } catch (error) {
    if (error.message) {
      res.status(400).send({
        status: "Error",
        message: error.message,
      });
    } else {
      res.status(500).send({
        status: "Error",
        message: "Error inesperado al obtener los usuarios",
        message: error.message,
      });
    }
  }
}

const crearUsuario = async (req,res) => {

    const {sNombre,sApellidoPaterno,sApellidoMaterno,sUsuario,sEmail,sPassword} = req.body;
    const archivoFile2 = req.file;
    
    const usuarioImagen = archivoFile2 ? getRutaPublica(archivoFile2.path) : null

    try {
        const data = await usuarioService.crearUsuario(sNombre,sApellidoPaterno,sApellidoMaterno,sUsuario,sEmail,sPassword,usuarioImagen);
        
        res.status(201).send({
            status: "Ok",
            message: "Usuario creado exitosamente",
            // data,
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

const obtenerUsuarioPorId = async (req,res) => {
    try {
        const id = toInt(req.params.id)
        const data = await usuarioService.obtenerUsuarioPorId(id);
        
        res.status(201).send({
            status: "Ok",
            message: "Usuario obtenidos correctamente",
            data,    
        });

    } catch (error) {
        if (error.message) {
            res.status(400).send({
                status: "Error",
                message: error.message,
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: "Error inesperado al obtener el usuario",
                message: error.message,

            });
        }
    }
}

const eliminarUsuarioPorId = async (req,res) => {
    try {
        const id = toInt(req.params.id)
        const data = await usuarioService.eliminarUsuarioPorId(id);
        
        res.status(201).send({
            status: "Ok",
            message: "Usuario eliminado correctamente",
            data,
        });

    } catch (error) {
        if (error.message) {
            res.status(400).send({
                status: "Error",
                message: error.message,
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: "Error inesperado al eliminar el usuario",
                message: error.message,

            });
        }
    }
}

const editarUsuarioPorId = async (req,res) => {
    try {
        const id = toInt(req.params.id);
        const data = req.body;

        const permiso = await usuarioService.editarUsuarioPorId(id,data);
        
        res.status(201).send({
            status: "Ok",
            message: "Usuario editado correctamente",
            data: {
                permiso,    
            },
        });

    } catch (error) {
        if (error.message) {
            res.status(400).send({
                status: "Error",
                message: error.message,
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: "Error inesperado al editadar el usuario",
                message: error.message,

            });
        }
    }
}


module.exports = {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    editarUsuarioPorId
}
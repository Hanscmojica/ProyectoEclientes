const perfilPermisoService = require("../services/perfilPermisoService")

const crearPerfilPermiso = async (req,res) => {

    const {idPermiso,idPerfil} = req.body;

    try {

        const { perfilPermiso } = await perfilPermisoService.nuevoPerfilPermiso(idPermiso,idPerfil);
        
        res.status(201).send({
            status: "Ok",
            message: "Asignación creado exitosamente",
            data: {
                perfilPermiso,
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
                message: "Error inesperado al crear la asignación",
                message: error.message,

            });
        }
    }
}


module.exports = {
    crearPerfilPermiso,
}
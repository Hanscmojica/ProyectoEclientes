const { getPrisma } = require("../database/prisma");

const prisma = getPrisma(); 

const nuevoPerfilPermiso = async (nId03Permiso,nId02Perfil) => {

    let perfilPorPermiso = await prisma.BP_05_PERFIL_PERMISO.findFirst({
        where: {
          AND: [
            { nId03Permiso: nId03Permiso },
            { nId02Perfil: nId02Perfil },
          ],
        },
      });
    
    if (perfilPorPermiso) {
      throw new Error("La asignación ya está registrado.");
    }

    // Crear el usuario en la base de datos
    const nuevoPerfilPermiso = await prisma.BP_05_PERFIL_PERMISO.create({
        data: {
            nId03Permiso: nId03Permiso,
            nId02Perfil: nId02Perfil,
        },
    });

    return {
        perfilPermiso: {
            nId03Permiso: nuevoPerfilPermiso.nId03Permiso,
            nId02Perfil: nuevoPerfilPermiso.nId02Perfil
        }
    };
}

module.exports = {
    nuevoPerfilPermiso
}
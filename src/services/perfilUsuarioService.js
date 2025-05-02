const { getPrisma } = require("../database/prisma");

const prisma = getPrisma();

const asignarPerfilesUsuario = async (nId01Usuario, nId02Perfiles) => {
  const asignados = [];
  const omitidos = [];

  // 1. Obtener las relaciones actuales entre el usuario y los perfiles
  const perfilesExistentes = await prisma.BP_04_PERFIL_USUARIO.findMany({
    where: {
      nId01Usuario: nId01Usuario,
    },
  });

  const perfilesExistentesIds = perfilesExistentes.map((perfil) => perfil.nId02Perfil);

  // 2. Eliminar las relaciones que ya no están en el nuevo arreglo
  const perfilesAEliminar = perfilesExistentesIds.filter(
    (id) => !nId02Perfiles.includes(id)
  );

  // Eliminar relaciones que no están en el nuevo arreglo de perfiles
  if (perfilesAEliminar.length > 0) {
    await prisma.BP_04_PERFIL_USUARIO.deleteMany({
      where: {
        nId01Usuario: nId01Usuario,
        nId02Perfil: {
          in: perfilesAEliminar,
        },
      },
    });
  }

  // 3. Asignar los perfiles nuevos
  for (const nId02Perfil of nId02Perfiles) {
    const perfilExistente = await prisma.BP_04_PERFIL_USUARIO.findFirst({
      where: {
        AND: [
          { nId01Usuario: nId01Usuario },
          { nId02Perfil: nId02Perfil },
        ],
      },
    });

    if (perfilExistente) {
      omitidos.push(nId02Perfil);
      continue; // Omite este perfil si ya está asignado
    }

    // Si no existe, lo creamos
    const nuevoPerfilUsuario = await prisma.BP_04_PERFIL_USUARIO.create({
      data: {
        nId01Usuario,
        nId02Perfil,
      },
    });

    asignados.push(nuevoPerfilUsuario); // Agregar al listado de asignados
  }

  return {
    asignados,
    omitidos,
    total: {
      solicitados: nId02Perfiles.length,
      asignados: asignados.length,
      omitidos: omitidos.length,
      eliminados: perfilesAEliminar.length,
    },
  };
};

const obtenerPerfilesPorIdUsuario = async(id) =>{

  const usuario = await prisma.bP_01_USUARIO.findUnique({
    where:{
      nId01Usuario:id
    }
  })

  if(!usuario || usuario.length==0){
    throw new Error("No existe el usuario");
  }

  const perfiles = await prisma.bP_04_PERFIL_USUARIO.findMany({
    where:{
      nId01Usuario: id
    },
    select:{
      nId04PerfilUsuario:true,
      nId01Usuario:true,
      nId02Perfil:true,
      perfil: {
        select:{
          sNombre:true
        }
      }
    }
  })

  if(!perfiles || perfiles.length==0){
    return ("Sin perfiles asignados");
  }

  return perfiles;
};

module.exports = {
  asignarPerfilesUsuario,
  obtenerPerfilesPorIdUsuario
};

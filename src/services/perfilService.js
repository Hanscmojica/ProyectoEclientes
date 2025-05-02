const { getPrisma } = require("../database/prisma");

const prisma = getPrisma();

// CREAR PERFIL
const nuevoPerfil = async (sNombre, sDescripcion) => {
  let perfilPorNombre = await prisma.BP_02_PERFIL.findFirst({
    where: {
      sNombre: sNombre,
    },
  });

  if (perfilPorNombre) {
    throw new Error("El perfil ya está registrado.");
  }

  // Crear el usuario en la base de datos
  const nuevoPerfil = await prisma.BP_02_PERFIL.create({
    data: {
      sNombre: sNombre,
      sDescripcion: sDescripcion,
    },
  });

  return {
    id: nuevoPerfil.nId02Perfil,
    nombre: nuevoPerfil.sNombre,
  };
};

//OBTENER TODOS LOS perfiles
const obtenerPerfiles = async ({ sNombre, page, limit }) => {
  const where = {};

  if (sNombre) {
    where.sNombre = {
      contains: sNombre,
    };
  }

  const skip = (page - 1) * limit;

  const [total, perfiles] = await Promise.all([
    prisma.BP_02_PERFIL.count({ where }),
    prisma.BP_02_PERFIL.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        nId02Perfil: "asc",
      },
    }),
  ]);

  if (!perfiles || perfiles.length == 0) {
    throw new Error("No existen perfiles registrados ");
  }

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    perfiles,
  };
};

//OBTENER PERFIL POR ID
const obtenerPerfilPorId = async (id) => {
  const perfil = await prisma.BP_02_PERFIL.findUnique({
    where: {
      nId02Perfil: id,
    },
  });

  if (!perfil) {
    throw new Error("No existe el perfil con ese Id");
  }

  return perfil;
};

//EDITAR PERFIL POR ID
const editarPerfilPorId = async (id, data) => {
  const perfilExistente = await prisma.BP_02_PERFIL.findUnique({
    where: { nId02Perfil: id },
  });

  if (!perfilExistente) {
    throw new Error("No existe el perfil");
  }

  const perfilActualizado = await prisma.BP_02_PERFIL.update({
    where: {
      nId02Perfil: id,
    },
    data: {
      sDescripcion: data.sDescripcion, // Asegúrate de que 'data' tenga ese campo
    },
    select: {
      sNombre: true,
      sDescripcion: true,
    },
  });

  return perfilActualizado;
};

//ELIMINAR PERFIL POR ID
const eliminarPerfilPorId = async (id) => {
  const perfilExistente = await prisma.BP_02_PERFIL.findUnique({
    where: { nId02Perfil: id },
  });

  if (!perfilExistente) {
    throw new Error("No existe el perfil");
  }

  const perfilEliminado = await prisma.BP_02_PERFIL.delete({
    where: {
      nId02Perfil: id,
    },
    select: {
      sNombre: true,
      sDescripcion: true,
    },
  });

  return perfilEliminado;
};

module.exports = {
  nuevoPerfil,
  obtenerPerfiles,
  obtenerPerfilPorId,
  editarPerfilPorId,
  eliminarPerfilPorId,
};

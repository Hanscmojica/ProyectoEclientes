const { getPrisma } = require("../database/prisma");
const bcrypt = require("bcryptjs");

const prisma = getPrisma();

// OBTENER NOMBRES COMPLETOS
function agregarNombreCompleto(usuarios) {
  return usuarios.map((usuario) => ({
    ...usuario,
    sNombreCompleto: obtenerNombreCompleto(usuario),
  }));
}

function obtenerNombreCompleto(usuario) {
  return `${usuario.sNombre} ${usuario.sApellidoPaterno} ${usuario.sApellidoMaterno}`;
}

const obtenerUsuarios = async ({ sNombre, page, limit }) => {

  const where = {};

  if (sNombre) {
    where.sNombre = {
      contains: sNombre,
    };
  }

  const skip = (page - 1) * limit;

  const [total, usuariosObtenidos] = await Promise.all([
    prisma.bP_01_USUARIO.count({ where }),
    prisma.bP_01_USUARIO.findMany({
      where,
      select:{
        nId01Usuario:true,
        sNombre: true,
        sApellidoPaterno: true,
        sApellidoMaterno: true,
        sUsuario: true,
        sEmail: true,
        sUsuarioImg: true,
        bActivo: true,
        dFechaCreacion: true,
      },
      skip,
      take: limit,
      orderBy: {
        nId01Usuario: "asc",
      },
    }),
  ]);

  if (!usuariosObtenidos || usuariosObtenidos.length == 0) {
    throw new Error("No existen usuarios registrados ");
  }

  const usuarios = agregarNombreCompleto(usuariosObtenidos);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    usuarios
  };
};

//OBTENER PERMISO POR ID
const obtenerUsuarioPorId = async (id) => {
  const usuarioObtenido = await prisma.bP_01_USUARIO.findUnique({
    where: {
      nId01Usuario: id,
    },
    select: {
      nId01Usuario:true,
      sNombre: true,
      sApellidoPaterno: true,
      sApellidoMaterno: true,
      sEmail: true,
      dFechaCreacion: true,
      bActivo: true,
      sUsuario: true,
    },
  });

  if (!usuarioObtenido) {
    throw new Error("No existe el usuario");
  }

  return usuarioObtenido;
};

const obtenerPerfilUsuario = async (id) => {
  const usuario = await prisma.BP_01_USUARIO.findFirst({
    where: {
      nId01Usuario: id,
    },
    include: {
      perfilesUsuario: {
        include: {
          perfil: {
            select: {
              sNombre: true,
              sDescripcion: true, // Puedes agregar más campos si lo necesitas
            },
          },
        },
      },
    },
  });

  const perfilNombres = usuario.perfilesUsuario.map(
    (item) => item.perfil.sNombre
  );

  return {
    perfil: perfilNombres,
  };
};

const obtenerPermisosUsuario = async (id) => {
  // Obtener el perfil del usuario
  const perfil = await prisma.BP_04_PERFIL_USUARIO.findFirst({
    where: {
      nId01Usuario: id,
    },
  });

  if (!perfil) return [];

  // Obtener todos los permisos asociados al perfil
  const permisos = await prisma.bP_05_PERFIL_PERMISO.findMany({
    where: {
      nId02Perfil: perfil.nId02Perfil,
    },
    include: {
      permiso: true, // esto incluye los datos del permiso desde la tabla relacionada
    },
  });

  // Retornar una lista de permisos ya lista para validar
  return permisos.map((p) => ({
    sModulo: p.permiso.sNombre,
    nLeer: p.nLeer,
    nCrear: p.nCrear,
    nEditar: p.nEditar,
    nBorrar: p.nBorrar,
  }));
};

const crearUsuario = async (
  sNombre,
  sApellidoPaterno,
  sApellidoMaterno,
  sUsuario,
  sEmail,
  sPassword,
  usuarioImagen
) => {
  let usuarioPorEmail = await prisma.BP_01_USUARIO.findFirst({
    where: {
      sEmail: sEmail,
    },
  });

  if (usuarioPorEmail) {
    throw new Error("El correo electrónico ya está registrado.");
  }

  let usuarioPorUsuario = await prisma.BP_01_USUARIO.findFirst({
    where: {
      sUsuario: sUsuario,
    },
  });

  if (usuarioPorUsuario) {
    throw new Error("El nombre de usuario ya está registrado.");
  }

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  const newPassword = bcrypt.hashSync(sPassword, salt);

  // Crear el usuario en la base de datos
  const newUser = await prisma.BP_01_USUARIO.create({
    data: {
      sNombre: sNombre,
      sApellidoPaterno: sApellidoPaterno,
      sApellidoMaterno: sApellidoMaterno,
      sUsuario: sUsuario,
      sEmail: sEmail,
      sPassword: newPassword,
      sUsuarioImg: usuarioImagen || null, 
    },
    select: {
      sNombre: true,
      sEmail: true,
    },
  });

  return {
    user: newUser,
  };
};

const eliminarUsuarioPorId = async (id) => {
  const usuarioExistente = await prisma.BP_01_USUARIO.findUnique({
    where: { nId01Usuario: id },
  });

  if (!usuarioExistente) {
    throw new Error("No existe el usuario");
  }

  const usuarioEliminado = await prisma.BP_01_USUARIO.delete({
    where: {
      nId01Usuario: id,
    },
    select: {
      sNombre: true,
    },
  });

  return usuarioEliminado;
};

//EDITAR USUARIO POR ID
const editarUsuarioPorId = async (id, data) => {
  const usuarioExistente = await prisma.bP_01_USUARIO.findUnique({
    where: { nId01Usuario: id },
  });

  if (!usuarioExistente) {
    throw new Error("No existe el usuario");
  }

  const usuarioActualizado = await prisma.bP_01_USUARIO.update({
    where: {
      nId01Usuario: id,
    },
    data: {
      sNombre: data.sNombre,
      sApellidoPaterno: data.sApellidoPaterno, // Asegúrate de que 'data' tenga ese campo
      sApellidoMaterno: data.sApellidoMaterno,
    },
    select: {
      sNombre: true,
      sApellidoPaterno: true,
      sApellidoMaterno: true,
    },
  });

  return usuarioActualizado;
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerPerfilUsuario,
  obtenerPermisosUsuario,
  crearUsuario,
  eliminarUsuarioPorId,
  editarUsuarioPorId,
};

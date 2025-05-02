const { getPrisma } = require("../database/prisma");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

const prisma = getPrisma(); 

const newUsuario = async (sNombre,sApellidoPaterno,sApellidoMaterno,sUsuario,sEmail,sPassword) => {

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
        },
    });

    // Generar JWT
    const token = await generarJWT(newUser.nId01Usuario, newUser.sNombre);
    
    return {
        user: newUser,
        token,
    };
}

const revalidarToken = async (tokenObtenido) => {

    // AGREGAR SERVICIO
    const { uid, nombre } = jwt.verify(
      tokenObtenido,
      process.env.SECRET_JWT_SEED
    );

    const usuario = await prisma.BP_01_USUARIO.findFirst({
      where: {
        nId01Usuario: uid,
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

    const token = await generarJWT(uid, nombre);
    
    const perfilNombres = usuario.perfilesUsuario.map(item => item.perfil.sNombre);

    return {
      uid: usuario.nId01Usuario,
      perfil: perfilNombres, // Aquí tienes solo los nombres de los perfiles
      token,
    };
}

const loginUsuario = async (sEmail,sPassword) => {

    const usuario = await prisma.BP_01_USUARIO.findFirst({
      where: {
        sEmail: sEmail,
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

      if (!usuario) {
        throw new Error("El usuario no existe con ese email");
      }
      // Confirmar los passwords
      const validPassword = bcrypt.compareSync(sPassword, usuario.sPassword);

      if (!validPassword) {
        throw new Error("Contraseña incorrecto");
      }
      
      const token = await generarJWT(usuario.nId01Usuario, usuario.sName);

      const perfilNombres = usuario.perfilesUsuario.map(item => item.perfil.sNombre);

      return {
        uid: usuario.nId01Usuario,
        perfil: perfilNombres, // Aquí tienes solo los nombres de los perfiles
        token,
      };
}
module.exports = {
    newUsuario,
    revalidarToken,
    loginUsuario
}
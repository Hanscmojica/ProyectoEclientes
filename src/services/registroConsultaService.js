const { getPrisma } = require("../database/prisma");

const prisma = getPrisma();

/**
 * Registrar una consulta de referencias
 * @param {number} nId01Usuario - ID del usuario que realiza la consulta
 * @param {string} sFolioReferencia - Folio de la referencia consultada
 * @param {string} sTipoConsulta - Tipo de consulta (LISTAR, DETALLE, BUSQUEDA)
 * @param {boolean} bExito - Si la consulta fue exitosa
 * @param {string} sError - Mensaje de error en caso de falla
 * @param {string} sDetalleConsulta - Detalles adicionales de la consulta
 * @param {string} sIpUsuario - IP del usuario para auditoría
 * @returns {Promise<Object>} - Objeto de registro de consulta creado
 */
const registrarConsulta = async (
  nId01Usuario,
  sFolioReferencia,
  sTipoConsulta,
  bExito = true,
  sError = null,
  sDetalleConsulta = null,
  sIpUsuario = null
) => {
  try {
    const registroConsulta = await prisma.BP_06_REGISTRO_CONSULTA.create({
      data: {
        nId01Usuario,
        sFolioReferencia,
        sTipoConsulta,
        bExito,
        sError,
        sDetalleConsulta,
        sIpUsuario,
      },
    });

    return registroConsulta;
  } catch (error) {
    console.error("Error al registrar consulta:", error);
    // No lanzamos el error para que no interrumpa el flujo principal
    return null;
  }
};

/**
 * Obtener historial de consultas de un usuario
 * @param {number} nId01Usuario - ID del usuario
 * @param {number} limite - Límite de registros a obtener
 * @param {number} pagina - Número de página
 * @returns {Promise<Array>} - Array de registros de consulta
 */
const obtenerHistorialConsultas = async (nId01Usuario, limite = 20, pagina = 1) => {
  try {
    const skip = (pagina - 1) * limite;
    
    const total = await prisma.BP_06_REGISTRO_CONSULTA.count({
      where: {
        nId01Usuario,
      },
    });
    
    const consultas = await prisma.BP_06_REGISTRO_CONSULTA.findMany({
      where: {
        nId01Usuario,
      },
      orderBy: {
        dFechaConsulta: "desc",
      },
      skip,
      take: limite,
    });

    return {
      consultas,
      total,
      pagina,
      limite,
      paginas: Math.ceil(total / limite),
    };
  } catch (error) {
    console.error("Error al obtener historial de consultas:", error);
    throw new Error("Error al obtener historial de consultas");
  }
};

/**
 * Obtener estadísticas de consultas
 * @param {Date} fechaInicio - Fecha de inicio del período
 * @param {Date} fechaFin - Fecha de fin del período
 * @returns {Promise<Object>} - Estadísticas de consultas
 */
const obtenerEstadisticasConsultas = async (fechaInicio, fechaFin) => {
  try {
    const totalConsultas = await prisma.BP_06_REGISTRO_CONSULTA.count({
      where: {
        dFechaConsulta: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    const consultasExitosas = await prisma.BP_06_REGISTRO_CONSULTA.count({
      where: {
        dFechaConsulta: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        bExito: true,
      },
    });

    const consultasFallidas = await prisma.BP_06_REGISTRO_CONSULTA.count({
      where: {
        dFechaConsulta: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        bExito: false,
      },
    });

    const consultasPorTipo = await prisma.BP_06_REGISTRO_CONSULTA.groupBy({
      by: ["sTipoConsulta"],
      where: {
        dFechaConsulta: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      _count: {
        sTipoConsulta: true,
      },
    });

    return {
      totalConsultas,
      consultasExitosas,
      consultasFallidas,
      consultasPorTipo,
      tasaExito: totalConsultas > 0 ? (consultasExitosas / totalConsultas) * 100 : 0,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas de consultas:", error);
    throw new Error("Error al obtener estadísticas de consultas");
  }
};

module.exports = {
  registrarConsulta,
  obtenerHistorialConsultas,
  obtenerEstadisticasConsultas,
}; 
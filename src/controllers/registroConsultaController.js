const registroConsultaService = require("../services/registroConsultaService");
const { response } = require("express");
const jwt = require("jsonwebtoken");

/**
 * Obtener el historial de consultas del usuario autenticado
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerHistorialConsultas = async (req, res = response) => {
  try {
    const { limite = 20, pagina = 1 } = req.query;
    
    // Obtener el token del usuario
    const token = req.header("x-token");
    
    if (!token) {
      return res.status(401).json({
        message: "No hay token en la petición",
      });
    }
    
    // Verificar el token para obtener el ID del usuario
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    
    const historial = await registroConsultaService.obtenerHistorialConsultas(
      uid,
      parseInt(limite),
      parseInt(pagina)
    );
    
    res.status(200).json(historial);
  } catch (error) {
    console.error("Error al obtener historial de consultas:", error);
    
    res.status(500).json({
      message: "Error al obtener historial de consultas",
    });
  }
};

/**
 * Obtener estadísticas de consultas (para administradores)
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerEstadisticasConsultas = async (req, res = response) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Las fechas de inicio y fin son requeridas",
      });
    }
    
    const estadisticas = await registroConsultaService.obtenerEstadisticasConsultas(
      new Date(fechaInicio),
      new Date(fechaFin)
    );
    
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas de consultas:", error);
    
    res.status(500).json({
      message: "Error al obtener estadísticas de consultas",
    });
  }
};

module.exports = {
  obtenerHistorialConsultas,
  obtenerEstadisticasConsultas,
}; 
const axios = require('axios');
const { registrarConsulta } = require('../services/registroConsultaService');
const jwt = require('jsonwebtoken');

// Base URL para la API de SAGA
const SAGA_API_URL = 'https://rodall.com:444/SagaWS.NetEnvironmet/rest/sagaWSRef';

/**
 * Obtener referencias de SAGA
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerReferencias = async (req, res) => {
  try {
    console.log('Obteniendo referencias de SAGA...');
    
    // Obtener el token del usuario desde la petición
    const token = req.header('x-token');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No hay token en la petición'
      });
    }
    
    // Obtener el ID del usuario a partir del token
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    
    // Llamar a la API de SAGA 
    const respuesta = await axios.get(`${SAGA_API_URL}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Respuesta de SAGA recibida');
    
    // Registrar la consulta exitosa
    registrarConsulta(
      uid,
      'TODAS', // Folio especial para listar todas las referencias
      'LISTAR',
      true,
      null,
      'Consulta de todas las referencias',
      req.ip
    );
    
    // Devolver las referencias 
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener referencias de SAGA:', error);
    
    // Intentar obtener el ID del usuario para registrar el error
    let userId = null;
    try {
      const token = req.header('x-token');
      if (token) {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        userId = uid;
      }
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
    
    // Registrar la consulta fallida si se pudo obtener el ID
    if (userId) {
      registrarConsulta(
        userId,
        'TODAS',
        'LISTAR',
        false,
        error.response ? error.response.data.message : error.message,
        'Error al obtener referencias',
        req.ip
      );
    }
    
    // Devolver mensaje de error específico si está disponible
    if (error.response) {
      console.log('Error de respuesta:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data.message || 'Error en la API de SAGA'
      });
    }
    
    // Error general
    res.status(500).json({
      message: 'Error al conectar con el servicio de SAGA'
    });
  }
};

/**
 * Obtener detalle de una referencia de SAGA
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerDetalleReferencia = async (req, res) => {
  try {
    // Obtener el ID de la referencia desde los parámetros
    const { id } = req.params;
    
    console.log(`Obteniendo detalle de referencia: ${id}`);
    
    // Obtener el token del usuario desde la petición
    const token = req.header('x-token');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No hay token en la petición'
      });
    }
    
    // Obtener el ID del usuario a partir del token
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    
    // Llamar a la API de SAGA
    const respuesta = await axios.get(`${SAGA_API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Detalle de referencia recibido');
    
    // Registrar la consulta exitosa
    registrarConsulta(
      uid,
      id,
      'DETALLE',
      true,
      null,
      `Consulta de detalle de referencia ${id}`,
      req.ip
    );
    
    // Devolver el detalle de la referencia
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener detalle de referencia de SAGA:', error);
    
    // Intentar obtener el ID del usuario para registrar el error
    let userId = null;
    let referenciaId = req.params.id || 'N/A';
    
    try {
      const token = req.header('x-token');
      if (token) {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        userId = uid;
      }
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
    
    // Registrar la consulta fallida si se pudo obtener el ID
    if (userId) {
      registrarConsulta(
        userId,
        referenciaId,
        'DETALLE',
        false,
        error.response ? error.response.data.message : error.message,
        `Error al obtener detalle de referencia ${referenciaId}`,
        req.ip
      );
    }
    
    // Devolver mensaje de error específico si está disponible
    if (error.response) {
      console.log('Error de respuesta:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data.message || 'Error en la API de SAGA'
      });
    }
    
    // Error general
    res.status(500).json({
      message: 'Error al conectar con el servicio de SAGA'
    });
  }
};

/**
 * Buscar referencias en SAGA
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const buscarReferencias = async (req, res) => {
  try {
    // Obtener el término de búsqueda desde la consulta
    const { termino } = req.query;
    
    console.log(`Buscando referencias con término: ${termino}`);
    
    if (!termino) {
      return res.status(400).json({
        message: 'El término de búsqueda es requerido'
      });
    }
    
    // Obtener el token del usuario desde la petición
    const token = req.header('x-token');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No hay token en la petición'
      });
    }
    
    // Obtener el ID del usuario a partir del token
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    
    // Llamar a la API de SAGA
    const respuesta = await axios.get(`${SAGA_API_URL}/buscar?termino=${termino}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Resultados de búsqueda recibidos');
    
    // Registrar la consulta exitosa
    registrarConsulta(
      uid,
      termino,
      'BUSQUEDA',
      true,
      null,
      `Búsqueda de referencias con término: ${termino}`,
      req.ip
    );
    
    // Devolver los resultados de la búsqueda
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al buscar referencias en SAGA:', error);
    
    // Intentar obtener el ID del usuario para registrar el error
    let userId = null;
    let terminoBusqueda = req.query.termino || 'N/A';
    
    try {
      const token = req.header('x-token');
      if (token) {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        userId = uid;
      }
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
    
    // Registrar la consulta fallida si se pudo obtener el ID
    if (userId) {
      registrarConsulta(
        userId,
        terminoBusqueda,
        'BUSQUEDA',
        false,
        error.response ? error.response.data.message : error.message,
        `Error al buscar referencias con término: ${terminoBusqueda}`,
        req.ip
      );
    }
    
    // Devolver mensaje de error específico si está disponible
    if (error.response) {
      console.log('Error de respuesta:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data.message || 'Error en la API de SAGA'
      });
    }
    
    // Error general
    res.status(500).json({
      message: 'Error al conectar con el servicio de SAGA'
    });
  }
};

/**
 * Probar la conexión con SAGA
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const probarConexion = async (req, res) => {
  try {
    // Obtener el token del usuario desde la petición
    const token = req.header('x-token');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No hay token en la petición'
      });
    }
    
    // Realizar una petición de prueba a la API de SAGA
    await axios.get(`${SAGA_API_URL}/estado`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000 // 5 segundos de timeout
    });
    
    // Si llegamos aquí, la conexión es exitosa
    res.status(200).json({
      estado: 'conectado',
      mensaje: 'Conexión exitosa con SAGA'
    });
  } catch (error) {
    console.error('Error al probar conexión con SAGA:', error);
    
    res.status(503).json({
      estado: 'desconectado',
      mensaje: 'No se pudo establecer conexión con SAGA'
    });
  }
};

module.exports = {
  obtenerReferencias,
  obtenerDetalleReferencia,
  buscarReferencias,
  probarConexion
};
  
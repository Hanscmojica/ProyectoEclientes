const axios = require('axios');

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
    
    // Llamar a la API de SAGA 
    const respuesta = await axios.get(`${SAGA_API_URL}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Respuesta de SAGA recibida');
    
    // Devolver las referencias 
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener referencias de SAGA:', error);
    
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
    
    // Llamar a la API de SAGA
    const respuesta = await axios.get(`${SAGA_API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Detalle de referencia recibido');
    
    // Devolver el detalle de la referencia
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener detalle de referencia de SAGA:', error);
    
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
    
    // Llamar a la API de SAGA
    const respuesta = await axios.get(`${SAGA_API_URL}/buscar?termino=${termino}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Resultados de búsqueda recibidos');
    
    // Devolver los resultados de la búsqueda
    res.status(200).json(respuesta.data);
  } catch (error) {
    console.error('Error al buscar referencias en SAGA:', error);
    
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

// Agregar una función para probar la conexión con SAGA
const probarConexion = async (req, res) => {
  try {
    console.log('Probando conexión con SAGA...');
    
    // Obtener el token del usuario desde la petición
    const token = req.header('x-token');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No hay token en la petición'
      });
    }
    
    // Intenta hacer una petición simple a la API
    const respuesta = await axios.get(`${SAGA_API_URL}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Conexión exitosa con SAGA');
    
    // Devolver respuesta de éxito
    res.status(200).json({
      message: 'Conexión exitosa con SAGA',
      status: 'OK'
    });
  } catch (error) {
    console.error('Error al conectar con SAGA:', error);
    
    // Devolver mensaje de error detallado
    res.status(500).json({
      message: 'Error al conectar con SAGA',
      error: error.message,
      details: error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 'Sin detalles adicionales'
    });
  }
};

module.exports = {
  obtenerReferencias,
  obtenerDetalleReferencia,
  buscarReferencias,
  probarConexion
};
  
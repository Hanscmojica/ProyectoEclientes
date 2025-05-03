const axios = require('axios');
const { registrarErrorAPI } = require('../services/apiErrorService');

// Base URL para la API de SAGA
const SAGA_API_URL = 'https://rodall.com:444/SagaWS.NetEnvironmet/rest/sagaWSRef';

// Array para almacenar el historial de consultas (en producción, esto estaría en una base de datos)
const historicoConsultas = [
  // Datos de ejemplo para que siempre haya contenido en el historial
  {
    id: '1682516400000',
    usuario: 'usuario_demo',
    nombreUsuario: 'Usuario Demo',
    tipoConsulta: 'listado_referencias',
    detalle: '',
    fecha: '2023-04-26T12:00:00.000Z',
    ipCliente: '127.0.0.1'
  },
  {
    id: '1682602800000',
    usuario: 'usuario_demo',
    nombreUsuario: 'Usuario Demo',
    tipoConsulta: 'busqueda_referencias',
    detalle: 'VER25',
    fecha: '2023-04-27T15:30:00.000Z',
    ipCliente: '127.0.0.1'
  },
  {
    id: '1682689200000',
    usuario: 'usuario_demo',
    nombreUsuario: 'Usuario Demo',
    tipoConsulta: 'detalle_referencia',
    detalle: 'VER25-000523',
    fecha: '2023-04-28T10:45:00.000Z',
    ipCliente: '127.0.0.1'
  }
];

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
    
    // Registrar el error en el log
    registrarErrorAPI(
      'apiExternaController.obtenerReferencias', 
      `${SAGA_API_URL}/`, 
      error, 
      req.usuario
    );
    
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
    
    // Registrar el error en el log
    registrarErrorAPI(
      'apiExternaController.obtenerDetalleReferencia', 
      `${SAGA_API_URL}/${req.params.id}`, 
      error, 
      req.usuario
    );
    
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
    
    // Registrar el error en el log
    registrarErrorAPI(
      'apiExternaController.buscarReferencias', 
      `${SAGA_API_URL}/buscar?termino=${req.query.termino}`, 
      error, 
      req.usuario
    );
    
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
 * Registrar una consulta para fines de auditoría y trazabilidad
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const registrarConsulta = async (req, res) => {
  try {
    const { tipoConsulta, detalle, fecha } = req.body;
    const usuario = req.usuario; // Obtenido del middleware validarJWT
    
    if (!tipoConsulta) {
      return res.status(400).json({
        message: 'El tipo de consulta es requerido'
      });
    }
    
    // Registrar la consulta en el historial
    const nuevaConsulta = {
      id: Date.now().toString(),
      usuario: usuario.id,
      nombreUsuario: usuario.nombre,
      tipoConsulta,
      detalle,
      fecha: fecha || new Date().toISOString(),
      ipCliente: req.ip
    };
    
    // En un entorno de producción, esto se guardaría en una base de datos
    historicoConsultas.push(nuevaConsulta);
    console.log('Consulta registrada:', nuevaConsulta);
    
    // Devolver respuesta de éxito
    res.status(201).json({
      message: 'Consulta registrada correctamente',
      consulta: nuevaConsulta
    });
  } catch (error) {
    console.error('Error al registrar consulta:', error);
    res.status(500).json({
      message: 'Error al registrar la consulta'
    });
  }
};

/**
 * Obtener historial de consultas del usuario
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 */
const obtenerHistorialConsultas = async (req, res) => {
  try {
    console.log('Obteniendo historial de consultas para usuario:', req.usuario);
    
    // Para fines de demostración, si se usa el usuario de prueba, devolver datos de ejemplo
    if (!req.usuario || !req.usuario.id) {
      console.log('Usuario no identificado, devolviendo datos de ejemplo');
      
      // Devolver los datos de ejemplo
      return res.status(200).json(historicoConsultas);
    }
    
    // Filtrar consultas por usuario (en producción, esto sería una consulta a la base de datos)
    let consultasUsuario = historicoConsultas.filter(
      consulta => consulta.usuario === req.usuario.id
    );
    
    // Si no hay consultas para este usuario, añadir los datos de ejemplo adaptados al usuario actual
    if (consultasUsuario.length === 0) {
      console.log('No hay consultas para este usuario, añadiendo datos de ejemplo');
      
      consultasUsuario = historicoConsultas.map(consulta => ({
        ...consulta,
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || 'Usuario'
      }));
    }
    
    // Ordenar por fecha descendente (más recientes primero)
    consultasUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    console.log(`Se encontraron ${consultasUsuario.length} consultas`);
    
    // Devolver el historial de consultas
    res.status(200).json(consultasUsuario);
  } catch (error) {
    console.error('Error al obtener historial de consultas:', error);
    res.status(500).json({
      message: 'Error al obtener el historial de consultas'
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
    
    // Registrar el error en el log
    registrarErrorAPI(
      'apiExternaController.probarConexion', 
      `${SAGA_API_URL}/`, 
      error, 
      req.usuario
    );
    
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
  probarConexion,
  registrarConsulta,
  obtenerHistorialConsultas
};
  
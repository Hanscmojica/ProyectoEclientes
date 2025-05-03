import axios from 'axios';

// Base URL para la API de SAGA
const SAGA_API_URL = 'https://rodall.com:444/SagaWS.NetEnvironmet/rest/sagaWSRef';
// Base URL para la API local que actúa como proxy
const LOCAL_API_URL = '/api/v1/apiExterna';

// Configuración de Axios para la API local
const apiClient = axios.create({
  baseURL: LOCAL_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir el token JWT en la API local
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Obtener todas las referencias del usuario autenticado
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerReferencias = async () => {
  try {
    // Llamamos a nuestro backend que actuará como proxy para la API de SAGA
    const response = await apiClient.get('/referencias');
    
    // Registramos la consulta para auditoría
    registrarConsulta('listado_referencias');
    
    return {
      ok: true,
      referencias: response.data
    };
  } catch (error) {
    console.error('Error al obtener referencias:', error);
    
    // Si falla, usamos los datos mock
    return obtenerReferenciasMock();
  }
};

/**
 * Obtener detalles de una referencia específica
 * @param {string} referenciaId - ID de la referencia a consultar
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerDetalleReferencia = async (referenciaId) => {
  try {
    // Llamamos a nuestro backend que actuará como proxy para la API de SAGA
    const response = await apiClient.get(`/referencias/${referenciaId}`);
    
    // Registramos la consulta para auditoría
    registrarConsulta('detalle_referencia', referenciaId);
    
    return {
      ok: true,
      detalle: response.data
    };
  } catch (error) {
    console.error('Error al obtener detalle de referencia:', error);
    
    // Si falla, buscamos la referencia en los datos mock
    const mockData = obtenerReferenciasMock();
    const referenciaEncontrada = mockData.referencias.find(ref => ref.id === referenciaId);
    
    if (referenciaEncontrada) {
      // Registramos la consulta para auditoría (datos mock)
      registrarConsulta('detalle_referencia_mock', referenciaId);
      
      return {
        ok: true,
        detalle: referenciaEncontrada
      };
    }
    
    return manejarError(error, 'Error al obtener el detalle de la referencia');
  }
};

/**
 * Buscar referencias por término de búsqueda
 * @param {string} termino - Término a buscar (número de referencia)
 * @returns {Promise} - Respuesta de la API
 */
export const buscarReferencias = async (termino) => {
  try {
    // Llamamos a nuestro backend que actuará como proxy para la API de SAGA
    const response = await apiClient.get(`/referencias/buscar?termino=${termino}`);
    
    // Registramos la consulta para auditoría
    registrarConsulta('busqueda_referencias', termino);
    
    return {
      ok: true,
      referencias: response.data
    };
  } catch (error) {
    console.error('Error al buscar referencias:', error);
    
    // Si falla, filtramos los datos mock por el término de búsqueda
    const mockData = obtenerReferenciasMock();
    const referenciasFiltradas = mockData.referencias.filter(
      ref => ref.id.toLowerCase().includes(termino.toLowerCase())
    );
    
    // Registramos la consulta para auditoría (datos mock)
    registrarConsulta('busqueda_referencias_mock', termino);
    
    return {
      ok: true,
      referencias: referenciasFiltradas
    };
  }
};

/**
 * Registrar una consulta de referencia para auditoría y trazabilidad
 * @param {string} tipoConsulta - Tipo de consulta realizada
 * @param {string} [detalle] - Detalle de la consulta (opcional)
 * @returns {Promise} - Promesa de la petición
 */
export const registrarConsulta = async (tipoConsulta, detalle = '') => {
  try {
    await apiClient.post('/referencias/registrar-consulta', {
      tipoConsulta,
      detalle,
      fecha: new Date().toISOString()
    });
    console.log(`Consulta registrada: ${tipoConsulta} - ${detalle}`);
    return true;
  } catch (error) {
    console.error('Error al registrar consulta:', error);
    return false;
  }
};

/**
 * Obtener historial de consultas del usuario
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerHistorialConsultas = async () => {
  try {
    const response = await apiClient.get('/referencias/historial-consultas');
    return {
      ok: true,
      consultas: response.data
    };
  } catch (error) {
    console.error('Error al obtener historial de consultas:', error);
    return {
      ok: false,
      message: 'Error al obtener el historial de consultas',
      consultas: []
    };
  }
};

/**
 * Función para manejar los errores de la API
 * @param {Error} error - Error devuelto por Axios
 * @param {string} mensajeDefecto - Mensaje de error por defecto
 * @returns {Object} - Objeto con información del error
 */
const manejarError = (error, mensajeDefecto) => {
  if (error.response && error.response.data) {
    return {
      ok: false,
      message: error.response.data.message || mensajeDefecto
    };
  }
  return {
    ok: false,
    message: error.message || mensajeDefecto
  };
};

// Datos mock para desarrollo en caso de que la API no esté disponible
export const obtenerReferenciasMock = () => {
  return {
    ok: true,
    referencias: [
      {
        id: 'VER25-000524',
        fechaOperacion: '10/21/2021',
        aduanaInvolucrada: 'Puerto de entrada A',
        estado: 'En proceso',
        numeroPatente: 'PT-123456',
        bultos: 5,
        cantidadMercancia: 10,
        claseBulto: 'Contenedor',
        pesoBruto: '1500 kg',
        descripcionMercancias: 'Equipos electrónicos',
        ejecutivo: 'Juan Pérez',
        cliente: 'Empresa Importadora S.A.'
      },
      {
        id: 'VER25-000523',
        fechaOperacion: '11/05/2021',
        aduanaInvolucrada: 'Puerto de Entrada B',
        estado: 'Completado',
        numeroPatente: 'PT-789012',
        bultos: 3,
        cantidadMercancia: 8,
        claseBulto: 'Pallet',
        pesoBruto: '800 kg',
        descripcionMercancias: 'Textiles',
        ejecutivo: 'María Rodríguez',
        cliente: 'Textiles Modernos Inc.'
      }
    ]
  };
}; 
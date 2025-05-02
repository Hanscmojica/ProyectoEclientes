import axios from 'axios';

// Base URL para la API local
const LOCAL_API_URL = '/api/v1/registroConsulta';

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
 * Obtener historial de consultas del usuario autenticado
 * @param {number} pagina - Número de página
 * @param {number} limite - Límite de registros por página
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerHistorialConsultas = async (pagina = 1, limite = 20) => {
  try {
    const response = await apiClient.get(`/historial?pagina=${pagina}&limite=${limite}`);
    
    return {
      ok: true,
      historial: response.data
    };
  } catch (error) {
    console.error('Error al obtener historial de consultas:', error);
    
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al obtener historial de consultas'
    };
  }
};

/**
 * Obtener estadísticas de consultas (para administradores)
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerEstadisticasConsultas = async (fechaInicio, fechaFin) => {
  try {
    const response = await apiClient.get(`/estadisticas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    
    return {
      ok: true,
      estadisticas: response.data
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de consultas:', error);
    
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al obtener estadísticas de consultas'
    };
  }
}; 
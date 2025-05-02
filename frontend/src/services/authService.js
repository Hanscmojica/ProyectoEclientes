import axios from 'axios';

// Base URL for API calls
const API_URL = '/api/v1/auth';

// Axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add token to requests
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
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Response from the API
 */
export const loginService = async (email, password) => {
  try {
    const response = await apiClient.post('/', { 
      sEmail: email, 
      sPassword: password 
    });
    
    if (response.data && response.data.ok) {
      return {
        ok: true,
        id: response.data.id,
        perfil: response.data.perfil,
        token: response.data.token
      };
    } else {
      return {
        ok: false,
        message: response.data?.message || 'Error desconocido en la autenticación'
      };
    }
  } catch (error) {
    // Handle error responses from the server
    if (error.response && error.response.data) {
      return {
        ok: false,
        message: error.response.data.message || 'Error en el servidor'
      };
    }
    // Handle network or other errors
    return {
      ok: false,
      message: error.message || 'Error de conexión al servidor'
    };
  }
};

/**
 * Renew JWT token
 * @returns {Promise} - Response from the API
 */
export const renewTokenService = async () => {
  try {
    const response = await apiClient.get('/renew');
    
    if (response.data && response.data.ok) {
      return {
        ok: true,
        id: response.data.id,
        perfil: response.data.perfil,
        token: response.data.token
      };
    } else {
      return {
        ok: false,
        message: response.data?.message || 'Error al renovar la sesión'
      };
    }
  } catch (error) {
    // Handle error responses from the server
    if (error.response && error.response.data) {
      return {
        ok: false,
        message: error.response.data.message || 'Error en el servidor'
      };
    }
    // Handle network or other errors
    return {
      ok: false,
      message: error.message || 'Error de conexión al servidor'
    };
  }
}; 
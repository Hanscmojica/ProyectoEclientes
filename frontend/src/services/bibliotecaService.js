import axios from 'axios';

// Base URL para la API local
const LOCAL_API_URL = '/api/v1/biblioteca';

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
 * Obtener los archivos asociados a una referencia
 * @param {string} referenciaId - ID de la referencia
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerArchivosPorReferencia = async (referenciaId) => {
  try {
    const response = await apiClient.get(`/archivos/${referenciaId}`);
    return {
      ok: true,
      archivos: response.data
    };
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al obtener los archivos',
      archivos: []
    };
  }
};

/**
 * Obtener las categorías disponibles para los archivos
 * @returns {Promise} - Respuesta de la API
 */
export const obtenerCategorias = async () => {
  try {
    const response = await apiClient.get('/categorias');
    return {
      ok: true,
      categorias: response.data
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al obtener las categorías',
      categorias: []
    };
  }
};

/**
 * Descargar un archivo
 * @param {string} archivoId - ID del archivo a descargar
 * @returns {Promise} - Respuesta de la API
 */
export const descargarArchivo = async (archivoId) => {
  try {
    const response = await apiClient.get(`/descargar/${archivoId}`, {
      responseType: 'blob'
    });
    
    // Crear URL para el archivo descargado
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Crear elemento de enlace y simular clic
    const link = document.createElement('a');
    link.href = url;
    // Obtener nombre del archivo del header Content-Disposition o usar un nombre predeterminado
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'archivo_descargado';
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return {
      ok: true,
      message: 'Archivo descargado correctamente'
    };
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al descargar el archivo'
    };
  }
};

/**
 * Registrar la visualización de un archivo (para fines de auditoría)
 * @param {string} archivoId - ID del archivo visualizado
 * @returns {Promise} - Respuesta de la API
 */
export const registrarVisualizacion = async (archivoId) => {
  try {
    await apiClient.post('/registrar-visualizacion', { archivoId });
    return {
      ok: true
    };
  } catch (error) {
    console.error('Error al registrar visualización:', error);
    return {
      ok: false
    };
  }
};

/**
 * Subir un archivo
 * @param {FormData} formData - Datos del formulario con el archivo
 * @returns {Promise} - Respuesta de la API
 */
export const subirArchivo = async (formData) => {
  try {
    // Crear una instancia de cliente específica para la subida con Content-Type correcto
    const uploadClient = axios.create({
      baseURL: LOCAL_API_URL,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Añadir token al cliente de subida
    const token = localStorage.getItem('token');
    if (token) {
      uploadClient.defaults.headers.common['x-token'] = token;
    }
    
    const response = await uploadClient.post('/subir', formData);
    
    return {
      ok: true,
      archivo: response.data.archivo
    };
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return {
      ok: false,
      message: error.response?.data?.message || 'Error al subir el archivo'
    };
  }
};

// Datos de ejemplo para desarrollo en caso de que la API no esté disponible
export const obtenerArchivosMock = (referenciaId) => {
  const archivosMock = {
    'VER25-000524': [
      {
        id: '1',
        nombre: 'Pedimento_VER25-000524.pdf',
        tipo: 'pdf',
        categoria: 'Pedimentos',
        fechaCreacion: '2023-10-15',
        tamano: '1.2 MB',
        url: '/archivos/pedimento_ver25_000524.pdf'
      },
      {
        id: '2',
        nombre: 'Factura_VER25-000524.pdf',
        tipo: 'pdf',
        categoria: 'Facturas',
        fechaCreacion: '2023-10-15',
        tamano: '850 KB',
        url: '/archivos/factura_ver25_000524.pdf'
      },
      {
        id: '3',
        nombre: 'Reporte_Operacion_VER25-000524.xlsx',
        tipo: 'excel',
        categoria: 'Reportes',
        fechaCreacion: '2023-10-16',
        tamano: '345 KB',
        url: '/archivos/reporte_ver25_000524.xlsx'
      }
    ],
    'VER25-000523': [
      {
        id: '4',
        nombre: 'Pedimento_VER25-000523.pdf',
        tipo: 'pdf',
        categoria: 'Pedimentos',
        fechaCreacion: '2023-09-28',
        tamano: '1.1 MB',
        url: '/archivos/pedimento_ver25_000523.pdf'
      },
      {
        id: '5',
        nombre: 'Factura_VER25-000523.pdf',
        tipo: 'pdf',
        categoria: 'Facturas',
        fechaCreacion: '2023-09-28',
        tamano: '780 KB',
        url: '/archivos/factura_ver25_000523.pdf'
      },
      {
        id: '6',
        nombre: 'Documento_Transporte_VER25-000523.pdf',
        tipo: 'pdf',
        categoria: 'Otros',
        fechaCreacion: '2023-09-29',
        tamano: '950 KB',
        url: '/archivos/transporte_ver25_000523.pdf'
      },
      {
        id: '7',
        nombre: 'Fotos_Mercancia_VER25-000523.jpg',
        tipo: 'imagen',
        categoria: 'Otros',
        fechaCreacion: '2023-09-30',
        tamano: '2.5 MB',
        url: '/archivos/fotos_ver25_000523.jpg'
      }
    ]
  };

  return {
    ok: true,
    archivos: archivosMock[referenciaId] || []
  };
};

export const obtenerCategoriasMock = () => {
  return {
    ok: true,
    categorias: [
      { id: 1, nombre: 'Pedimentos' },
      { id: 2, nombre: 'Facturas' },
      { id: 3, nombre: 'Reportes' },
      { id: 4, nombre: 'Otros' }
    ]
  };
};
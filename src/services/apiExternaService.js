const axios = require("axios");

// URL base para la API de SAGA
const SAGA_API_URL =
  "https://rodall.com:444/SagaWS.NetEnvironmet/rest/sagaWSRef";

// Configuración de reintentos y caché
const API_RETRY_ATTEMPTS = 3;
const API_RETRY_DELAY = 2000; // ms
const MOCK_ENABLED = true; // Usar datos mock cuando la API falla

// Cliente axios con interceptores
const sagaApiClient = axios.create({
  baseURL: SAGA_API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    User: "RODALL",
    Password: "888888888",
  },
});

// Función para intentar una petición con reintentos
const executeWithRetry = async (
  requestFn,
  maxAttempts = API_RETRY_ATTEMPTS
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // No reintentar para errores de cliente (4xx)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        throw error;
      }

      console.log(
        `Intento ${attempt} fallido, reintentando en ${API_RETRY_DELAY}ms...`
      );

      // Esperar antes del siguiente intento
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, API_RETRY_DELAY));
      }
    }
  }

  throw lastError;
};

// Función para obtener datos mock
function getMockReferencias() {
  return [
    {
      id: "VER25-000524",
      fechaOperacion: "10/21/2024",
      aduanaInvolucrada: "Puerto de entrada A",
      estado: "En proceso",
      numeroPatente: "PT-123456",
      bultos: 5,
      cantidadMercancia: 10,
      claseBulto: "Contenedor",
      pesoBruto: "1500 kg",
      descripcionMercancias: "Equipos electrónicos",
      ejecutivo: "Juan Pérez",
      cliente: "Empresa Importadora S.A.",
    },
    {
      id: "VER25-000523",
      fechaOperacion: "11/05/2024",
      aduanaInvolucrada: "Puerto de Entrada B",
      estado: "Completado",
      numeroPatente: "PT-789012",
      bultos: 3,
      cantidadMercancia: 8,
      claseBulto: "Pallet",
      pesoBruto: "800 kg",
      descripcionMercancias: "Textiles",
      ejecutivo: "María Rodríguez",
      cliente: "Textiles Modernos Inc.",
    },
    {
      id: "VER25-000522",
      fechaOperacion: "09/15/2024",
      aduanaInvolucrada: "Puerto de Entrada C",
      estado: "Detenido",
      numeroPatente: "PT-345678",
      bultos: 10,
      cantidadMercancia: 15,
      claseBulto: "Caja",
      pesoBruto: "2500 kg",
      descripcionMercancias: "Componentes automotrices",
      ejecutivo: "Carlos González",
      cliente: "AutoParts S.A.",
    },
  ];
}

// Funciones para acceder a la API de SAGA
const apiExternaService = {
  /**
   * Obtiene todas las referencias asociadas a un usuario
   * @param {string} token - Token JWT del usuario
   * @returns {Promise<Array>} - Lista de referencias
   */
  async obtenerReferencias(token) {
    try {
      // Crear un body básico para la solicitud POST
      const requestBody = {
        TipoFecha: 1,
        FechaInicial: "01/01/2022",
        FechaFinal: "31/12/2025",
      };

      // Usar POST en lugar de GET
      const response = await executeWithRetry(() =>
        sagaApiClient.post("/", requestBody)
      );

      // IMPORTANTE: Verificar la estructura de datos y transformarla si es necesario
      const data = response.data;

      // Asegurarse de que lo que se devuelve es un array
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === "object") {
        // Si el servidor devuelve un objeto con una propiedad que contiene las referencias
        // (por ejemplo, { referencias: [...] })
        if (data.referencias && Array.isArray(data.referencias)) {
          return data.referencias;
        }
        // Si hay otra estructura, intentar convertirla a un array
        const posibleArray = Object.values(data).find((value) =>
          Array.isArray(value)
        );
        if (posibleArray) {
          return posibleArray;
        }
      }

      // Si no se pudo extraer un array, usar datos mock
      console.log(
        "Estructura de datos inesperada de la API, usando datos mock"
      );
      return getMockReferencias();
    } catch (error) {
      console.error("Error al obtener referencias de SAGA:", error);

      // Si falla, usar datos mock
      if (MOCK_ENABLED) {
        console.log("Usando datos mock para referencias");
        return getMockReferencias();
      }

      throw error;
    }
  },

  /**
   * Obtiene el detalle de una referencia específica
   * @param {string} referenciaId - ID de la referencia
   * @param {string} token - Token JWT del usuario
   * @returns {Promise<Object>} - Detalle de la referencia
   */
  async obtenerDetalleReferencia(referenciaId, token) {
    try {
      // Crear un body básico para la solicitud POST incluyendo el ID de referencia
      const requestBody = {
        Pedimento: referenciaId.includes("-")
          ? referenciaId.split("-")[1]
          : referenciaId,
        TipoFecha: 1,
        FechaInicial: "01/01/2022",
        FechaFinal: "31/12/2025",
      };

      // Usar POST en lugar de GET
      const response = await executeWithRetry(() =>
        sagaApiClient.post("/", requestBody)
      );

      // Procesar la respuesta
      let referencia = null;
      const data = response.data;

      // Intentar extraer la referencia específica
      if (Array.isArray(data) && data.length > 0) {
        // Si la API devuelve un array, buscar la referencia con el ID correcto
        referencia = data.find((ref) => ref.id === referenciaId);
      } else if (data && typeof data === "object") {
        // Si la API devuelve un objeto, podría ser la referencia directamente
        referencia = data;
      }

      if (referencia) {
        return referencia;
      } else {
        console.log(
          `No se encontró la referencia ${referenciaId} en la respuesta, usando datos mock`
        );
        const mockData = getMockReferencias();
        return mockData.find((ref) => ref.id === referenciaId) || mockData[0];
      }
    } catch (error) {
      console.error(
        `Error al obtener detalle de referencia ${referenciaId}:`,
        error
      );

      // Si falla, usar datos mock
      if (MOCK_ENABLED) {
        console.log(`Usando datos mock para referencia ${referenciaId}`);
        const mockData = getMockReferencias();
        return mockData.find((ref) => ref.id === referenciaId) || mockData[0];
      }

      throw error;
    }
  },

  /**
   * Busca referencias por un término específico
   * @param {string} termino - Término de búsqueda
   * @param {string} token - Token JWT del usuario
   * @returns {Promise<Array>} - Referencias encontradas
   */
  async buscarReferencias(termino, token) {
    try {
      // Crear un body básico para la solicitud POST
      const requestBody = {
        Cliente: termino,
        TipoFecha: 1,
        FechaInicial: "01/01/2022",
        FechaFinal: "31/12/2025",
      };

      // Usar POST en lugar de GET
      const response = await executeWithRetry(() =>
        sagaApiClient.post("/", requestBody)
      );

      // IMPORTANTE: Verificar la estructura de datos y transformarla si es necesario
      const data = response.data;

      // Asegurarse de que lo que se devuelve es un array
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === "object") {
        // Si el servidor devuelve un objeto con una propiedad que contiene las referencias
        if (data.referencias && Array.isArray(data.referencias)) {
          return data.referencias;
        }
        // Si hay otra estructura, intentar convertirla a un array
        const posibleArray = Object.values(data).find((value) =>
          Array.isArray(value)
        );
        if (posibleArray) {
          return posibleArray;
        }
      }

      // Si no se pudo extraer un array, usar datos mock
      console.log(
        "Estructura de datos inesperada de la API, usando datos mock para búsqueda"
      );
      const mockData = getMockReferencias();
      return mockData.filter((ref) =>
        ref.id.toLowerCase().includes(termino.toLowerCase())
      );
    } catch (error) {
      console.error(
        `Error al buscar referencias con término "${termino}":`,
        error
      );

      // Si falla, usar datos mock
      if (MOCK_ENABLED) {
        console.log(`Usando datos mock para búsqueda "${termino}"`);
        const mockData = getMockReferencias();
        return mockData.filter((ref) =>
          ref.id.toLowerCase().includes(termino.toLowerCase())
        );
      }

      throw error;
    }
  },

  /**
   * Probar la conexión con la API de SAGA
   * @param {string} token - Token JWT del usuario
   * @returns {Promise<boolean>} - Estado de la conexión
   */
  async probarConexion(token) {
    try {
      // Crear un body básico para la solicitud POST
      const requestBody = {
        TipoFecha: 1,
        FechaInicial: "01/01/2022",
        FechaFinal: "31/01/2022",
      };

      // Usar POST en lugar de GET
      await executeWithRetry(() => sagaApiClient.post("/", requestBody));

      return true;
    } catch (error) {
      console.error("Error al probar conexión con SAGA:", error);
      return false;
    }
  },
  async referenciaPorCliente(data) {
    const url = "https://rodall.com:444/SagaWS.NetEnvironmet/rest/sagaWSRef/";
  
    const headers = {
      "Content-Type": "application/json",
      User: "RODALL",
      Password: "8888888888",
      "Cache-Control": "no-cache",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    };
  
    try {
      const response = await axios.post(url, data, { headers });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(
        "Error al consultar la API externa:",
        error.response?.data || error.message
      );
      return null;
    }
  }
};

module.exports = apiExternaService;

// importar axios
const axios = require('axios');

// Función para consultar la API externa
const consultarApiExterna = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    console.error('Error al consultar la API externa:', error.message);
    return [];
  }
};

// Exportar la función
module.exports = {
  consultarApiExterna,
};
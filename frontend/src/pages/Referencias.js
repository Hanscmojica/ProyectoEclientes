import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Snackbar,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Assignment as AssignmentIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  History as HistoryIcon,
  LibraryBooks as LibraryIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import DetalleReferencia from '../components/DetalleReferencia';
import HistorialConsultas from '../components/HistorialConsultas';
import Biblioteca from '../components/Biblioteca';
import axios from 'axios';

// Usa datos mock temporalmente para evitar la pantalla en blanco
const MOCK_REFERENCIAS = [
  {
    id: 'VER25-000524',
    fechaOperacion: '10/21/2024',
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
    fechaOperacion: '11/05/2024',
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
];

const Referencias = () => {
  const { user } = useContext(AuthContext) || { user: null };
  const [referencias, setReferencias] = useState(MOCK_REFERENCIAS); // Inicializar con datos mock
  const [referenciaSeleccionada, setReferenciaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false); // Iniciar con false para mostrar contenido inmediatamente
  const [error, setError] = useState(null);
  const [notificacion, setNotificacion] = useState({
    abierta: false,
    mensaje: '',
    tipo: 'info'
  });
  const [conexionSaga, setConexionSaga] = useState({
    estado: 'desconocido',
    mensaje: 'Verificando conexión...'
  });
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarBiblioteca, setMostrarBiblioteca] = useState(false);

  // Verificar conexión con SAGA al cargar el componente
  useEffect(() => {
    const verificarConexion = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/v1/apiExterna/probar-conexion', {
          headers: {
            'x-token': token || ''
          }
        });
        
        if (response.status === 200) {
          setConexionSaga({
            estado: 'conectado',
            mensaje: 'Conectado a SAGA'
          });
          mostrarNotificacion('Conexión con SAGA establecida', 'success');
        }
      } catch (error) {
        console.error('Error al verificar conexión con SAGA:', error);
        setConexionSaga({
          estado: 'desconectado',
          mensaje: 'Sin conexión a SAGA'
        });
        mostrarNotificacion('No se pudo conectar con SAGA. Usando datos de prueba.', 'warning');
      }
    };

    verificarConexion();
  }, []);

  // Obtener referencias al cargar el componente
  useEffect(() => {
    try {
      cargarReferencias();
    } catch (error) {
      console.error("Error al cargar referencias:", error);
      // No hacer nada más, ya tenemos los datos mock cargados
    }
  }, []);

  // Función para cargar referencias
  const cargarReferencias = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Intentar importar de manera segura
      let servicio;
      try {
        servicio = await import('../services/referenciaService');
      } catch (importError) {
        console.error("Error al importar servicio:", importError);
        throw new Error("No se pudo cargar el servicio de referencias");
      }

      // Si el servicio se importó correctamente, obtener referencias
      if (servicio && typeof servicio.obtenerReferencias === 'function') {
        const respuesta = await servicio.obtenerReferencias();
        
        if (respuesta && respuesta.ok) {
          // Asegurarse que referencias siempre sea un array
          if (Array.isArray(respuesta.referencias) && respuesta.referencias.length > 0) {
            setReferencias(respuesta.referencias);
          } else {
            console.log("No se encontraron referencias en la respuesta, usando datos mock");
            // Mantener los datos mock si la respuesta está vacía
          }
        } else {
          const mensaje = respuesta?.message || 'Error al cargar las referencias';
          setError(mensaje);
          mostrarNotificacion(mensaje, 'error');
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al cargar las referencias: ' + (error.message || 'Error desconocido'));
      mostrarNotificacion('Error al conectar con el servidor. Usando datos de prueba.', 'error');
    } finally {
      setCargando(false);
    }
  };

  // Mostrar notificación
  const mostrarNotificacion = (mensaje, tipo = 'info') => {
    setNotificacion({
      abierta: true,
      mensaje,
      tipo
    });
  };

  // Cerrar notificación
  const cerrarNotificacion = () => {
    setNotificacion({
      ...notificacion,
      abierta: false
    });
  };

  // Manejar búsqueda de referencias
  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      // Si el campo de búsqueda está vacío, cargar todas las referencias
      cargarReferencias();
      return;
    }

    try {
      setCargando(true);
      setError(null);
      
      // Intentar importar de manera segura
      let servicio;
      try {
        servicio = await import('../services/referenciaService');
      } catch (importError) {
        console.error("Error al importar servicio:", importError);
        throw new Error("No se pudo cargar el servicio de búsqueda");
      }

      // Si el servicio se importó correctamente, buscar referencias
      if (servicio && typeof servicio.buscarReferencias === 'function') {
        const respuesta = await servicio.buscarReferencias(busqueda);
        
        if (respuesta && respuesta.ok) {
          // Asegurar que referencias siempre sea un array
          if (Array.isArray(respuesta.referencias)) {
            setReferencias(respuesta.referencias);
            
            if (respuesta.referencias.length === 0) {
              mostrarNotificacion('No se encontraron referencias que coincidan con su búsqueda', 'info');
            } else {
              mostrarNotificacion(`Se encontraron ${respuesta.referencias.length} referencias`, 'success');
            }
          } else {
            setReferencias([]);
            mostrarNotificacion('No se encontraron referencias que coincidan con su búsqueda', 'info');
          }
        } else {
          const mensaje = respuesta?.message || 'Error al buscar referencias';
          setError(mensaje);
          mostrarNotificacion(mensaje, 'error');
        }
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setError('Error al buscar referencias: ' + (error.message || 'Error desconocido'));
      mostrarNotificacion('Error al conectar con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  // Abrir detalle de referencia
  const handleVerDetalle = (referencia) => {
    setReferenciaSeleccionada(referencia);
  };

  // Cerrar detalle de referencia
  const handleCerrarDetalle = () => {
    setReferenciaSeleccionada(null);
  };

  // Mostrar historial de consultas
  const handleVerHistorial = () => {
    setMostrarHistorial(true);
  };

  // Cerrar historial de consultas
  const handleCerrarHistorial = () => {
    setMostrarHistorial(false);
  };

  // Mostrar biblioteca de documentos
  const handleVerBiblioteca = () => {
    setMostrarBiblioteca(true);
  };

  // Cerrar biblioteca de documentos
  const handleCerrarBiblioteca = () => {
    setMostrarBiblioteca(false);
  };

  // Verificar que los componentes existan antes de renderizarlos
  const renderizarDetalleReferencia = () => {
    try {
      return referenciaSeleccionada && DetalleReferencia ? (
        <DetalleReferencia 
          referencia={referenciaSeleccionada} 
          onCerrar={handleCerrarDetalle}
        />
      ) : null;
    } catch (error) {
      console.error("Error al renderizar detalle:", error);
      return null;
    }
  };

  const renderizarHistorialConsultas = () => {
    try {
      return mostrarHistorial && HistorialConsultas ? (
        <HistorialConsultas 
          onCerrar={handleCerrarHistorial}
        />
      ) : null;
    } catch (error) {
      console.error("Error al renderizar historial:", error);
      return null;
    }
  };

  const renderizarBiblioteca = () => {
    try {
      return mostrarBiblioteca && Biblioteca ? (
        <Biblioteca 
          onCerrar={handleCerrarBiblioteca}
          referencias={Array.isArray(referencias) ? referencias : []}
        />
      ) : null;
    } catch (error) {
      console.error("Error al renderizar biblioteca:", error);
      return null;
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Encabezado de bienvenida */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(to right, #3f51b5, #303f9f)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
          <Box display="flex" alignItems="center" mb={{ xs: 2, md: 0 }}>
            <Box 
              component="img" 
              src="/woman.png" 
              alt="Usuario" 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                border: '3px solid white',
                mr: 3
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect fill="%23ccc" width="80" height="80"/%3E%3C/svg%3E';
              }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                Bienvenido, {user?.nombre || 'usuario'}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Usuario Autenticado
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Usted puede ver sus referencias aquí
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Chip
              icon={conexionSaga.estado === 'conectado' ? <CloudDoneIcon /> : <CloudOffIcon />}
              label={conexionSaga.mensaje}
              color={conexionSaga.estado === 'conectado' ? 'success' : 'default'}
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
                mr: 2,
                mb: { xs: 1, md: 0 }
              }}
            />
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleVerBiblioteca}
              startIcon={<LibraryIcon />}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                mr: 2,
                mb: { xs: 1, md: 0 }
              }}
            >
              Biblioteca
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleVerHistorial}
              startIcon={<HistoryIcon />}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Historial
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Sección de búsqueda */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Buscar por referencia
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Introduzca el número de referencia para encontrar detalles específicos
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por número de referencia"
            sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 2, sm: 0 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleBuscar();
              }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBuscar}
            sx={{ px: 4, minWidth: { xs: '100%', sm: 'auto' } }}
            disabled={cargando}
          >
            {cargando ? 'Buscando...' : 'Buscar'}
          </Button>
        </Box>
      </Paper>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mostrar indicador de carga */}
      {cargando && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Mostrar mensaje si no hay referencias */}
      {!cargando && Array.isArray(referencias) && referencias.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontraron referencias que coincidan con su búsqueda. Intente con otro término o contacte a su ejecutivo de cuenta.
        </Alert>
      )}

      {/* Listado de referencias */}
      {!cargando && Array.isArray(referencias) && referencias.length > 0 && !referenciaSeleccionada && (
        <>
          <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
            Tus referencias
          </Typography>
          <Grid container spacing={4}>
            {referencias.map((referencia, index) => (
              <Grid item xs={12} md={6} key={referencia?.id || `ref-${index}`}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea onClick={() => handleVerDetalle(referencia)}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Box 
                          sx={{ 
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 70,
                            height: 70,
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: '10px'
                          }}
                        >
                          <AssignmentIcon fontSize="large" color="primary" />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Referencia {referencia?.id || 'Sin ID'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fecha de Operación: {referencia?.fechaOperacion || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          Aduana Involucrada:
                        </Typography>
                        <Typography variant="body1">
                          {referencia?.aduanaInvolucrada || 'No especificada'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Módulos adicionales con manejo de errores */}
      {renderizarDetalleReferencia()}
      {renderizarHistorialConsultas()}
      {renderizarBiblioteca()}

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.abierta}
        autoHideDuration={6000}
        onClose={cerrarNotificacion}
        message={notificacion.mensaje}
      />
    </Container>
  );
};

export default Referencias;
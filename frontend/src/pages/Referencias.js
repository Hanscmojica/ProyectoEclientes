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
import { obtenerReferencias, buscarReferencias } from '../services/referenciaService';
import { AuthContext } from '../context/AuthContext';
import DetalleReferencia from '../components/DetalleReferencia';
import HistorialConsultas from '../components/HistorialConsultas';
import Biblioteca from '../components/Biblioteca';
import axios from 'axios';

const Referencias = () => {
  const { user } = useContext(AuthContext);
  const [referencias, setReferencias] = useState([]);
  const [referenciaSeleccionada, setReferenciaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [notificacion, setNotificacion] = useState({
    abierta: false,
    mensaje: '',
    tipo: 'info'
  });
  const [conexionSaga, setConexionSaga] = useState({
    estado: 'desconocido', // 'conectado', 'desconectado', 'desconocido'
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
            'x-token': token
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
    cargarReferencias();
  }, []);

  // Función para cargar referencias
  const cargarReferencias = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuesta = await obtenerReferencias();
      
      if (respuesta.ok) {
        setReferencias(respuesta.referencias);
        
        if (respuesta.referencias.length === 0) {
          mostrarNotificacion('No se encontraron referencias disponibles', 'info');
        }
      } else {
        setError(respuesta.message);
        mostrarNotificacion(respuesta.message, 'error');
      }
    } catch (error) {
      setError('Error al cargar las referencias: ' + error.message);
      mostrarNotificacion('Error al conectar con el servidor', 'error');
      console.error('Error:', error);
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
      
      const respuesta = await buscarReferencias(busqueda);
      
      if (respuesta.ok) {
        setReferencias(respuesta.referencias);
        
        if (respuesta.referencias.length === 0) {
          mostrarNotificacion('No se encontraron referencias que coincidan con su búsqueda', 'info');
        } else {
          mostrarNotificacion(`Se encontraron ${respuesta.referencias.length} referencias`, 'success');
        }
      } else {
        setError(respuesta.message);
        mostrarNotificacion(respuesta.message, 'error');
      }
    } catch (error) {
      setError('Error al buscar referencias: ' + error.message);
      mostrarNotificacion('Error al conectar con el servidor', 'error');
      console.error('Error:', error);
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
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
          <Box display="flex" alignItems="center">
            <Chip
              icon={conexionSaga.estado === 'conectado' ? <CloudDoneIcon /> : <CloudOffIcon />}
              label={conexionSaga.mensaje}
              color={conexionSaga.estado === 'conectado' ? 'success' : 'default'}
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
                mr: 2 
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
                mr: 2
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
        <Box display="flex">
          <TextField
            fullWidth
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por número de referencia"
            sx={{ mr: 1 }}
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
            sx={{ px: 4 }}
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
      {!cargando && referencias.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontraron referencias que coincidan con su búsqueda. Intente con otro término o contacte a su ejecutivo de cuenta.
        </Alert>
      )}

      {/* Listado de referencias */}
      {!cargando && referencias.length > 0 && !referenciaSeleccionada && (
        <>
          <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
            Tus referencias
          </Typography>
          <Grid container spacing={4}>
            {referencias.map((referencia) => (
              <Grid item xs={12} md={6} key={referencia.id}>
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
                            Referencia {referencia.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fecha de Operación: {referencia.fechaOperacion}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          Aduana Involucrada:
                        </Typography>
                        <Typography variant="body1">
                          {referencia.aduanaInvolucrada}
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

      {/* Mostrar detalle de referencia */}
      {referenciaSeleccionada && (
        <DetalleReferencia 
          referencia={referenciaSeleccionada} 
          onCerrar={handleCerrarDetalle}
        />
      )}

      {/* Mostrar historial de consultas */}
      {mostrarHistorial && (
        <HistorialConsultas 
          onCerrar={handleCerrarHistorial}
        />
      )}

      {/* Mostrar biblioteca de documentos */}
      {mostrarBiblioteca && (
        <Biblioteca 
          onCerrar={handleCerrarBiblioteca}
          referencias={referencias}
        />
      )}

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
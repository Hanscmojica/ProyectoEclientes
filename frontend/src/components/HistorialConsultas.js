import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  PageviewOutlined as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { obtenerHistorialConsultas } from '../services/referenciaService';

/**
 * Componente para mostrar el historial de consultas de referencias
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onCerrar - Función para cerrar el historial
 */
const HistorialConsultas = ({ onCerrar }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  // Cargar historial de consultas
  const cargarHistorial = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuesta = await obtenerHistorialConsultas();
      
      if (respuesta.ok) {
        setHistorial(respuesta.consultas);
      } else {
        setError(respuesta.message);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setError('Error al cargar el historial de consultas: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Obtener icono según tipo de consulta
  const getIconoConsulta = (tipoConsulta) => {
    if (tipoConsulta.includes('listado')) {
      return <HistoryIcon color="primary" />;
    } else if (tipoConsulta.includes('busqueda')) {
      return <SearchIcon color="primary" />;
    } else if (tipoConsulta.includes('detalle')) {
      return <ViewIcon color="primary" />;
    } else {
      return <HistoryIcon color="primary" />;
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fechaIso) => {
    const fecha = new Date(fechaIso);
    return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
  };

  // Obtener descripción según tipo de consulta
  const getDescripcionConsulta = (consulta) => {
    const { tipoConsulta, detalle } = consulta;
    
    if (tipoConsulta.includes('listado')) {
      return 'Consultó el listado de referencias';
    } else if (tipoConsulta.includes('busqueda')) {
      return `Buscó referencias con el término "${detalle}"`;
    } else if (tipoConsulta.includes('detalle')) {
      return `Consultó detalles de la referencia "${detalle}"`;
    } else {
      return 'Realizó una consulta en el sistema';
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: 2,
        mt: 2
      }}
    >
      {/* Cabecera */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={onCerrar} 
            sx={{ mr: 2 }}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Historial de Consultas
          </Typography>
        </Box>
        <Box>
          <Button 
            startIcon={<DownloadIcon />} 
            variant="outlined"
          >
            Exportar Historial
          </Button>
        </Box>
      </Box>

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

      {/* Mostrar mensaje si no hay historial */}
      {!cargando && historial.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No se encontraron registros de consultas previas.
        </Alert>
      )}

      {/* Lista de consultas */}
      {!cargando && historial.length > 0 && (
        <List>
          {historial.map((consulta) => (
            <React.Fragment key={consulta.id}>
              <ListItem>
                <ListItemIcon>
                  {getIconoConsulta(consulta.tipoConsulta)}
                </ListItemIcon>
                <ListItemText 
                  primary={getDescripcionConsulta(consulta)} 
                  secondary={formatearFecha(consulta.fecha)}
                />
                <Tooltip title="Ver detalles">
                  <IconButton>
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Botones de acción en la parte inferior */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onCerrar}
        >
          Cerrar
        </Button>
      </Box>
    </Paper>
  );
};

export default HistorialConsultas; 
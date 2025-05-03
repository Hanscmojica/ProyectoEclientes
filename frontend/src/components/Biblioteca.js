import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  Article as DocumentIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Folder as FolderIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { 
  obtenerArchivosPorReferencia, 
  obtenerCategorias, 
  descargarArchivo, 
  registrarVisualizacion, 
  obtenerArchivosMock, 
  obtenerCategoriasMock 
} from '../services/bibliotecaService';

/**
 * Componente Biblioteca que muestra los archivos disponibles para las referencias
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onCerrar - Función para cerrar la biblioteca
 * @param {Array} props.referencias - Lista de referencias disponibles (opcional)
 */
const Biblioteca = ({ onCerrar, referencias = [] }) => {
  const [referenciaSeleccionada, setReferenciaSeleccionada] = useState('');
  const [tabActivo, setTabActivo] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [categorias, setCategorias] = useState([{ id: 0, nombre: 'Todos los documentos' }]);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  // Lista de referencias disponibles (si no se proporcionan en las props)
  const referenciasDisponibles = referencias.length > 0 
    ? referencias 
    : [
        { id: 'VER25-000524', descripcion: 'Importación de mercancías' },
        { id: 'VER25-000523', descripcion: 'Exportación de bienes' }
      ];

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Manejar cambio de referencia seleccionada
  useEffect(() => {
    if (referenciaSeleccionada) {
      cargarArchivos(referenciaSeleccionada);
    }
  }, [referenciaSeleccionada]);

  // Cargar categorías desde el servicio
  const cargarCategorias = async () => {
    try {
      // Intentar obtener categorías del servicio
      const respuesta = await obtenerCategorias();
      
      if (respuesta.ok) {
        // Añadir categoría "Todos los documentos" al inicio
        const todasCategorias = [{ id: 0, nombre: 'Todos los documentos' }, ...respuesta.categorias];
        setCategorias(todasCategorias);
      } else {
        // Si falla, usar datos mock
        const mockData = obtenerCategoriasMock();
        const todasCategorias = [{ id: 0, nombre: 'Todos los documentos' }, ...mockData.categorias];
        setCategorias(todasCategorias);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      // Usar categorías por defecto en caso de error
      const categoriasDefault = [
        { id: 0, nombre: 'Todos los documentos' },
        { id: 1, nombre: 'Pedimentos' },
        { id: 2, nombre: 'Facturas' },
        { id: 3, nombre: 'Reportes' },
        { id: 4, nombre: 'Otros' }
      ];
      setCategorias(categoriasDefault);
    }
  };

  // Cargar archivos de una referencia
  const cargarArchivos = async (referenciaId) => {
    try {
      setCargando(true);
      setError(null);
      
      // Intentar obtener archivos del servicio
      const respuesta = await obtenerArchivosPorReferencia(referenciaId);
      
      if (respuesta.ok) {
        setArchivos(respuesta.archivos);
      } else {
        // Si falla, usar datos mock
        const mockData = obtenerArchivosMock(referenciaId);
        setArchivos(mockData.archivos);
      }
      
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      setError('Error al cargar los archivos de la referencia');
      
      // Intentar usar datos mock en caso de error
      const mockData = obtenerArchivosMock(referenciaId);
      setArchivos(mockData.archivos);
    } finally {
      setCargando(false);
    }
  };

  // Obtener icono según tipo de archivo
  const getIconoArchivo = (tipo) => {
    switch (tipo) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'excel':
        return <ExcelIcon color="success" />;
      case 'imagen':
        return <ImageIcon color="primary" />;
      default:
        return <DocumentIcon color="action" />;
    }
  };

  // Filtrar archivos según la categoría seleccionada
  const archivosFiltrados = () => {
    if (tabActivo === 0) {
      return archivos;
    }
    
    const categoriaSeleccionada = categorias[tabActivo].nombre;
    return archivos.filter(archivo => archivo.categoria === categoriaSeleccionada);
  };

  // Abrir menú de opciones para un archivo
  const handleMenuClick = (event, archivo) => {
    setMenuAnchorEl(event.currentTarget);
    setArchivoSeleccionado(archivo);
  };

  // Cerrar menú de opciones
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Visualizar archivo
  const handleVerArchivo = async () => {
    if (archivoSeleccionado) {
      try {
        // Registrar visualización
        await registrarVisualizacion(archivoSeleccionado.id);
        
        // Simular apertura del archivo
        window.open(archivoSeleccionado.url, '_blank');
        
        // Cerrar menú
        handleMenuClose();
      } catch (error) {
        console.error('Error al visualizar archivo:', error);
        
        // Simular visualización aunque falle el registro
        window.open(archivoSeleccionado.url, '_blank');
        handleMenuClose();
      }
    }
  };

  // Descargar archivo
  const handleDescargarArchivo = async () => {
    if (archivoSeleccionado) {
      try {
        const respuesta = await descargarArchivo(archivoSeleccionado.id);
        
        if (respuesta.ok) {
          alert(`Archivo descargado: ${archivoSeleccionado.nombre}`);
        } else {
          alert(`Error al descargar: ${respuesta.message}`);
        }
        
        handleMenuClose();
      } catch (error) {
        console.error('Error al descargar archivo:', error);
        alert('Error al descargar el archivo');
        handleMenuClose();
      }
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
            Biblioteca de Documentos
          </Typography>
        </Box>
      </Box>

      {/* Selector de Referencia */}
      <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Seleccione una referencia para ver sus documentos
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {referenciasDisponibles.map((referencia) => (
            <Grid item xs={12} sm={6} md={4} key={referencia.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: referenciaSeleccionada === referencia.id ? '2px solid #3f51b5' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => setReferenciaSeleccionada(referencia.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <FolderIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6">
                        {referencia.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {referencia.descripcion}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mostrar mensaje si no hay referencia seleccionada */}
      {!referenciaSeleccionada && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Seleccione una referencia para visualizar sus documentos disponibles.
        </Alert>
      )}

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mostrar contenido cuando hay una referencia seleccionada */}
      {referenciaSeleccionada && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Documentos para la referencia: {referenciaSeleccionada}
          </Typography>
          
          {/* Pestañas de categorías */}
          <Tabs 
            value={tabActivo} 
            onChange={(e, newValue) => setTabActivo(newValue)}
            sx={{ mb: 3 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categorias.map(categoria => (
              <Tab key={categoria.id} label={categoria.nombre} />
            ))}
          </Tabs>

          {/* Indicador de carga */}
          {cargando && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Mensaje si no hay archivos */}
          {!cargando && archivosFiltrados().length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No se encontraron documentos para esta categoría.
            </Alert>
          )}

          {/* Lista de archivos */}
          {!cargando && archivosFiltrados().length > 0 && (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              {archivosFiltrados().map((archivo) => (
                <React.Fragment key={archivo.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getIconoArchivo(archivo.tipo)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={archivo.nombre} 
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {archivo.fechaCreacion} • {archivo.tamano} • {archivo.categoria}
                        </Typography>
                      }
                    />
                    <IconButton 
                      aria-label="opciones"
                      onClick={(event) => handleMenuClick(event, archivo)}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          {/* Menú de opciones para archivo */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleVerArchivo}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Visualizar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDescargarArchivo}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Descargar</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}

      {/* Botones de acción en la parte inferior */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onCerrar}
        >
          Cerrar Biblioteca
        </Button>
      </Box>
    </Paper>
  );
};

export default Biblioteca; 
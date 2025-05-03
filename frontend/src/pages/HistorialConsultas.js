import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Check as CheckIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  FindInPage as FindInPageIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';
import { obtenerHistorialConsultas } from '../services/historialService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const HistorialConsultas = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState({
    pagina: 0,
    limite: 10,
    total: 0,
    paginas: 0
  });

  // Obtener historial al cargar el componente
  useEffect(() => {
    cargarHistorial();
  }, [paginacion.pagina, paginacion.limite]);

  // Función para cargar historial
  const cargarHistorial = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuesta = await obtenerHistorialConsultas(paginacion.pagina + 1, paginacion.limite);
      
      if (respuesta.ok) {
        setHistorial(respuesta.historial.consultas);
        setPaginacion({
          ...paginacion,
          total: respuesta.historial.total,
          paginas: respuesta.historial.paginas
        });
      } else {
        setError(respuesta.message);
      }
    } catch (error) {
      setError('Error al cargar el historial: ' + error.message);
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPaginacion({
      ...paginacion,
      pagina: newPage
    });
  };

  // Manejar cambio de límite de registros por página
  const handleChangeRowsPerPage = (event) => {
    setPaginacion({
      ...paginacion,
      limite: parseInt(event.target.value, 10),
      pagina: 0
    });
  };

  // Obtener icono según el tipo de consulta
  const obtenerIconoTipoConsulta = (tipo) => {
    switch (tipo) {
      case 'LISTAR':
        return <ListAltIcon fontSize="small" />;
      case 'DETALLE':
        return <FindInPageIcon fontSize="small" />;
      case 'BUSQUEDA':
        return <SearchIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    try {
      return format(new Date(fecha), 'dd MMM yyyy HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Historial de Consultas
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          A continuación se muestra el registro de todas sus consultas de referencias realizadas en el sistema.
        </Typography>

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
            No se encontraron registros de consultas en su historial.
          </Alert>
        )}

        {/* Tabla de historial */}
        {!cargando && historial.length > 0 && (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Fecha</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Referencia</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Tipo</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Detalle</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historial.map((consulta) => (
                    <TableRow key={consulta.nId06RegistroConsulta}>
                      <TableCell>{formatearFecha(consulta.dFechaConsulta)}</TableCell>
                      <TableCell>{consulta.sFolioReferencia}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {obtenerIconoTipoConsulta(consulta.sTipoConsulta)}
                          <Box ml={1}>{consulta.sTipoConsulta}</Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={consulta.bExito ? <CheckIcon /> : <ErrorIcon />}
                          label={consulta.bExito ? 'Exitosa' : 'Fallida'}
                          color={consulta.bExito ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {consulta.sDetalleConsulta || (consulta.sError ? 'Error: ' + consulta.sError : 'Sin detalles')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={paginacion.total}
              rowsPerPage={paginacion.limite}
              page={paginacion.pagina}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default HistorialConsultas; 
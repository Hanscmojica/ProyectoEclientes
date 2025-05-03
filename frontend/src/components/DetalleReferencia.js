import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  AssignmentInd as PatentIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Scale as ScaleIcon,
  Description as DescriptionIcon,
  ListAlt as ListAltIcon,
  Flag as FlagIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  SupervisorAccount as ExecutiveIcon
} from '@mui/icons-material';

/**
 * Componente para mostrar los detalles de una referencia
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.referencia - Datos de la referencia
 * @param {Function} props.onCerrar - Función para cerrar el detalle
 */
const DetalleReferencia = ({ referencia, onCerrar }) => {
  if (!referencia) return null;

  // Definir los detalles a mostrar
  const detalles = [
    { 
      icon: <CalendarIcon color="primary" />, 
      label: 'Fecha de operación', 
      value: referencia.fechaOperacion 
    },
    { 
      icon: <BusinessIcon color="primary" />, 
      label: 'Aduana involucrada', 
      value: referencia.aduanaInvolucrada 
    },
    { 
      icon: <PatentIcon color="primary" />, 
      label: 'Número de patente', 
      value: referencia.numeroPatente 
    },
    { 
      icon: <InventoryIcon color="primary" />, 
      label: 'Bultos', 
      value: referencia.bultos 
    },
    { 
      icon: <ListAltIcon color="primary" />, 
      label: 'Cantidad de mercancía', 
      value: referencia.cantidadMercancia 
    },
    { 
      icon: <CategoryIcon color="primary" />, 
      label: 'Clase de bulto', 
      value: referencia.claseBulto 
    },
    { 
      icon: <ScaleIcon color="primary" />, 
      label: 'Peso bruto', 
      value: referencia.pesoBruto 
    },
    { 
      icon: <FlagIcon color="primary" />, 
      label: 'Estado del proceso', 
      value: referencia.estado 
    },
    { 
      icon: <DescriptionIcon color="primary" />, 
      label: 'Descripción de mercancías', 
      value: referencia.descripcionMercancias 
    },
    { 
      icon: <ExecutiveIcon color="primary" />, 
      label: 'Ejecutivo', 
      value: referencia.ejecutivo || 'No asignado' 
    },
    { 
      icon: <PersonIcon color="primary" />, 
      label: 'Cliente', 
      value: referencia.cliente || 'No especificado' 
    }
  ];

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
            Visualización de Detalle de Referencia
          </Typography>
        </Box>
        <Box>
          <Button 
            startIcon={<PrintIcon />} 
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Imprimir
          </Button>
          <Button 
            startIcon={<ShareIcon />} 
            variant="outlined"
          >
            Compartir
          </Button>
        </Box>
      </Box>

      {/* Folio de referencia */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 3, 
          borderRadius: 2,
          mb: 4
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Folio de la Referencia
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {referencia.id}
        </Typography>
      </Paper>

      {/* Lista de detalles */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <List>
            {detalles.slice(0, 6).map((detalle, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {detalle.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={detalle.label} 
                    secondary={
                      <Typography variant="body1" fontWeight="medium">
                        {detalle.value}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < 5 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <List>
            {detalles.slice(6).map((detalle, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {detalle.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={detalle.label} 
                    secondary={
                      <Typography variant="body1" fontWeight="medium">
                        {detalle.value}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < 4 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>

      {/* Botones de acción en la parte inferior */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onCerrar}
          sx={{ mr: 2 }}
        >
          Cerrar
        </Button>
        <Button 
          variant="contained" 
          color="primary"
        >
          Descargar documentos
        </Button>
      </Box>
    </Paper>
  );
};

export default DetalleReferencia; 
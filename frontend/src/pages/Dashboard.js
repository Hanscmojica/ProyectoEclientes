import React, { useContext, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  InsertDriveFile as FileIcon,
  MonitorHeart as MonitorIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Referencias from './Referencias';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a referencias por defecto
    navigate('/dashboard/referencias', { replace: true });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            e-Clientes | Sistema de Agencia Aduanal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user && `Perfil: ${user.perfil.join(', ')}`}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/referencias/*" element={<Referencias />} />
          <Route path="/" element={<Referencias />} />
        </Routes>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} e-Clientes - Sistema de Agencia Aduanal
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 
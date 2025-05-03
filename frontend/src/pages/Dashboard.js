import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  InsertDriveFile as FileIcon,
  History as HistoryIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import Referencias from './Referencias';
import HistorialConsultas from './HistorialConsultas';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Redirigir a referencias por defecto si estamos en la ruta raíz del dashboard
    if (window.location.pathname === '/dashboard') {
      navigate('/dashboard/referencias', { replace: true });
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMenu}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
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

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Menú lateral para pantallas grandes */}
        <Box
          component="nav"
          sx={{ width: { md: 240 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}
        >
          <List>
            <ListItem 
              button 
              component={Link} 
              to="/dashboard/referencias"
              selected={window.location.pathname.includes('/referencias')}
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText primary="Referencias" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/dashboard/historial"
              selected={window.location.pathname.includes('/historial')}
            >
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Historial de Consultas" />
            </ListItem>
          </List>
        </Box>

        {/* Menú lateral para móviles */}
        <Drawer
          variant="temporary"
          open={menuOpen}
          onClose={toggleMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <List>
            <ListItem 
              button 
              component={Link} 
              to="/dashboard/referencias"
              selected={window.location.pathname.includes('/referencias')}
              onClick={toggleMenu}
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText primary="Referencias" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/dashboard/historial"
              selected={window.location.pathname.includes('/historial')}
              onClick={toggleMenu}
            >
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Historial de Consultas" />
            </ListItem>
          </List>
        </Drawer>

        {/* Contenido principal */}
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/referencias/*" element={<Referencias />} />
            <Route path="/historial" element={<HistorialConsultas />} />
            <Route path="/" element={<Referencias />} />
          </Routes>
        </Container>
      </Box>

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
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" mt={2} color="textSecondary">
        Cargando...
      </Typography>
    </Box>
  );
};

export default Loading; 
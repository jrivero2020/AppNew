import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DashboardProvider } from './context/dashboardContext';
import PagosConfigMontoBox from './PagosConfigMontoBox';
import TiposBecaBox from './TiposBecaBox';
import BecasAlumnosBox from './BecasAlumnosBox';

const DashBoardBecas = () => {
  return (
    <DashboardProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Sistema de Gestión de Becas
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PagosConfigMontoBox />
          </Grid>
{/*          
          <Grid item xs={12} md={6}>
            <TiposBecaBox />
          </Grid>
          
          <Grid item xs={12}>
            <BecasAlumnosBox />
          </Grid>
*/}          
        </Grid>
      </Box>
    </DashboardProvider>
  );
};

export default DashBoardBecas;
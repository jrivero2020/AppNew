import React from 'react';
import { Box } from '@mui/material';
import PagosConfigMontoBox from './PagosConfigMontoBox'
 const DashBoardBecas = () => {
  return (
    
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <PagosConfigMontoBox />
      {/* Aquí irá el componente de pagos_tipo_beca (próximo paso) */}
    </Box>

  );
};

export default DashBoardBecas;
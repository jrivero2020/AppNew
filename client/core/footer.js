import * as React from 'react';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#f5f5f5' }}>
      <p>Este es el pie de página</p>
    </Box>
  );
};

export default Footer;
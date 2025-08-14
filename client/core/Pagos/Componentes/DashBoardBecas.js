import React, {useContext, useState} from 'react';
import { Box, Grid, Typography }  from '@mui/material';
import ConfigMonto from './ConfigMontos'
import PagosTipoBecas from './PagosTipoBecas'
import { AuthContext } from "../../AuthProvider";
//import ConfigMontoBox             from '../Componentes/ConfigMontos/PagosConfigMontoBox';
//import TiposBecaBox               from '../Componentes/TiposBeca/TiposBecaBox';
//import BecasAlumnosBox            from '../Componentes/BecasAlumnos/BecasAlumnosBox';

const DashboardBecas = () => {
  const { jwt } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [configMonto, setConfigMonto] = useState(0)
  const credentials = { t: jwt.token  }; 
  
  return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Sistema de Gestión de Becas
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ConfigMonto credentials={credentials} onSelectYear={setSelectedYear} 
            selectedYear={selectedYear}
            configMonto={configMonto}
            setConfigMonto={setConfigMonto}            
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
             <PagosTipoBecas credentials={credentials}
            selectedYear={selectedYear}
            configMonto={configMonto} />
          </Typography>
          </Grid>
{/*
          <Grid item xs={12}>
            <BecasAlumnosBox />
          </Grid>
        */ }
        </Grid>
      </Box>
  );
};

export default DashboardBecas;
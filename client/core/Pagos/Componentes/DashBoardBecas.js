import React, { useContext, useState } from "react";
import { Box, Grid, Typography, Fab, Zoom, IconButton } from "@mui/material";
import { Restore, ExpandLess, ExpandMore } from "@mui/icons-material";
import ConfigMonto from "./ConfigMontos";
import PagosTipoBecas from "./PagosTipoBecas";
import AsignarBecaAlumnos from "./PagoAsignarBecaAlumnos";
import { AuthContext } from "../../AuthProvider";

const DashboardBecas = () => {
  const { jwt } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [configMonto, setConfigMonto] = useState(0);
  const [objBecas, setObjBecas] = useState({
    id: 0,
    nombre: "",
    porcentaje: 0,
    descuento: 0,
    monto: 0,
  });
  const [compactView, setCompactView] = useState(false);
  const credentials = { t: jwt.token };

  const handleCursoSelect = (isSelected) => {
    setCompactView(isSelected);
  };

  const handleRestoreView = () => {
    setCompactView(false);
  };

  const toggleCompactView = () => {
    setCompactView(!compactView);
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        <i className="fas fa-graduation-cap" style={{ marginRight: '10px' }}></i>
        Sistema de Gestión de Becas
      </Typography>

      <Grid container spacing={3} sx={{ position: 'relative', alignItems: 'flex-start' }}>
        <Grid item xs={12} md={6} sx={{ 
          transition: 'all 0.4s ease',
          opacity: compactView ? 0.9 : 1,
          transform: compactView ? 'scale(0.95)' : 'scale(1)'
        }}>
          <ConfigMonto
            credentials={credentials}
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
            configMonto={configMonto}
            setConfigMonto={setConfigMonto}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ 
          transition: 'all 0.4s ease',
          opacity: compactView ? 0.9 : 1,
          transform: compactView ? 'scale(0.95)' : 'scale(1)',
          position: 'relative'
        }}>
          {/* Botón para expandir/contraer manualmente */}
          <IconButton
            onClick={toggleCompactView}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {compactView ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
          
          <PagosTipoBecas
            credentials={credentials}
            selectedYear={selectedYear}
            configMonto={configMonto}
            objBecas={objBecas}
            setObjBecas={setObjBecas}
            compactView={compactView}
          />
        </Grid>

        <Grid item xs={12} sx={{ 
          transition: 'all 0.4s ease',
          marginTop: compactView ? '-300px' : '0',
          zIndex: compactView ? 1000 : 1
        }}>
          <AsignarBecaAlumnos
            credentials={credentials}
            selectedYear={selectedYear}
            configMonto={configMonto}
            selectedBeca={objBecas}
            onCursoSelect={handleCursoSelect}
            compactView={compactView}
            onToggleCompactView={toggleCompactView}
          />
        </Grid>
      </Grid>

      {/* Botón de restaurar vista */}
      <Zoom in={compactView} timeout={400}>
        <Fab
          color="primary"
          aria-label="restore-view"
          onClick={handleRestoreView}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 2000
          }}
        >
          <Restore />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default DashboardBecas;
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const HorarioAtencionProfesores = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de niveles de curso
  const niveles = {
    1: 'Pre Básica',
    2: 'Básica',
    3: 'Media',
    4: 'Media y Básica',
    5: 'Otros'
  };

  // Función para simular la llamada a la API (debes reemplazar esto)
  const fetchData = async () => {
    try {
      // SIMULACIÓN - Reemplazar con tu llamada real a la API
      // const response = await fetch('/api/horarios-profesores');
      // const data = await response.json();
      
      // Datos de ejemplo (eliminar cuando tengas la API)
      const data = [
        {
          nombre_completo: 'MARGARITA ISABEL',
          jefatura: '1° A',
          día: 'Lunes',
          desde: '15:00',
          hasta: '16:30',
          nivelcurso: 2
        },
        {
          nombre_completo: 'JOSEFINA CONSTANZA',
          jefatura: 'Kínder A',
          día: 'Martes',
          desde: '14:00',
          hasta: '15:30',
          nivelcurso: 1
        },
        // Agrega más datos de ejemplo según necesites
      ];
      
      setHorarios(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los horarios');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Agrupar horarios por nivelcurso
  const horariosPorNivel = horarios.reduce((acc, horario) => {
    const nivel = horario.nivelcurso;
    if (!acc[nivel]) {
      acc[nivel] = [];
    }
    acc[nivel].push(horario);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Horario de Atención Profesores
      </Typography>
      
      {[1, 2, 3, 4, 5].map(nivel => (
        horariosPorNivel[nivel] && (
          <Box key={nivel} sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
              mb: 2
            }}>
              {niveles[nivel]}
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Profesor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Jefatura</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Día</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Horario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {horariosPorNivel[nivel].map((profesor, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{profesor.nombre_completo}</TableCell>
                      <TableCell>{profesor.jefatura}</TableCell>
                      <TableCell>{profesor.día}</TableCell>
                      <TableCell>{profesor.desde} - {profesor.hasta}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )
      ))}
    </Box>
  );
};

export default HorarioAtencionProfesores;
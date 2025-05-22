import React, { useState, useEffect } from "react";
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
  Alert,
  Grid,
  useMediaQuery,
  Button,
} from "@mui/material";
import { getHorarioAtencionProfe } from "../docentes/api-docentes";
import { useNavigate } from "react-router";

const HorarioAtencionProfesores = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  // Mapeo de niveles de curso
  const niveles = {
    1: "Pre Básica",
    2: "Básica",
    3: "Media",
    4: "Media y Básica",
    5: "Otros",
  };

  // Función para simular la llamada a la API (debes reemplazar esto)

  const fetchHorariosProfe = async () => {
    try {
      const data = await getHorarioAtencionProfe();
      console.log("HHprofe data=>:, Object.values(data)", Object.values(data));
      setHorarios(Object.values(data));
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los horarios de profesores");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHorariosProfe();
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:720px)");
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
    <Grid
      container
      justifyContent="center"
      spacing={2}
      sx={{
        margin: "auto",
        width: { xs: "100%", sm: "95%", md: "75%" }, // Más gradual
        mt: isSmallScreen ? 1 : 12, // Implementación directa
        px: { xs: 0.5, sm: 2 }, // Padding horizontal menor en móviles
        boxSizing: "border-box",
        pb: 4, // Padding bottom para evitar que quede pegado al final
      }}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Paper
          elevation={9}
          sx={{
            px: { xs: 0.5, sm: 1 },
            pb: 2,
            backgroundColor: "#efebe9",
            width: { xs: "100%", sm: "95%", md: "75%" }, // Aquí aplicamos los anchos específicos
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
          >
            Horario de Atención Profesores
          </Typography>
          <Box sx={{ p: 3, maxWidth: "100%", overflowX: "auto" }}>
            {[1, 2, 3, 4, 5].map(
              (nivel) =>
                horariosPorNivel[nivel] && (
                  <Box key={nivel} sx={{ mb: 6 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        borderBottom: "2px solid",
                        borderColor: "primary.main",
                        pb: 1,
                        mb: 2,
                      }}
                    >
                      {niveles[nivel]}
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                      <Table size="medium">
                        <TableHead sx={{ bgcolor: "primary.light" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Profesor
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {nivel === 5 ? "Unidad" : "Jefatura"}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Día
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Horario
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {horariosPorNivel[nivel].map((profesor, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{profesor.nombre_completo}</TableCell>
                              <TableCell>{profesor.jefatura}</TableCell>
                              <TableCell>{profesor.dia}</TableCell>
                              <TableCell>
                                {profesor.desde} - {profesor.hasta}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )
            )}
          </Box>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              Navigate("/");
            }}
          >
            Cerrar
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HorarioAtencionProfesores;

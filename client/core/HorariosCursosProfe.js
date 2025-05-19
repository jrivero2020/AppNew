import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  CircularProgress,
  IconButton,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import { Save, Delete, Add } from "@mui/icons-material";

//import { TimePicker } from "@mui/x-date-pickers/TimePicker";
//import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
//import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  getCursos,
  getDiasAtencion,
  getCursosProfe,
  getHorarioProfe,
  postCursosDiaAtencionProfes,
} from "../docentes/api-docentes";

import { AuthContext } from "./AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const AsignacionCompleta = ({
  rutFuncionario: propRut,
  nombreProfesor: propNombre,
}) => {
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:720px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [nuevoHorario, setNuevoHorario] = useState({
    id_dia: "",
    hora_desde: "",
    hora_hasta: "",
  });
  const [loading, setLoading] = useState(true);
  const { jwt } = useContext(AuthContext);

  //const rutFuncionario = jwt.user._id;
  //const nombreProfesor = jwt.user._name;

  const rutFuncionario = propRut || jwt.user._id;
  const nombreProfesor = propNombre || jwt.user._name;

  const usrRol = jwt.user._rol;
  const abortController = new AbortController();
  const signal = abortController.signal;
  const navigate = useNavigate();
  const themeLocal = createTheme({
    palette: {
      primary: {
        main: "#1976d2", // Este es el azul estándar de Material-UI
        light: "#42a5f5",
        dark: "#00008b",
      },
      secondary: {
        main: "#9c27b0",
      },
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosAsignadosRes, horariosRes, cursosRes, diasRes] =
          await Promise.all([
            getCursosProfe({ rut: rutFuncionario }, signal),
            getHorarioProfe({ rut: rutFuncionario }, signal),
            getCursos(),
            getDiasAtencion(),
          ]);

        const cursosArray = Object.values(cursosAsignadosRes); // Convierte a array
        const horariosArray = Object.values(horariosRes); // Convierte a array
        setCursosDisponibles(cursosRes);
        setDiasDisponibles(diasRes);
        setCursosSeleccionados(cursosArray.map((c) => c.id_curso));
        // Al obtener los datos:
        const horariosFiltrados = horariosArray.map(
          ({ id_dia, dia, desde, hasta }) => ({
            id_dia,
            dia,
            desde,
            hasta,
          })
        );

        const horariosUnicos = horariosFiltrados.filter(
          (horario, index, self) =>
            index ===
            self.findIndex(
              (h) =>
                h.id_dia === horario.id_dia &&
                h.dia === horario.dia &&
                h.desde === horario.desde &&
                h.hasta === horario.hasta
            )
        );

        setHorarios(
          horariosUnicos.map((h) => ({
            id_dia: h.id_dia,
            hora_desde: h.desde,
            hora_hasta: h.hasta,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutFuncionario]);

  const handleCursoChange = (idCurso) => {
    setCursosSeleccionados((prev) =>
      prev.includes(idCurso)
        ? prev.filter((id) => id !== idCurso)
        : [...prev, idCurso]
    );
  };

  const handleHorarioChange = (e) => {
    setNuevoHorario({
      ...nuevoHorario,
      [e.target.name]: e.target.value,
    });
  };
  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const agregarHorario = () => {
    if (
      nuevoHorario.id_dia &&
      nuevoHorario.hora_desde &&
      nuevoHorario.hora_hasta
    ) {
      setHorarios([
        ...horarios,
        {
          id_dia: parseInt(nuevoHorario.id_dia),
          hora_desde: nuevoHorario.hora_desde,
          hora_hasta: nuevoHorario.hora_hasta,
        },
      ]);
      setNuevoHorario({ id_dia: "", hora_desde: "", hora_hasta: "" });
    }
  };

  const eliminarHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const guardarAsignacion = async () => {
    const arrayFiltrado = cursosSeleccionados.filter((item) => item !== null);
    const horarioFiltrado = horarios.filter((item) => item !== null);
    if (horarioFiltrado.length === 0 && arrayFiltrado.length === 0) return;
    console.log(
      "cursosSeleccionados:",
      arrayFiltrado,
      "arrayFiltrado:",
      horarioFiltrado
    );
    try {
      await postCursosDiaAtencionProfes(
        {
          rut: rutFuncionario,
          cursos: arrayFiltrado,
          horarios: horarioFiltrado,
        },
        { t: jwt.token }
      );
      setSnackbarMessage("Solicitud enviada correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        `Error al guardar: ${error.response?.data?.error || error.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={themeLocal}>
      <Container
        maxWidth={false}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid
          container
          maxWidth="lg"
          rowSpacing={1}
          columnSpacing={2}
          sx={{ mt: isSmallScreen ? 1 : 12 }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "primary.dark",
              textAlign: "center", // Centra el texto horizontalmente
              width: "100%", // Asegura que ocupe todo el ancho disponible
              mt: 1,
            }}
          >
            Asignar Curso: {nombreProfesor}
          </Typography>
          <Card sx={{ mb: 4, justifyContent: "center", alignItems: "center" }}>
            <CardHeader
              title="Profesor(a) Jefe(a) de "
              titleTypographyProps={{ variant: "h6" }}
              sx={{ bgcolor: "primary.main", color: "white" }}
            />
            <CardContent>
              <Grid
                container
                rowSpacing={0.25}
                columnSpacing={2}
                sx={{
                  justifyContent: "center", // Centra horizontalmente
                  alignItems: "center", // Centra verticalmente (si es necesario)
                }}
              >
                {cursosDisponibles.map((curso) => (
                  <Grid item xs={12} sm={6} md={3} key={curso.id_curso}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={cursosSeleccionados.includes(curso.id_curso)}
                          onChange={() => handleCursoChange(curso.id_curso)}
                        />
                      }
                      label={`${curso.nomlargo}`}
                      sx={{
                        // Estilo cuando está seleccionado
                        "& .MuiFormControlLabel-label": {
                          color: cursosSeleccionados.includes(curso.id_curso)
                            ? "primary.main"
                            : "inherit", // Color por defecto si no está seleccionado
                          fontWeight: cursosSeleccionados.includes(
                            curso.id_curso
                          )
                            ? "bold"
                            : "normal", // Opcional: negrita para resaltar más
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              <Card
                sx={{ mb: 4, justifyContent: "center", alignItems: "center" }}
              >
                <CardHeader
                  title="Horarios de Atención"
                  titleTypographyProps={{ variant: "h6" }}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    textAlign: "center",
                  }}
                />
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      mb: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <TextField
                        select
                        fullWidth
                        label="Día"
                        name="id_dia"
                        value={nuevoHorario.id_dia}
                        onChange={handleHorarioChange}
                        required
                      >
                        <MenuItem value="">Seleccione día</MenuItem>
                        {diasDisponibles.map((dia) => (
                          <MenuItem key={dia.id} value={dia.id}>
                            {dia.nombre_dia}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Hora Inicio"
                        type="time"
                        name="hora_desde"
                        value={nuevoHorario.hora_desde}
                        onChange={handleHorarioChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: "07:00",
                          max: "18:00", //step: 1800 Opcional: incrementos de 30 minutos (1800 segundos)
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Hora Fin"
                        type="time"
                        name="hora_hasta"
                        value={nuevoHorario.hora_hasta}
                        onChange={handleHorarioChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: "07:00",
                          max: "18:00", //step: 1800 Opcional: incrementos de 30 minutos (1800 segundos)
                        }}
                        required
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={agregarHorario}
                        disabled={
                          !nuevoHorario.id_dia ||
                          !nuevoHorario.hora_desde ||
                          !nuevoHorario.hora_hasta
                        }
                        fullWidth
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>

                  {horarios.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Día</TableCell>
                          <TableCell>Hora Inicio</TableCell>
                          <TableCell>Hora Fin</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {horarios.map((horario, index) => {
                          const dia = diasDisponibles.find(
                            (d) => d.id === horario.id_dia
                          );
                          return (
                            <TableRow key={index}>
                              <TableCell
                                sx={{
                                  color: "primary.main",
                                  fontWeight: "bold",
                                }}
                              >
                                {dia?.nombre_dia || "Desconocido"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "primary.main",
                                  fontWeight: "bold",
                                }}
                              >
                                {horario.hora_desde}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "primary.main",
                                  fontWeight: "bold",
                                }}
                              >
                                {horario.hora_hasta}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="error"
                                  onClick={() => eliminarHorario(index)}
                                  title="Eliminar horario"
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert severity="info">No hay horarios asignados</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={4}>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<Save />}
                onClick={guardarAsignacion}
                disabled={
                  cursosSeleccionados.length === 0 && horarios.length === 0
                }
              >
                Guardar Asignación Cursos/Horario de Atención
              </Button>
            </Grid>
            {(usrRol === 1 || usrRol === 2) && (
              <Grid item>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => navigate("/AsignacionWrapper")}
                  sx={{ mb: 2 }}
                >
                  Volver
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        {/* Snackbar para mensajes */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default AsignacionCompleta;

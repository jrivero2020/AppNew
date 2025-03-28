import React, { useState, useEffect, useContext } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";
import {
  getCursos,
  getAsignaturas,
  getEquipamientos,
  createSolicitud,
  getBloquesHorarios,
  liberarSolicitud,
  api_GetFeriados,
} from "../docentes/api-docentes";
import { AuthContext } from "./../core/AuthProvider";

const SolicitudEquipos = () => {
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [equipamientos, setEquipamientos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedAsignatura, setSelectedAsignatura] = useState("");
  const [selectedJornada, setSelectedJornada] = useState("");
  const [selectedEquipamiento, setSelectedEquipamiento] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bloquesHorarios, setBloquesHorarios] = useState([]);
  const [selectedBloques, setSelectedBloques] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [cantidad, setCantidad] = useState(1); // Valor inicial de 1
  const { jwt } = useContext(AuthContext);
  const [selectedReservedBlocks, setSelectedReservedBlocks] = useState([]);
  const [feriados, setFeriados] = useState([]);
  
  const idProfesor = jwt.user._id;
  // const idProfesor =  26
  const abortController = new AbortController();
  const signal = abortController.signal;
  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosData, asignaturasData, equipamientosData, dferiados] =
          await Promise.all([
            getCursos(),
            getAsignaturas(),
            getEquipamientos(),
            api_GetFeriados(),
          ]);
console.log("Dias feriados obtenidos===>",dferiados)
        setCursos(cursosData);
        setAsignaturas(asignaturasData);
        setEquipamientos(equipamientosData);
        setJornadas([
          { id: 1, nombre: "Mañana" },
          { id: 2, nombre: "Tarde" },
        ]);
        setFeriados(dferiados.map(f => dayjs(f.diaferiado)));
      } catch (error) {
        console.error("Error cargando datos:", error);
        setSnackbarMessage("Error cargando datos iniciales");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchData();
  }, []);

  // Cargar bloques horarios cuando se selecciona jornada, equipamiento y fecha
  useEffect(() => {
    console.log("selectedEquipamiento==>", selectedEquipamiento);
    if (selectedJornada && selectedEquipamiento && selectedDate) {
      const fetchBloquesHorarios = async () => {
        try {
          const bloquesData = await getBloquesHorarios({
            jornada_id: selectedJornada,
            equipamiento_id: selectedEquipamiento,
            fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
          });
          console.log("bloquesData de bloques horarios==>", bloquesData);
          setBloquesHorarios(bloquesData);
        } catch (error) {
          console.error("Error cargando bloques horarios:", error);
          setSnackbarMessage("Error cargando bloques horarios");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
      fetchBloquesHorarios();
    }
  }, [selectedJornada, selectedEquipamiento, selectedDate]);

  const shouldDisableDate = (date) => {
    const day = date.day();
    return (
      date.isBefore(dayjs(), 'day') ||
      day === 0 ||
      day === 6 ||
      feriados.some(feriado => date.isSame(feriado, 'day'))
    );
  };


  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar stock disponible
    const stockDisponible = selectedEquipamiento === "Tablet" ? 60 : 45;
    if (cantidad > stockDisponible) {
      setSnackbarMessage(
        `La cantidad solicitada excede el stock disponible (${stockDisponible}).`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const solicitudData = {
      id_profesor: idProfesor,
      id_curso: selectedCurso,
      id_asignatura: selectedAsignatura,
      id_jornada: selectedJornada,
      id_equipamiento: selectedEquipamiento,
      fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      bloques_seleccionados: selectedBloques.map((bloque) => ({
        id_bloque: bloque,
      })),
      cantidad:
        selectedEquipamiento === "Chromebook" ||
        selectedEquipamiento === "Tablet"
          ? cantidad
          : null, // Incluir cantidad solo para Chromebook y Tablet
    };

    try {
      const data = await createSolicitud(
        solicitudData,
        { t: jwt.token },
        signal
      );
      if (data?.error) {
        throw new Error(data.error);
      }
      setSelectedBloques([]);
      setSelectedReservedBlocks([]);

      setSnackbarMessage("Solicitud enviada correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      const bloquesData = await getBloquesHorarios({
        jornada_id: selectedJornada,
        equipamiento_id: selectedEquipamiento,
        fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      });
      setBloquesHorarios(bloquesData);
    } catch (error) {
      console.log("error==>", error);
      setSnackbarMessage("Error al enviar la solicitud");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleLiberarBloques = async () => {
    const desbloquear = {
      id_profesor: idProfesor,
      jornada_id: selectedJornada,
      id_equipamiento: selectedEquipamiento,
      fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      bloques_ids: selectedReservedBlocks.map((bloque) => ({
        id_bloque: bloque,
      })),
    };

    try {
      setBloquesHorarios((prevBloques) =>
        prevBloques.map((bloque) =>
          selectedReservedBlocks.includes(bloque.bloque_id)
            ? { ...bloque, estado: "disponible", id_profesor_reserva: null }
            : bloque
        )
      );

      const data = await liberarSolicitud(
        desbloquear,
        { t: jwt.token },
        signal
      );
      if (data?.error) {
        throw new Error(data.error);
      }

      const bloquesData = await getBloquesHorarios({
        jornada_id: selectedJornada,
        equipamiento_id: selectedEquipamiento,
        fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      });
      setBloquesHorarios(bloquesData);
      setSnackbarMessage(data.message || "Bloques liberados correctamente");
      setSnackbarSeverity("success");
      setSelectedReservedBlocks([]);
    } catch (error) {
      // Revertir cambios si hay error
      const bloquesData = await getBloquesHorarios({
        jornada_id: selectedJornada,
        equipamiento_id: selectedEquipamiento,
        fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      });
      setBloquesHorarios(bloquesData);

      console.error("Error liberando bloques:", error);
      setSnackbarMessage(error.message || "Error al liberar bloques");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
 <Grid container justifyContent="center" style={{ padding: '20px', marginTop: '80px' }}>
        <Grid item xs={12} md={10} lg={8}>
          <Paper elevation={10} style={{ padding: '30px', borderRadius: '15px' }} sx={{
                    pb: "0.5rem",
                    pt: "0.5rem",
                    backgroundColor: "#efebe9",
                    whiteSpace: "pre-line",
                  }}>
            
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} marginTop={5}>
          {/* Selector de curso */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Curso"
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              fullWidth
            >
              {cursos.map((curso) => (
                <MenuItem key={curso.id_curso} value={curso.id_curso}>
                  {curso.nomlargo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Selector de asignatura */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Asignatura"
              value={selectedAsignatura}
              onChange={(e) => setSelectedAsignatura(e.target.value)}
              fullWidth
            >
              {asignaturas.map((asignatura) => (
                <MenuItem
                  key={asignatura.id_asignatura}
                  value={asignatura.id_asignatura}
                >
                  {asignatura.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Selector de jornada */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Jornada</Typography>
            <Box display="flex" gap={2} mb={3}>
                    {jornadas.map((jornada) => (
                      <Button
                        key={jornada.id}
                        variant={selectedJornada === jornada.id ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setSelectedJornada(jornada.id)}
                        style={{
                          flex: 1,
                          backgroundColor: selectedJornada === jornada.id ? '#1976d2' : 'transparent',
                          color: selectedJornada === jornada.id ? 'white' : '#1976d2'
                        }}
                      >
                        {jornada.nombre}
                      </Button>
                    ))}
                  </Box>
          </Grid>
          {/* Selector de equipamiento */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Equipamiento</Typography>
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                    {equipamientos.map((equip) => (
                      <Button
                        key={equip.id_equipos}
                        variant={selectedEquipamiento === equip.id_equipos ? "contained" : "outlined"}
                        color="secondary"
                        onClick={() => setSelectedEquipamiento(equip.id_equipos)}
                        style={{
                          minWidth: '120px',
                          backgroundColor: selectedEquipamiento === equip.id_equipos ? '#dc004e' : 'transparent',
                          color: selectedEquipamiento === equip.id_equipos ? 'white' : '#dc004e'
                        }}
                      >
                        {equip.nombre}
                      </Button>
                    ))}
                  </Box>
          </Grid>

          {/* Campo de cantidad (solo para Chromebook y Tablet) */}
          {(selectedEquipamiento === 2 || selectedEquipamiento === 3) && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(
                      e.target.value,
                      selectedEquipamiento === "Tablet" ? 60 : 45
                    )
                  );
                  setCantidad(value);
                }}
                inputProps={{
                  min: 1,
                  max: selectedEquipamiento === "Tablet" ? 60 : 45, // Límite según el equipamiento
                }}
                fullWidth
              />
            </Grid>
          )}
          {/* Selector de fecha */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                shouldDisableDate={shouldDisableDate}
                views={["day"]}
              />
            </LocalizationProvider>
          </Grid>

          {/* Bloques horarios disponibles */}
          <Grid item xs={12}>
            <Typography variant="h6">Bloques horarios disponibles</Typography>
            {bloquesHorarios.length === 0 ? (
              <Typography variant="body1">
                No hay bloques disponibles para la fecha seleccionada.
              </Typography>
            ) : (
              bloquesHorarios.map((bloque) => (
                <Tooltip
                  key={bloque.bloque_id}
                  title={
                    bloque.estado === "reservado"
                      ? bloque.id_profesor_reserva === idProfesor
                        ? selectedReservedBlocks.includes(bloque.bloque_id)
                          ? "Click para deseleccionar" // Mensaje cuando ya está seleccionado para liberación
                          : "Este bloque está reservado por usted. Click para liberarlo." // Mensaje inicial
                        : "Este bloque ya está reservado por otro profesor."
                      : bloque.estado === "superpuesto"
                      ? "Este bloque está superpuesto con otro ya reservado."
                      : selectedBloques.includes(bloque.bloque_id)
                      ? "Click para deseleccionar"
                      : "Click para seleccionar"
                  }
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: "1.3rem", // Tamaño de fuente más grande
                        maxWidth: "300px", // Ancho máximo del Tooltip
                        backgroundColor: "rgba(0, 0, 0, 0.9)", // Fondo oscuro
                        color: "#fff", // Texto blanco
                        padding: "10px", // Espaciado interno
                        borderRadius: "8px", // Bordes redondeados
                      },
                    },
                  }}
                  disableTouchListener={false} // Habilita el Tooltip en dispositivos táctiles
                >
                  <span>
                    <Button
                      variant="contained"
                      disabled={
                        // Bloques reservados por otros profesores
                        (bloque.estado === "reservado" &&
                          bloque.id_profesor_reserva !== idProfesor) ||
                        // Bloques superpuestos
                        bloque.estado === "superpuesto"
                        //  ||

                        // Bloques ya seleccionados para liberación (evitar doble selección)
                        //  (bloque.estado === "reservado" && selectedReservedBlocks.includes(bloque.bloque_id))
                      }
                      style={{
                        backgroundColor: 
                        selectedBloques.includes(bloque.bloque_id)
                          ? "#666666" // Fondo gris para bloques disponibles seleccionados
                          : bloque.estado === "reservado"
                          ? bloque.id_profesor_reserva === idProfesor
                            ? selectedReservedBlocks.includes(bloque.bloque_id)
                              ? "#33691E" // VERDE OSCURO cuando está seleccionado para liberación
                              : "#00cc66" // Verde original para mis reservas no seleccionadas
                            : "#ff4444" // Rojo para reservas de otros
                            
                          : bloque.estado === "superpuesto"
                          ? "#ff8800" // Naranja para bloques superpuestos
                          : "#1976d2", // Azul para bloques disponibles
                        color: "white",
                        margin: "5px",
                      }}
                      onClick={() => {
                        if (
                          bloque.estado === "reservado" &&
                          bloque.id_profesor_reserva === idProfesor
                        ) {
                          setSelectedReservedBlocks((prev) =>
                            prev.includes(bloque.bloque_id)
                              ? prev.filter((id) => id !== bloque.bloque_id)
                              : [...prev, bloque.bloque_id]
                          );
                        }
                       
                        // Manejo de bloques para nueva reserva (solo si no está reservado)
                        if (bloque.estado !== "reservado") {
                          setSelectedBloques((prev) =>
                            prev.includes(bloque.bloque_id)
                              ? prev.filter((id) => id !== bloque.bloque_id)
                              : [...prev, bloque.bloque_id]
                          );
                        }
                      }}
                    >
                      {bloque.descripcion}-{bloque.id_profesor_reserva}-
                      {idProfesor}
                    </Button>
                  </span>
                </Tooltip>
              ))
            )}
          </Grid>

          {/* Botón de enviar */}
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !selectedCurso ||
                !selectedAsignatura ||
                !selectedJornada ||
                !selectedEquipamiento ||
                selectedBloques.length === 0
              }
            >
              Enviar Solicitud
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLiberarBloques}
              disabled={selectedReservedBlocks.length === 0}
              style={{
                marginTop: "16px",
                backgroundColor:
                  selectedReservedBlocks.length > 0 ? "#33691E" : "", // Rojo cuando activo
                transition: "all 0.3s ease",
              }}
              startIcon={<LockOpenIcon />} // Icono sugerido
            >
              Liberar bloques ({selectedReservedBlocks.length})
            </Button>
          </Grid>
        </Grid>
      </form>
      </Paper>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        slotProps={{
          root: {
            // Solución definitiva para MUI v6
            ownerState: undefined,
            component: "div",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default SolicitudEquipos;

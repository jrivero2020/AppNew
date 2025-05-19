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
  Paper,
  Box,
  Card,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
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

dayjs.extend(require("dayjs/plugin/weekday"));
dayjs.extend(require("dayjs/plugin/isSameOrBefore"));

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
  const [cantidad, setCantidad] = useState(0); // Valor inicial de 0
  const [actividad, setActividad] = useState("");
  const { jwt } = useContext(AuthContext);
  const [selectedReservedBlocks, setSelectedReservedBlocks] = useState([]);
  const [feriados, setFeriados] = useState([]);

  const idProfesor = jwt.user._id;
  const nombreProfesor = jwt.user._name;
  const usrRol = jwt.user._rol;

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
        //console.log("Dias feriados obtenidos===>", dferiados);
        setCursos(cursosData);
        setAsignaturas(asignaturasData);
        setEquipamientos(equipamientosData);
        setJornadas([
          { id: 1, nombre: "Mañana" },
          { id: 2, nombre: "Tarde" },
        ]);
        setFeriados(dferiados.map((f) => dayjs(f.diaferiado)));
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
    //console.log("selectedEquipamiento==>", selectedEquipamiento);
    if (selectedJornada && selectedEquipamiento && selectedDate) {
      const fetchBloquesHorarios = async () => {
        try {
          const bloquesData = await getBloquesHorarios({
            jornada_id: selectedJornada,
            equipamiento_id: selectedEquipamiento,
            fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
          });
          //console.log("bloquesData de bloques horarios==>", bloquesData);
          setBloquesHorarios(bloquesData);
        } catch (error) {
          // console.error("Error cargando bloques horarios:", error);
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
    //return false;
    return (
      date.isBefore(dayjs(), "day") ||
      day === 0 ||
      day === 6 ||
      feriados.some((feriado) => date.isSame(feriado, "day"))
    );
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar stock disponible
    const equipamientoSeleccionado = equipamientos.find(
      (equip) => equip.id_equipos === selectedEquipamiento
    );
    let errorMsg = "";

    if (!equipamientoSeleccionado) {
      errorMsg = "Debe seleccionar un equipamiento válido";
    }
    /*
    } else if (selectedEquipamiento === 1)
      setCantidad(equipamientoSeleccionado.cantidad);
    else if (selectedEquipamiento === 2 || selectedEquipamiento === 3) {
      // Validar solo para Chromebook (2) y Tablet (3)
      // const stock = equipamientoSeleccionado.cantidad;

      if (cantidad <= 0) {
        errorMsg = `La cantidad mínima debe ser 1`;
      } else if (cantidad > stock) {
        errorMsg = `La cantidad excede el stock disponible (${stock})`;
      }

    }
*/
    // 3. Manejo de errores
    if (errorMsg) {
      setSnackbarMessage(errorMsg);
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
      cantidad: cantidad,
      actividad: actividad,
    };

    try {
      // console.log("solicitudData ==>", solicitudData )
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
      // console.log("error==>", error);
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
      pRol: usrRol,
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
  const selctEquipamiento = (id_equipo) => {
    // const equipoSel = equipamientos.find((equip) => equip.id_equipos === id_equipo);
    // const disponibles
    setSelectedEquipamiento(id_equipo);
    // console.log("id_equipo***=>", id_equipo )
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Grid
        container
        justifyContent="center"
        style={{ padding: "20px", marginTop: "80px" }}
      >
        <Grid item xs={12} md={10} lg={8}>
          <Paper
            elevation={10}
            style={{ padding: "30px", borderRadius: "15px" }}
            sx={{
              pb: "0.5rem",
              pt: "0.5rem",
              backgroundColor: "#efebe9",
              whiteSpace: "pre-line",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: "blue",
                textAlign: "center", // Centra el texto dentro de Typography
                mt: 1,
              }}
            >
              Profesor/a : {nombreProfesor}
            </Typography>
            <Card sx={{ backgroundColor: "#E1E1E1" }}>
              <Box
                sx={{
                  backgroundColor: "blue",
                  color: "white",
                  textAlign: "center",
                  padding: 1, // Espaciado interno
                  fontSize: {
                    xs: "0.8rem",
                    sm: "1.1rem",
                    md: "1.5rem",
                  },
                  fontWeight: "bold", // Negrita para parecerse al título del CardHeader
                }}
              >
                Seleccione Curso y Asignatura
              </Box>
            </Card>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} marginTop={1}>
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

                {/* Input Nro alumnos */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nro.Alumnos"
                    type="number"
                    value={cantidad}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(e.target.value, 45));
                      setCantidad(value);
                    }}
                    inputProps={{
                      min: 1,
                      max: 45, // Límite según el equipamiento
                      style: { textAlign: "center", padding: "8px 25px" },
                    }}
                  ></TextField>
                </Grid>
                {/* Input actividad */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    style={{ fontSize: "13px" }}
                    size="small"
                    variant="outlined"
                    fullWidth
                    label="Actividad"
                    type="text"
                    value={actividad}
                    onChange={(e) => {
                      setActividad(e.target.value);
                    }}
                  ></TextField>
                </Grid>

                {/***************************************************************************** */}

                {/* Selector de jornada */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    align="center"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1.1rem",
                        md: "1.5rem",
                      },
                      fontWeight: "bold",
                    }}
                  >
                    Seleccione Jornada
                  </Typography>
                  <Box display="flex" gap={1} mb={1} justifyContent="center">
                    {jornadas.map((jornada) => (
                      <Button
                        key={jornada.id}
                        variant={
                          selectedJornada === jornada.id
                            ? "contained"
                            : "outlined"
                        }
                        color="primary"
                        onClick={() => setSelectedJornada(jornada.id)}
                        sx={{
                          minWidth: "120px", // Ancho fijo equivalente a ~10 caracteres
                          width: "120px", // Fuerza el ancho exacto
                          maxWidth: "120px", // Previene expansión
                          padding: "8px 12px", // Ajuste interno
                          fontSize: "0.875rem", // Tamaño de texto consistente
                          backgroundColor:
                            selectedJornada === jornada.id
                              ? "#006064"
                              : "transparent",
                          color:
                            selectedJornada === jornada.id
                              ? "white"
                              : "#006064",
                          "&:hover": {
                            backgroundColor:
                              selectedJornada === jornada.id
                                ? "#1565c0"
                                : "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        {jornada.nombre}
                      </Button>
                    ))}
                  </Box>
                </Grid>
                {/* Selector de equipamiento */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Seleccione Equipamiento
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    gap={2}
                    mb={1}
                    flexWrap="wrap"
                  >
                    {equipamientos.map((equip) => (
                      <Button
                        key={equip.id_equipos}
                        variant={
                          selectedEquipamiento === equip.id_equipos
                            ? "contained"
                            : "outlined"
                        }
                        color="secondary"
                        onClick={() => selctEquipamiento(equip.id_equipos)} // ojo pensar en dejar stock x equipos ya definidos
                        // para mostrar en seleccion de bloque la cantidad disponible
                        style={{
                          minWidth: "120px",
                          backgroundColor:
                            selectedEquipamiento === equip.id_equipos
                              ? "#006064"
                              : "transparent",
                          color:
                            selectedEquipamiento === equip.id_equipos
                              ? "white"
                              : "#006064",
                        }}
                      >
                        {equip.nombre}
                      </Button>
                    ))}
                  </Box>
                </Grid>

                {/* Campo de cantidad (solo para Chromebook y Tablet) 
                {(selectedEquipamiento === 2 || selectedEquipamiento === 3) && (
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <TextField
                      label="Cantidad"
                      type="number"
                      value={cantidad}
                      onChange={(e) => {
                        const value = Math.max(
                          1,
                          Math.min(
                            e.target.value,
                            selectedEquipamiento === 3 ? 60 : 45
                          )
                        );
                        setCantidad(value);
                      }}
                      inputProps={{
                        min: 1,
                        max: selectedEquipamiento === 3 ? 60 : 45, // Límite según el equipamiento
                        style: {
                          textAlign: "center",
                          padding: "8px 5px",
                        },
                      }}
                      sx={{
                        width: "80px",
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important",
                        },
                        "& .MuiInputLabel-root": {
                          transform: "translate(50%, -50%) scale(0.75)",
                          right: "50%",
                          left: "auto",
                          top: "0px",
                          position: "absolute",
                          originX: "center",
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: "translate(50%, 0) scale(0.75)",
                        },
                      }}
                    />
                  </Grid>
                )}
                */}
                {/* Selector de fecha */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      "& .MuiStaticDatePicker-root": {
                        margin: "0 auto",
                        width: "100%",
                        maxWidth: "320px", // Ancho típico del calendario
                      },
                      "& .MuiCalendarOrClockPicker-root": {
                        width: "100%",
                      },
                      "& .MuiCalendarPicker-root": {
                        width: "100%",
                      },
                    }}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                    >
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        shouldDisableDate={shouldDisableDate}
                        views={["day"]}
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>

                {/* Bloques horarios disponibles */}
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Bloques horarios disponibles
                  </Typography>
                  {bloquesHorarios.length === 0 ? (
                    <Typography variant="body1">
                      No hay bloques disponibles para la fecha seleccionada.
                    </Typography>
                  ) : (
                    bloquesHorarios.map((bloque) => (
                      <Tooltip
                        key={bloque.bloque_id}
                        title={
                          <Box>
                            {bloque.estado === "reservado" ? (
                              bloque.id_profesor_reserva === idProfesor ||
                              usrRol === 1 ? (
                                selectedReservedBlocks.includes(
                                  bloque.bloque_id
                                ) ? (
                                  <Typography variant="body2">
                                    Click para deseleccionar
                                  </Typography>
                                ) : (
                                  <>
                                    {usrRol === 1 ? (
                                      <>
                                        <Typography variant="body2">
                                          Bloque reservado por:{" "}
                                          {bloque.nombrereserva}{" "}
                                          {bloque.apatreserva}
                                        </Typography>
                                        <Typography variant="body2">
                                          Nro.Alumnos: {bloque.cantidad_ocupada}
                                        </Typography>
                                        <Typography variant="body2">
                                          Curso: {bloque.curso}
                                        </Typography>
                                        <Typography variant="body2">
                                          Asignatura: {bloque.asignatura}
                                        </Typography>
                                        <Typography variant="body2">
                                          Actividad: {bloque.actividad}
                                        </Typography>
                                      </>
                                    ) : (
                                      <Typography variant="body2">
                                        Este bloque está reservado por usted.
                                      </Typography>
                                    )}
                                    <Typography variant="body2">
                                      Click para liberarlo.
                                    </Typography>
                                  </>
                                )
                              ) : (
                                <>
                                  <Typography variant="body2">
                                    Bloque reservado por: {bloque.nombrereserva}{" "}
                                    {bloque.apatreserva}
                                  </Typography>
                                  <Typography variant="body2">
                                    Nro.Alumnos: {bloque.cantidad_ocupada}
                                  </Typography>
                                  <Typography variant="body2">
                                    Curso: {bloque.curso}
                                  </Typography>
                                  <Typography variant="body2">
                                    Asignatura: {bloque.asignatura}
                                  </Typography>
                                  <Typography variant="body2">
                                    Actividad: {bloque.actividad}
                                  </Typography>

                                  {/*
                                <Typography variant="body2">
                                  Equipos disponibles: {cantidad - bloque.cantidad_ocupada}
                                </Typography>
                                */}
                                </>
                              )
                            ) : bloque.estado === "superpuesto" ? (
                              <Typography variant="body2">
                                Este bloque está superpuesto por:{" "}
                                {bloque.nombreresuperp} {bloque.apatsuperp}
                              </Typography>
                            ) : selectedBloques.includes(bloque.bloque_id) ? (
                              <Typography variant="body2">
                                Click para deseleccionar
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                Click para seleccionar
                              </Typography>
                            )}
                          </Box>
                        }
                        slotProps={{
                          tooltip: {
                            sx: {
                              fontSize: "1rem",
                              maxWidth: "520px",
                              backgroundColor: "#1B5E20",
                              color: "#f1f1f1",
                              padding: "12px",
                              borderRadius: "10px",
                              boxShadow: 3,
                            },
                          },
                        }}
                        disableTouchListener={false}
                      >
                        <span>
                          <Button
                            variant="contained"
                            disabled={
                              // Bloques reservados por otros profesores
                              (bloque.estado === "reservado" &&
                                bloque.id_profesor_reserva !== idProfesor &&
                                usrRol !== 1) ||
                              // Bloques superpuestos
                              bloque.estado === "superpuesto"
                              //  ||

                              // Bloques ya seleccionados para liberación (evitar doble selección)
                              //  (bloque.estado === "reservado" && selectedReservedBlocks.includes(bloque.bloque_id))
                            }
                            style={{
                              backgroundColor: selectedBloques.includes(
                                bloque.bloque_id
                              )
                                ? "#666666" // Fondo gris para bloques disponibles seleccionados
                                : bloque.estado === "reservado"
                                ? bloque.id_profesor_reserva === idProfesor ||
                                  usrRol === 1
                                  ? selectedReservedBlocks.includes(
                                      bloque.bloque_id
                                    )
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
                                (bloque.id_profesor_reserva === idProfesor ||
                                  usrRol === 1)
                              ) {
                                setSelectedReservedBlocks((prev) =>
                                  prev.includes(bloque.bloque_id)
                                    ? prev.filter(
                                        (id) => id !== bloque.bloque_id
                                      )
                                    : [...prev, bloque.bloque_id]
                                );
                              }

                              // Manejo de bloques para nueva reserva (solo si no está reservado)
                              if (bloque.estado !== "reservado") {
                                setSelectedBloques((prev) =>
                                  prev.includes(bloque.bloque_id)
                                    ? prev.filter(
                                        (id) => id !== bloque.bloque_id
                                      )
                                    : [...prev, bloque.bloque_id]
                                );
                              }
                            }}
                          >
                            {bloque.descripcion}
                            {/* bloque.cantidad_ocupada > 0 ? `  (En uso=${bloque.cantidad_ocupada})` : ''}
                            {bloque.cantidad_ocupada_superpuesta > 0 ? `  (En uso=${bloque.cantidad_ocupada_superpuesta})` : '' */}
                          </Button>
                        </span>
                      </Tooltip>
                    ))
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
                alignItems="center"
                sx={{ mt: 2 }}
              >
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

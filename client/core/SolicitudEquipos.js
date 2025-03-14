import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
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
} from "../docentes/api-docentes";

const SolicitudEquipos = ({ id_profesor }) => {
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

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosData, asignaturasData, equipamientosData] =
          await Promise.all([
            getCursos(),
            getAsignaturas(),
            getEquipamientos(),
          ]);

        setCursos(cursosData);
        setAsignaturas(asignaturasData);
        setEquipamientos(equipamientosData);
        setJornadas([
          { id: 1, nombre: "Mañana" },
          { id: 2, nombre: "Tarde" },
        ]);
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
    if (selectedJornada && selectedEquipamiento && selectedDate) {
      const fetchBloquesHorarios = async () => {
        try {
          const bloquesData = await getBloquesHorarios({
            jornada_id: selectedJornada,
            equipamiento_id: selectedEquipamiento,
            fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
          });
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

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const solicitudData = {
      id_profesor,
      id_curso: selectedCurso,
      id_asignatura: selectedAsignatura,
      id_jornada: selectedJornada,
      id_equipamiento: selectedEquipamiento,
      fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
      bloques_seleccionados: selectedBloques.map((bloque) => ({
        descripcion: bloque,
      })),
    };
    console.log("solicitudData==>", solicitudData)
    try {
      await createSolicitud(solicitudData);
      setSnackbarMessage("Solicitud enviada correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error al enviar la solicitud");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} marginTop={11}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Jornada"
              value={selectedJornada}
              onChange={(e) => setSelectedJornada(e.target.value)}
              fullWidth
            >
              {jornadas.map((jornada) => (
                <MenuItem key={jornada.id} value={jornada.id}>
                  {jornada.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Selector de equipamiento */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Equipamiento"
              value={selectedEquipamiento}
              onChange={(e) => setSelectedEquipamiento(e.target.value)}
              fullWidth
            >
              {equipamientos.map((equipamiento) => (
                <MenuItem
                  key={equipamiento.id_equipos}
                  value={equipamiento.id_equipos}
                >
                  {equipamiento.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Selector de fecha */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                views={["day"]}
              />
            </LocalizationProvider>
          </Grid>

          {/* Bloques horarios disponibles */}
          <Grid item xs={12}>
            <Typography variant="h6">Bloques horarios disponibles</Typography>
            {bloquesHorarios.length === 0 ? (
              <Typography variant="body1">No hay bloques disponibles para la fecha seleccionada.</Typography>
            ) : (
              bloquesHorarios.map((bloque) => (
                <Tooltip
                  key={bloque.bloque_id}
                  title={
                    bloque.estado === "reservado"
                      ? "Este bloque ya está reservado."
                      : bloque.estado === "superpuesto"
                      ? "Este bloque está superpuesto con otro ya reservado."
                      : ""
                  }
                >
                  <Button
                    variant={
                      selectedBloques.includes(bloque.descripcion)
                        ? "contained"
                        : "outlined"
                    }
                    disabled={bloque.estado !== "disponible"}
                    style={{
                      backgroundColor:
                        bloque.estado === "reservado" || bloque.estado === "superpuesto"
                          ? "grey"
                          : "inherit",
                      margin: "5px",
                    }}
                    onClick={() => {
                      if (selectedBloques.includes(bloque.descripcion)) {
                        setSelectedBloques(
                          selectedBloques.filter((b) => b !== bloque.descripcion)
                        );
                      } else {
                        setSelectedBloques([...selectedBloques, bloque.descripcion]);
                      }
                    }}
                  >
                    {bloque.descripcion}
                  </Button>
                </Tooltip>
              ))
            )}
          </Grid>

          {/* Botón de enviar */}
          <Grid item xs={12}>
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
        </Grid>
      </form>

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
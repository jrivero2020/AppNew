import React, { useState, useEffect, useContext } from "react";

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
import { AuthContext } from "./../core/AuthProvider";

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
  const [cantidad, setCantidad] = useState(1); // Valor inicial de 1
  const { jwt } = useContext(AuthContext);
  const idProfesor =  jwt.user._id;
  // const idProfesor =  26
  

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
    console.log("selectedEquipamiento==>", selectedEquipamiento)
    if (selectedJornada && selectedEquipamiento && selectedDate) {
      const fetchBloquesHorarios = async () => {
        try {
          const bloquesData = await getBloquesHorarios({
            jornada_id: selectedJornada,
            equipamiento_id: selectedEquipamiento,
            fecha_solicitud: selectedDate.format("YYYY-MM-DD"),
          });
          console.log("bloquesData de bloques horarios==>", bloquesData )
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
    console.log("solicitudData==>", solicitudData);


    const abortController = new AbortController();
    const signal = abortController.signal;
    try {
      createSolicitud(solicitudData, { t: jwt.token }, signal).then((data) => {
        if (data && data.error) {
          setSnackbarMessage("Error al enviar la solicitud");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return false;
        } else {
          const [results, metadata] = data;
          if (
            results[0] === undefined ||
            results[0] === null ||
            Object.keys(results[0]).length === 0
          ) {
            alert("**ATENCION** no se grabó la solicitud", metadata);
          } else {
            setSnackbarMessage("Solicitud enviada correctamente");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          }
        }
      });
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
          <Grid item xs={12}>
  <Typography variant="subtitle1">Jornada</Typography>
  <FormControl component="fieldset">
    <RadioGroup
      row
      value={selectedJornada}
      onChange={(e) => setSelectedJornada(Number(e.target.value))}
    >
      {jornadas.map((jornada) => (
        <FormControlLabel
          key={jornada.id}
          value={jornada.id}
          control={<Radio />}
          label={jornada.nombre}
        />
      ))}
    </RadioGroup>
  </FormControl>
</Grid>
          {/* Selector de equipamiento */}
          <Grid item xs={12}>
  <Typography variant="subtitle1">Equipamiento</Typography>
  <FormControl component="fieldset">
    <RadioGroup
      row
      value={selectedEquipamiento}
      onChange={(e) => setSelectedEquipamiento(Number(e.target.value))}
    >
      {equipamientos.map((equipamiento) => (
        <FormControlLabel
          key={equipamiento.id_equipos}
          value={equipamiento.id_equipos}
          control={<Radio />}
          label={equipamiento.nombre}
        />
      ))}
    </RadioGroup>
  </FormControl>
</Grid>
          {/* Campo de cantidad (solo para Chromebook y Tablet) */}
          {(selectedEquipamiento === 2 ||
            selectedEquipamiento === 3) && (
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
                        ? "Este bloque está reservado por usted."
                        : "Este bloque ya está reservado por otro profesor." 
                      : bloque.estado === "superpuesto"
                      ? "Este bloque está superpuesto con otro ya reservado."
                      : "Bloque disponible para reservar"
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
                    disabled={( bloque.estado === "reservado" && bloque.id_profesor_reserva !== idProfesor ) || bloque.estado === "superpuesto"}
                    style={{
                      backgroundColor:
                        selectedBloques.includes(bloque.bloque_id)
                          ? "#666666" // Fondo gris para bloques seleccionados
                          : bloque.estado === "reservado"
                          ? bloque.id_profesor_reserva === idProfesor
                            ? "#00cc66" // Fondo verde para bloques reservados por el profesor
                            : "#ff4444" // Fondo rojo para bloques reservados por otros
                          : bloque.estado === "superpuesto"
                          ? "#ff8800" // Fondo naranja para bloques superpuestos
                          : "#1976d2", // Fondo azul para bloques disponibles
                      color: "white", // Texto blanco para todos los bloques
                      margin: "5px",
                    }}
                    onClick={() => {
                      if (selectedBloques.includes(bloque.bloque_id)) {
                        // Usar bloque_id
                        setSelectedBloques(
                          selectedBloques.filter(
                            (id) => id !== bloque.bloque_id
                          ) // Usar bloque_id
                        );
                      } else {
                        setSelectedBloques([
                          ...selectedBloques,
                          bloque.bloque_id,
                        ]); // Usar bloque_id
                      }
                    }}
                  >
                    {bloque.descripcion}-{bloque.id_profesor_reserva}-{ idProfesor}
                  </Button>
                  </span>
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

import React, { useState, useEffect } from "react";
import { Container, Typography, ToggleButton, ToggleButtonGroup, Grid, Button, TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.extend(require("dayjs/plugin/weekday"));
dayjs.extend(require("dayjs/plugin/isSameOrBefore"));

const bloquesHorarios = {
  mañana: ["7:40 - 8:45", "8:35 - 9:20", "9:35 - 10:20", "10:20 - 11:05", "11:20 - 12:05", "12:05 - 12:50", "12:50 - 13:35", "13:35 - 14:20", "14:20 - 15:05", "15:05 - 15:50"],
  tarde: ["14:00 - 14:45", "14:50 - 15:35", "15:40 - 16:25", "16:30 - 17:15", "17:20 - 18:05", "18:10 - 18:55"]
};

const SeleccionEquipos = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [feriados, setFeriados] = useState([]);
  const [jornada, setJornada] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState(null);
  const [cantidadEquipos, setCantidadEquipos] = useState(1);
  const [profesor, setProfesor] = useState("");
  const [curso, setCurso] = useState("");
  const [asignatura, setAsignatura] = useState("");

  useEffect(() => {
    setFeriados(["2025-03-13", "2025-04-01"]);
  }, []);

  const isDisabled = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return (
      date.weekday() === 5 ||
      date.weekday() === 6 ||
      feriados.includes(formattedDate) ||
      date.isBefore(dayjs(), "day")
    );
  };

  const isBloqueReservado = (bloque) => {
    return reservas.some(r => 
      r.fecha === selectedDate.format("YYYY-MM-DD") && 
      r.jornada === jornada && 
      r.bloque === bloque && 
      r.equipamiento === equipamientoSeleccionado
    );
  };

  const handleSeleccionBloque = (bloque) => {
    if (isBloqueReservado(bloque)) return;
    
    const nuevaReserva = {
      fecha: selectedDate.format("YYYY-MM-DD"),
      jornada,
      bloque,
      equipamiento: equipamientoSeleccionado,
      cantidad: equipamientoSeleccionado !== "sala" ? cantidadEquipos : undefined
    };
    
    setReservas((prevReservas) => [...prevReservas, nuevaReserva]);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" marginTop={11}>
        <Grid item xs={4}>
          <TextField fullWidth label="Profesor" value={profesor} onChange={(e) => setProfesor(e.target.value)} />
        </Grid>
        <Grid item xs={4}>
          <TextField fullWidth label="Curso" value={curso} onChange={(e) => setCurso(e.target.value)} />
        </Grid>
        <Grid item xs={4}>
          <TextField fullWidth label="Asignatura" value={asignatura} onChange={(e) => setAsignatura(e.target.value)} />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop={5}>
        <Grid item xs={6} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Seleccionar Fecha
          </Typography>
        </Grid>
        <Grid item xs={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Seleccionar Jornada
          </Typography>
        </Grid>
      </Grid>
      
      <Grid container spacing={2} alignItems="flex-start" justifyContent="center" marginTop={5}>
        <Grid item xs={6} textAlign="center">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              shouldDisableDate={isDisabled}
              onChange={(newDate) => setSelectedDate(newDate)}
              views={["day"]}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} textAlign="center">
          <ToggleButtonGroup
            value={jornada}
            exclusive
            onChange={(event, newJornada) => setJornada(newJornada)}
          >
            <ToggleButton value="mañana">Mañana</ToggleButton>
            <ToggleButton value="tarde">Tarde</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      
      {jornada && (
        <Grid container spacing={2} justifyContent="center" marginTop={5}>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6">Seleccionar Equipamiento</Typography>
            <ToggleButtonGroup
              value={equipamientoSeleccionado}
              exclusive
              onChange={(event, newEquipamiento) => setEquipamientoSeleccionado(newEquipamiento)}
            >
              <ToggleButton value="sala">Sala de Computación</ToggleButton>
              <ToggleButton value="chromebook">Chromebook</ToggleButton>
              <ToggleButton value="tablet">Tablet</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          {equipamientoSeleccionado !== "sala" && (
            <Grid item xs={12} textAlign="center">
              <TextField
                label="Cantidad de Equipos"
                type="number"
                value={cantidadEquipos}
                onChange={(e) => setCantidadEquipos(e.target.value)}
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
          )}
          
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6">Seleccionar Bloque Horario</Typography>
            <Grid container spacing={1} justifyContent="center">
              {bloquesHorarios[jornada].map((bloque, index) => (
                <Grid item key={index}>
                  <Button
                    variant={isBloqueReservado(bloque) ? "contained" : "outlined"}
                    color={isBloqueReservado(bloque) ? "secondary" : "primary"}
                    onClick={() => handleSeleccionBloque(bloque)}
                  >
                    {bloque}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign="center" marginTop={3}>
            <Button variant="contained" color="primary">Grabar Selección</Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default SeleccionEquipos;

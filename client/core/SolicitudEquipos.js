// src/components/SolicitudForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, Grid, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { getSolicitudesByProfesor, createSolicitud } from '../docentes/api-docentes'


const SolicitudEquipos = ({ id_profesor }) => {
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [jornadas, setJornadas] = useState([]);
    const [equipamientos, setEquipamientos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [selectedJornada, setSelectedJornada] = useState('');
    const [selectedEquipamiento, setSelectedEquipamiento] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [bloquesHorarios, setBloquesHorarios] = useState([]);
    const [selectedBloques, setSelectedBloques] = useState([]);

    // Cargar datos iniciales (cursos, asignaturas, jornadas, equipamientos)
    useEffect(() => {
        // Simular carga de datos (puedes reemplazar con llamadas a la API)
        setCursos([{ id: 1, nombre: 'Matemáticas' }, { id: 2, nombre: 'Ciencias' }]);
        setAsignaturas([{ id: 1, nombre: 'Álgebra' }, { id: 2, nombre: 'Geometría' }]);
        setJornadas([{ id: 1, nombre: 'Mañana' }, { id: 2, nombre: 'Tarde' }]);
        setEquipamientos([{ id: 1, nombre: 'Sala de computación' }, { id: 2, nombre: 'Chromebooks' }, { id: 3, nombre: 'Tablets' }]);
    }, []);

    // Cargar bloques horarios cuando se selecciona una jornada y equipamiento
    useEffect(() => {
        if (selectedJornada && selectedEquipamiento) {
            // Simular carga de bloques horarios (puedes reemplazar con llamadas a la API)
            setBloquesHorarios([
                { id: 1, bloque: '7:40 - 8:45' },
                { id: 2, bloque: '8:35 - 9:20' },
                { id: 3, bloque: '9:35 - 10:20' },
            ]);
        }
    }, [selectedJornada, selectedEquipamiento]);

    // Función para deshabilitar fechas (opcional)
    const isDisabled = (date) => {
        // Ejemplo: Deshabilitar fines de semana
        return date.day() === 0 || date.day() === 6;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const solicitudData = {
            id_profesor,
            id_curso: selectedCurso,
            id_asignatura: selectedAsignatura,
            id_jornada: selectedJornada,
            id_equipamiento: selectedEquipamiento,
            fecha_solicitud: selectedDate.format('YYYY-MM-DD'), // Formato YYYY-MM-DD
            bloques_solicitados: selectedBloques,
        };
        try {
            await createSolicitud(solicitudData);
            console.log("solicitudData=>", solicitudData)
            alert('Solicitud enviada correctamente');
        } catch (error) {
            alert('Error al enviar la solicitud');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}  marginTop={11}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Nueva Solicitud</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Curso"
                            value={selectedCurso}
                            onChange={(e) => setSelectedCurso(e.target.value)}
                            fullWidth
                        >
                            {cursos.map((curso) => (
                                <MenuItem key={curso.id} value={curso.id}>
                                    {curso.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Asignatura"
                            value={selectedAsignatura}
                            onChange={(e) => setSelectedAsignatura(e.target.value)}
                            fullWidth
                        >
                            {asignaturas.map((asignatura) => (
                                <MenuItem key={asignatura.id} value={asignatura.id}>
                                    {asignatura.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Equipamiento"
                            value={selectedEquipamiento}
                            onChange={(e) => setSelectedEquipamiento(e.target.value)}
                            fullWidth
                        >
                            {equipamientos.map((equipamiento) => (
                                <MenuItem key={equipamiento.id} value={equipamiento.id}>
                                    {equipamiento.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
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
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Bloques horarios disponibles</Typography>
                        {bloquesHorarios.map((bloque) => (
                            <Button
                                key={bloque.id}
                                variant={selectedBloques.includes(bloque.bloque) ? 'contained' : 'outlined'}
                                onClick={() => {
                                    if (selectedBloques.includes(bloque.bloque)) {
                                        setSelectedBloques(selectedBloques.filter((b) => b !== bloque.bloque));
                                    } else {
                                        setSelectedBloques([...selectedBloques, bloque.bloque]);
                                    }
                                }}
                            >
                                {bloque.bloque}
                            </Button>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Enviar Solicitud
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );
};

export default SolicitudEquipos;
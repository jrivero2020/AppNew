import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  IconButton
} from '@mui/material';
import { Save, Delete, Add } from '@mui/icons-material';

const AsignacionCompleta = ({ rutFuncionario }) => {
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [nuevoHorario, setNuevoHorario] = useState({
    id_dia: '',
    hora_desde: '',
    hora_hasta: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentFuncionario, setCurrentFuncionario] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionarioRes, cursosRes, diasRes, cursosAsignadosRes, horariosRes] = await Promise.all([
          axios.get(`/api/funcionarios/${rutFuncionario}`),
          axios.get('/api/cursos'),
          axios.get('/api/dias-atencion'),
          axios.get(`/api/funcionarios/${rutFuncionario}/cursos`),
          axios.get(`/api/funcionarios/${rutFuncionario}/horarios`)
        ]);

        setCurrentFuncionario(funcionarioRes.data);
        setCursosDisponibles(cursosRes.data);
        setDiasDisponibles(diasRes.data);
        setCursosSeleccionados(cursosAsignadosRes.data.map(c => c.id));
        setHorarios(horariosRes.data.map(h => ({
          id_dia: h.id_dia,
          hora_desde: h.hora_desde,
          hora_hasta: h.hora_hasta
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [rutFuncionario]);

  const handleCursoChange = (idCurso) => {
    setCursosSeleccionados(prev => 
      prev.includes(idCurso)
        ? prev.filter(id => id !== idCurso)
        : [...prev, idCurso]
    );
  };

  const handleHorarioChange = (e) => {
    setNuevoHorario({
      ...nuevoHorario,
      [e.target.name]: e.target.value
    });
  };

  const agregarHorario = () => {
    if (nuevoHorario.id_dia && nuevoHorario.hora_desde && nuevoHorario.hora_hasta) {
      setHorarios([...horarios, {
        id_dia: parseInt(nuevoHorario.id_dia),
        hora_desde: nuevoHorario.hora_desde,
        hora_hasta: nuevoHorario.hora_hasta
      }]);
      setNuevoHorario({ id_dia: '', hora_desde: '', hora_hasta: '' });
    }
  };

  const eliminarHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const guardarAsignacion = async () => {
    try {
      await axios.post(`/api/funcionarios/${rutFuncionario}/asignacion-completa`, {
        cursos: cursosSeleccionados,
        horarios: horarios
      });
      alert('Asignación guardada correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al guardar: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Asignación Completa para {currentFuncionario?.nombres} {currentFuncionario?.apat}
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Cursos Asignados" 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ bgcolor: 'primary.main', color: 'white' }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {cursosDisponibles.map(curso => (
              <Grid item xs={12} sm={6} md={4} key={curso.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cursosSeleccionados.includes(curso.id)}
                      onChange={() => handleCursoChange(curso.id)}
                    />
                  }
                  label={`${curso.nombre_corto} - ${curso.nombre_curso}`}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Horarios de Atención" 
          titleTypographyProps={{ variant: 'h6' }}
          sx={{ bgcolor: 'primary.main', color: 'white' }}
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
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
                {diasDisponibles.map(dia => (
                  <MenuItem key={dia.id} value={dia.id}>{dia.nombre_dia}</MenuItem>
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
                required
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={agregarHorario}
                disabled={!nuevoHorario.id_dia || !nuevoHorario.hora_desde || !nuevoHorario.hora_hasta}
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
                  const dia = diasDisponibles.find(d => d.id === horario.id_dia);
                  return (
                    <TableRow key={index}>
                      <TableCell>{dia?.nombre_dia || 'Desconocido'}</TableCell>
                      <TableCell>{horario.hora_desde}</TableCell>
                      <TableCell>{horario.hora_hasta}</TableCell>
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

      <Button
        variant="contained"
        color="success"
        size="large"
        startIcon={<Save />}
        onClick={guardarAsignacion}
        disabled={cursosSeleccionados.length === 0 && horarios.length === 0}
        fullWidth
      >
        Guardar Asignación Completa
      </Button>
    </Container>
  );
};

export default AsignacionCompleta;
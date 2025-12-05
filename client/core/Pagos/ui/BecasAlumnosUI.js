// components/ui/BecasAlumnosUI.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Save, Add, Delete, Search, Person, School } from '@mui/icons-material';
import ConfirmationModal from '../../../assets/dialogs/ConfirmationModal';

const BecasAlumnosUI = ({
  becas,
  alumnos,
  searchQuery,
  selectedAlumno,
  nuevo,
  loading,
  error,
  selectedYear,
  montoConfig,
  tiposBeca,
  onSearch,
  onSelectAlumno,
  onSave,
  onAdd,
  onDelete,
  onChange,
  onNuevoChange,
  calcularValoresBeca
}) => {
  const [alert, setAlert] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleSaveWithFeedback = async (index) => {
    const result = await onSave(becas[index]);
    setAlert(result);
  };

  const handleAddWithFeedback = async () => {
    if (!nuevo.rut_alumno || !nuevo.id_tipo_beca) {
      setAlert({ success: false, message: 'Seleccione alumno y tipo de beca' });
      return;
    }
    
    const result = await onAdd(nuevo);
    setAlert(result);
  };

  const handleTipoBecaChange = (value, index = null) => {
    const tipoId = value?.id || '';
    const tipo = tiposBeca.find(t => t.id === tipoId);
    
    if (index !== null) {
      // Edición existente
      const porcentaje = tipo?.porcentaje_fijo || becas[index].porcentaje_asignado;
      const { montodescuento, apagar } = calcularValoresBeca(tipoId, porcentaje);
      
      onChange(index, 'id_tipo_beca', tipoId);
      onChange(index, 'montodescuento', montodescuento);
      onChange(index, 'apagar', apagar);
    } else {
      // Nuevo registro
      const porcentaje = tipo?.porcentaje_fijo || null;
      const { montodescuento, apagar } = calcularValoresBeca(tipoId, porcentaje);
      
      onNuevoChange({
        ...nuevo,
        id_tipo_beca: tipoId,
        porcentaje_asignado: tipo?.porcentaje_fijo ? null : porcentaje,
        montodescuento,
        apagar
      });
    }
  };

  const handlePorcentajeChange = (value, index = null) => {
    const porcentaje = value ? parseFloat(value) : null;
    
    if (index !== null) {
      // Edición existente
      const { montodescuento, apagar } = calcularValoresBeca(
        becas[index].id_tipo_beca, 
        porcentaje
      );
      
      onChange(index, 'porcentaje_asignado', porcentaje);
      onChange(index, 'montodescuento', montodescuento);
      onChange(index, 'apagar', apagar);
    } else {
      // Nuevo registro
      const { montodescuento, apagar } = calcularValoresBeca(
        nuevo.id_tipo_beca, 
        porcentaje
      );
      
      onNuevoChange({
        ...nuevo,
        porcentaje_asignado: porcentaje,
        montodescuento,
        apagar
      });
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Asignación de Becas a Alumnos {selectedYear && `(${selectedYear})`}
      </Typography>

      {!selectedYear && (
        <Alert severity="info">Seleccione un año en Configuración de Montos</Alert>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {selectedYear && (
        <>
          {/* Búsqueda de alumnos */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Buscar Alumno
            </Typography>
            <Autocomplete
              options={alumnos}
              getOptionLabel={(option) => 
                `${option.rut} - ${option.nombres} ${option.apellidos}`
              }
              inputValue={searchQuery}
              onInputChange={(_, newValue) => onSearch(newValue)}
              onChange={(_, newValue) => onSelectAlumno(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar por RUT o Nombre"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Search sx={{ mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Asignación de beca a nuevo alumno */}
          {selectedAlumno && (
            <Box sx={{ mb: 3, p: 2, border: '1px dashed #eee', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person color="action" sx={{ mr: 1 }} />
                <Typography>
                  {selectedAlumno.nombres} {selectedAlumno.apellidos} ({selectedAlumno.rut})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Autocomplete
                  options={tiposBeca}
                  getOptionLabel={(option) => option.nombre}
                  value={tiposBeca.find(t => t.id === nuevo.id_tipo_beca) || null}
                  onChange={(_, newValue) => handleTipoBecaChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de Beca"
                      size="small"
                      sx={{ minWidth: 200 }}
                    />
                  )}
                />

                {nuevo.id_tipo_beca && !tiposBeca.find(t => t.id === nuevo.id_tipo_beca)?.porcentaje_fijo && (
                  <TextField
                    label="% Asignado"
                    type="number"
                    value={nuevo.porcentaje_asignado || ''}
                    onChange={(e) => handlePorcentajeChange(e.target.value)}
                    size="small"
                    sx={{ width: 120 }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                )}

                <IconButton onClick={handleAddWithFeedback} color="success">
                  <Add />
                </IconButton>
              </Box>

              {nuevo.montodescuento !== null && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Typography variant="body2">
                    Descuento: ${nuevo.montodescuento?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2">
                    A pagar: ${nuevo.apagar?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Tabla de becas asignadas */}
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Alumno</TableCell>
                  <TableCell>Tipo Beca</TableCell>
                  <TableCell>%</TableCell>
                  <TableCell>Descuento</TableCell>
                  <TableCell>A Pagar</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {becas.map((beca, index) => (
                  <TableRow key={beca.id}>
                    <TableCell>
                      {beca.alumno_nombres} {beca.alumno_apellidos}
                    </TableCell>
                    <TableCell>
                      {tiposBeca.find(t => t.id === beca.id_tipo_beca)?.nombre}
                    </TableCell>
                    <TableCell>
                      {tiposBeca.find(t => t.id === beca.id_tipo_beca)?.porcentaje_fijo || beca.porcentaje_asignado}%
                    </TableCell>
                    <TableCell>
                      ${beca.montodescuento?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>
                      ${beca.apagar?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleSaveWithFeedback(index)}>
                        <Save fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => setDeleteModal({ open: true, id: beca.id })}
                      >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmationModal
        open={deleteModal.open}
        title="Confirmar Eliminación"
        message="¿Estás seguro de eliminar esta asignación de beca?"
        onConfirm={() => {
          onDelete(deleteModal.id);
          setDeleteModal({ open: false, id: null });
        }}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
      >
        <Alert severity={alert?.success ? 'success' : 'error'}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BecasAlumnosUI;
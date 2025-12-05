// components/ui/TiposBecaUI.js
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider
} from '@mui/material';
import { Save, Add, Delete, Info } from '@mui/icons-material';
import ConfirmationModal from '../../../assets/dialogs/ConfirmationModal';

const TiposBecaUI = ({
  tipos,
  nuevo,
  loading,
  error,
  selectedYear,
  montoConfig,
  onSave,
  onAdd,
  onDelete,
  onChange,
  onNuevoChange,
  calcularValores
}) => {
  const [alert, setAlert] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState({ open: false, id: null });

  const handleSaveWithFeedback = async (index) => {
    const result = await onSave(tipos[index]);
    setAlert(result);
  };

  const handleAddWithFeedback = async () => {
    if (!nuevo.nombre) {
      setAlert({ success: false, message: 'El nombre es requerido' });
      return;
    }
    
    const result = await onAdd(nuevo);
    setAlert(result);
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
          Tipos de Beca {selectedYear && `(${selectedYear})`}
        </Typography>
        {montoConfig && (
          <Chip 
            icon={<Info />}
            label={`Monto base: $${montoConfig.toLocaleString()}`}
            color="info"
            size="small"
          />
        )}
      </Box>

      {!selectedYear && (
        <Alert severity="info">Seleccione un año en Configuración de Montos</Alert>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {selectedYear && tipos.map((item, index) => (
        <Box key={item.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              label="Nombre"
              value={item.nombre}
              onChange={(e) => onChange(index, 'nombre', e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="% Descuento"
              type="number"
              value={item.porcentaje_fijo || ''}
              onChange={(e) => {
                const porcentaje = e.target.value ? parseFloat(e.target.value) : null;
                const { descuento, monto } = calcularValores(porcentaje);
                onChange(index, 'porcentaje_fijo', porcentaje);
                onChange(index, 'descuento', descuento);
                onChange(index, 'monto', monto);
              }}
              size="small"
              sx={{ width: 100 }}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
            <IconButton onClick={() => handleSaveWithFeedback(index)}>
              <Save color="primary" />
            </IconButton>
            <IconButton onClick={() => setDeleteModal({ open: true, id: item.id })}>
              <Delete color="error" />
            </IconButton>
          </Box>

          <TextField
            label="Descripción"
            value={item.descripcion || ''}
            onChange={(e) => onChange(index, 'descripcion', e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />

          {item.porcentaje_fijo !== null && (
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2">
                Descuento: ${item.descuento?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2">
                Monto final: ${item.monto?.toLocaleString() || '0'}
              </Typography>
            </Box>
          )}
        </Box>
      ))}

      {/* Sección para agregar nuevo tipo */}
      {selectedYear && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">Agregar nuevo tipo de beca</Typography>
          <Box sx={{ p: 2, border: '1px dashed #eee', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <TextField
                label="Nombre"
                value={nuevo.nombre}
                onChange={(e) => onNuevoChange({ ...nuevo, nombre: e.target.value })}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="% Descuento"
                type="number"
                value={nuevo.porcentaje_fijo || ''}
                onChange={(e) => {
                  const porcentaje = e.target.value ? parseFloat(e.target.value) : null;
                  const { descuento, monto } = calcularValores(porcentaje);
                  onNuevoChange({ 
                    ...nuevo, 
                    porcentaje_fijo: porcentaje,
                    descuento,
                    monto
                  });
                }}
                size="small"
                sx={{ width: 100 }}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
              <IconButton onClick={handleAddWithFeedback}>
                <Add color="success" />
              </IconButton>
            </Box>

            <TextField
              label="Descripción"
              value={nuevo.descripcion || ''}
              onChange={(e) => onNuevoChange({ ...nuevo, descripcion: e.target.value })}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmationModal
        open={deleteModal.open}
        title="Confirmar Eliminación"
        message="¿Estás seguro de eliminar este tipo de beca?"
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

export default TiposBecaUI;
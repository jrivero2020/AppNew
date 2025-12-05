// components/ui/ConfigMontoUI.js
import React from 'react';
import { Save, Add, Delete } from '@mui/icons-material';
// import ConfirmationModal from '../../../assets/dialogs/ConfirmationModal'
import { Box, TextField, IconButton, Typography, CircularProgress } from '@mui/material';

const ConfigMontoUI = ({ montos, nuevo, loading, onSave, onAdd, onDelete, onChange, onNuevoChange, onYearSelect, jwt }) => {
  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Configuración de Montos</Typography>
      
      {loading && <CircularProgress />}
      
      {montos.map((item, index) => (
        <Box key={item.id} sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Año"
            value={item.agno}
            onChange={(e) => onChange(index, 'agno', e.target.value)}
            size="small"
          />
          <TextField
            label="Monto"
            value={item.monto}
            onChange={(e) => onChange(index, 'monto', e.target.value)}
            size="small"
          />
          <IconButton onClick={() => onSave(index)}>
            <Save />
          </IconButton>
          <IconButton onClick={() => onDelete(item.id)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2">Agregar nuevo</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Año"
            value={nuevo.agno}
            onChange={(e) => onNuevoChange({ ...nuevo, agno: e.target.value })}
            size="small"
          />
          <TextField
            label="Monto"
            value={nuevo.monto}
            onChange={(e) => onNuevoChange({ ...nuevo, monto: e.target.value })}
            size="small"
          />
          <IconButton onClick={onAdd}>
            <Add />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigMontoUI;
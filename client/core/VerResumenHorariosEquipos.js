import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto'
};

const HorariosModal = ({ open, onClose, horarios, fecha }) => {
    
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-horarios-title"
      aria-describedby="modal-horarios-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography id="modal-horarios-title" variant="h6" component="h2">
            Horarios Disponibles
          </Typography>
           <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Fecha: <strong>{fecha}</strong>  {/* Aquí se muestra la fecha formateada */}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de horarios">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Horario</TableCell>
                <TableCell>Reservado por</TableCell>
                <TableCell>Nro. Alumnos</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Asignatura</TableCell>
                <TableCell>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {horarios.map((horario, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{horario.descripcion}</TableCell>
                  <TableCell>
                    {horario.nombrereserva 
                      ? `${horario.nombrereserva} ${horario.apatreserva || ''}`.trim() 
                      : 'Disponible'}
                  </TableCell>
                  <TableCell>{horario.cantidad_ocupada}</TableCell>
                  <TableCell>{horario.curso || '-'}</TableCell>
                  <TableCell>{horario.asignatura || '-'}</TableCell>
                  <TableCell>{horario.actividad || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default HorariosModal;
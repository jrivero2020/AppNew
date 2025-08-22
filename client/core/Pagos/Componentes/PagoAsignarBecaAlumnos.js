import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { esES } from '@mui/x-data-grid/locales';
import { CheckBox, Delete, Edit } from '@mui/icons-material';
import { getCursos, api_getAlumnosBecas, api_asignarBecaAlumnos, api_eliminarBecaAlumno } from "../../../docentes/api-docentes";

function Toolbar({ selectedYear, selectedBeca, cursos, selectedCurso, setSelectedCurso, showSelectAll, handleSelectAll }) {
  if (!selectedBeca) {
    console.warn('Toolbar - selectedBeca es null o undefined');
    return null;
  }
  if (!Array.isArray(cursos)) {
    console.error('Toolbar - cursos no es un array:', cursos);
    return null;
  }

  return (
    <GridToolbarContainer sx={{ mb: 2 }}>
      <FormControl sx={{ minWidth: 200, mr: 2 }}>
        <InputLabel id="curso-select-label">Curso</InputLabel>
        <Select
          labelId="curso-select-label"
          value={selectedCurso ? selectedCurso.id_curso : ''}
          label="Curso"
          onChange={(e) => {
            const curso = cursos.find((c) => c.id_curso === e.target.value) || null;
            console.log('Toolbar - Curso seleccionado:', curso);
            setSelectedCurso(curso);
          }}
        >
          <MenuItem value=""><em>Seleccione un curso</em></MenuItem>
          {cursos.map((curso) => (
            <MenuItem key={curso.id_curso} value={curso.id_curso}>
              {curso.nomlargo || 'Sin nombre'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showSelectAll && (
        <Button
          color="primary"
          variant="contained"
          startIcon={<CheckBox />}
          onClick={handleSelectAll}
          aria-label="Aplicar beca a todos"
          sx={{ ml: 2 }}
        >
          Aplicar a Todos
        </Button>
      )}
    </GridToolbarContainer>
  );
}

const AsignarBecaAlumnos = ({ credentials, selectedYear, configMonto, selectedBeca }) => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, alumno: null, action: '' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const noButtonRef = useRef(null);
  const alumnosRef = useRef(alumnos);
  const gridRef = useRef(null);

  const showSelectAll = selectedCurso && (selectedCurso.cod_ense === 10 || (selectedCurso.cod_ense === 110 && selectedCurso.cod_grado === 1)) && selectedBeca;
  const isDescuentoEditable = selectedBeca && (selectedBeca.descuento == null || Number(selectedBeca.descuento) <= 0 || selectedBeca.descuento === '');

  useEffect(() => {
    console.log('AsignarBecaAlumnos - Props:', { selectedYear, configMonto, selectedBeca });
    alumnosRef.current = alumnos;
  }, [alumnos, selectedYear, configMonto, selectedBeca]);

  useEffect(() => {
    if (!selectedYear) {
      setCursos([]);
      setAlumnos([]);
      setSelectedCurso(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchCursos(controller.signal);
    return () => controller.abort();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedCurso || !selectedYear) {
      setAlumnos([]);
      return;
    }
    const controller = new AbortController();
    fetchAlumnos(controller.signal);
    return () => controller.abort();
  }, [selectedCurso, selectedYear]);

  const fetchCursos = async (signal) => {
    setLoading(true);
    try {
      const data = await getCursos({}, credentials, signal);
      console.log('fetchCursos - raw data:', JSON.stringify(data, null, 2));
      if (data.error) {
        throw new Error(data.message);
      }
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('fetchCursos - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al cargar los cursos', severity: 'error' });
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumnos = async (signal) => {
    setLoading(true);
    try {
      const data = await api_getAlumnosBecas(
        {
          pagno: selectedYear,
          pense: selectedCurso?.cod_ense,
          pgrado: selectedCurso?.cod_grado,
          pletra: selectedCurso?.letra,
        },
        credentials,
        signal
      );
      console.log('fetchAlumnos - raw data:', JSON.stringify(data, null, 2));
      if (data.error) {
        throw new Error(data.message);
      }
      const dataArray = Object.values(data);
      console.log('fetchAlumnos - raw dataArray:', dataArray);
      const processedData = dataArray
        .filter((row) => row && row.rut != null)
        .map((row) => ({
          id: row.rut,
          rut: row.rut ?? '',
          dv: row.dv ?? '',
          nombres: row.nombres ?? '',
          apat: row.apat ?? '',
          amat: row.amat ?? '',
          id_tipo_beca: row.id_tipo_beca ?? null,
          porcentaje_asignado: row.porcentaje_asignado != null ? Number(row.porcentaje_asignado).toFixed(2) : '',
          montodescuento: row.montodescuento != null ? Number(row.montodescuento) : '',
          nombre: row.nombre != null ? row.nombre : 'Sin beca',
          apagar: row.apagar != null ? Number(row.apagar) : '',
        }));
      setAlumnos(processedData);
      alumnosRef.current = processedData; // Actualizar ref
      if (processedData.length <= paginationModel.page * paginationModel.pageSize) {
        setPaginationModel((prev) => ({ ...prev, page: Math.max(0, Math.floor((processedData.length - 1) / prev.pageSize)) }));
      }
    } catch (error) {
      console.error('fetchAlumnos - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al cargar los alumnos', severity: 'error' });
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  const validateBeca = (alumno, beca) => {
    if (!beca) {
      return 'No hay beca seleccionada';
    }
    if (beca.nombre === 'Pre-Kinder' && !(selectedCurso?.cod_ense === 10 && selectedCurso?.cod_grado === 4)) {
      return 'La beca "Pre-Kinder" solo se aplica a cursos de Pre Kinder';
    }
    if (beca.nombre === 'Kinder' && !(selectedCurso?.cod_ense === 10 && selectedCurso?.cod_grado === 5)) {
      return 'La beca "Kinder" solo se aplica a cursos de Kinder';
    }
    if (beca.nombre === 'Básica' && !(selectedCurso?.cod_ense === 110 && selectedCurso?.cod_grado === 1)) {
      return 'La beca "Básica" solo se aplica a cursos 1er Básico';
    }
    return null;
  };

  const handleDoubleClick = (params) => {
    if (!selectedBeca) {
      setSnackbar({ open: true, message: 'Seleccione un tipo de beca primero', severity: 'error' });
      return;
    }
    if (!selectedCurso) {
      setSnackbar({ open: true, message: 'Seleccione un curso primero', severity: 'error' });
      return;
    }
    const error = validateBeca(params.row, selectedBeca);
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }
    if (isDescuentoEditable) {
      setSnackbar({ open: true, message: 'Para esta beca, edite el monto de descuento en la columna correspondiente', severity: 'warning' });
      return;
    }
    setConfirmDialog({ open: true, alumno: params.row, action: 'asignar' });
  };

  const handleEditMonto = (id) => {
    console.log('handleEditMonto - id:', id);
    if (gridRef.current) {
      gridRef.current.startCellEditMode({ id, field: 'montodescuento' });
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - newRow:', newRow, 'oldRow:', oldRow);
    const montoStr = String(newRow.montodescuento ?? '').trim();
    const errors = {};
    if (!montoStr) {
      errors.montodescuento = 'Debe ingresar un monto de descuento';
    } else if (!/^\d+$/.test(montoStr)) {
      errors.montodescuento = 'El monto de descuento debe ser un número entero';
    } else if (Number(montoStr) <= 0) {
      errors.montodescuento = 'El monto de descuento debe ser mayor a 0';
    } else if (configMonto && Number(montoStr) > configMonto) {
      errors.montodescuento = 'El monto de descuento no puede exceder el monto base';
    }
    if (Object.keys(errors).length > 0) {
      setSnackbar({ open: true, message: errors.montodescuento, severity: 'error' });
      throw new Error(errors.montodescuento);
    }
    try {
      const response = await api_asignarBecaAlumnos(
        {
          rut: newRow.rut,
          id_tipo_beca: selectedBeca.id,
          porcentaje_asignado: selectedBeca.porcentaje != null ? Number(selectedBeca.porcentaje).toFixed(2) : null,
          monto_descuento: Number(montoStr),
          apagar: configMonto ? configMonto - Number(montoStr) : 0,
          agno: selectedYear,
          configMonto,
        },
        credentials
      );
      console.log('processRowUpdate - response:', response);
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({
        open: true,
        message: `Monto de descuento actualizado a $${Number(montoStr).toLocaleString('es-CL')} para ${newRow.nombres} ${newRow.apat}`,
        severity: 'success',
      });
      // Actualizar estado local para reflejar id_tipo_beca y mostrar ícono Delete
      const updatedRow = {
        ...newRow,
        id_tipo_beca: selectedBeca.id,
        nombre: selectedBeca.nombre,
        porcentaje_asignado: selectedBeca.porcentaje != null ? Number(selectedBeca.porcentaje).toFixed(2) : '',
        montodescuento: Number(montoStr),
        apagar: configMonto ? configMonto - Number(montoStr) : 0,
      };
      setAlumnos((prev) =>
        prev.map((r) => (r.id === newRow.id ? updatedRow : r))
      );
      alumnosRef.current = alumnos; // Actualizar ref
      return updatedRow;
    } catch (error) {
      console.error('processRowUpdate - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al actualizar el monto de descuento', severity: 'error' });
      throw error;
    }
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('handleProcessRowUpdateError - error:', error);
    setSnackbar({ open: true, message: error.message || 'Error al actualizar el monto', severity: 'error' });
  };

  const handleSelectAll = () => {
    if (!selectedBeca) {
      setSnackbar({ open: true, message: 'Seleccione un tipo de beca primero', severity: 'error' });
      return;
    }
    if (!selectedCurso) {
      setSnackbar({ open: true, message: 'Seleccione un curso primero', severity: 'error' });
      return;
    }
    setConfirmDialog({ open: true, alumno: null, action: 'select_all' });
  };

  const handleDeleteBeca = (alumno) => {
    if (!alumno.id_tipo_beca) {
      setSnackbar({ open: true, message: 'El alumno no tiene una beca asignada', severity: 'warning' });
      return;
    }
    setConfirmDialog({ open: true, alumno, action: 'eliminar' });
  };

  const confirmApplyBeca = async (alumno) => {
    if (!alumno || !selectedBeca) return;

    try {
      const montoDescuento = selectedBeca.descuento != null && Number(selectedBeca.descuento) > 0 ? Number(selectedBeca.descuento) : null;
      const response = await api_asignarBecaAlumnos(
        {
          rut: alumno.rut,
          id_tipo_beca: selectedBeca.id,
          porcentaje_asignado: selectedBeca.porcentaje != null ? Number(selectedBeca.porcentaje).toFixed(2) : null,
          monto_descuento: montoDescuento,
          apagar: selectedBeca.monto != null ? Number(selectedBeca.monto) : (montoDescuento && configMonto ? configMonto - montoDescuento : null),
          agno: selectedYear,
          configMonto,
        },
        credentials
      );
      console.log('confirmApplyBeca - response:', response);
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({
        open: true,
        message: `Beca "${selectedBeca.nombre}" asignada a ${alumno.nombres} ${alumno.apat}`,
        severity: 'success',
      });
      // Actualizar estado local para reflejar id_tipo_beca
      setAlumnos((prev) =>
        prev.map((r) =>
          r.id === alumno.id
            ? {
                ...r,
                id_tipo_beca: selectedBeca.id,
                nombre: selectedBeca.nombre,
                porcentaje_asignado: selectedBeca.porcentaje != null ? Number(selectedBeca.porcentaje).toFixed(2) : '',
                montodescuento: montoDescuento,
                apagar: selectedBeca.monto != null ? Number(selectedBeca.monto) : (montoDescuento && configMonto ? configMonto - montoDescuento : ''),
              }
            : r
        )
      );
      alumnosRef.current = alumnos; // Actualizar ref
      await fetchAlumnos(new AbortController().signal); // Sincronizar con backend
    } catch (error) {
      console.error('confirmApplyBeca - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al asignar la beca', severity: 'error' });
    }
  };

  const renderConfirmDialog = () => {
    if (!confirmDialog.open) return null;
    const { action, alumno } = confirmDialog;
    let message = '';
    if (action === 'select_all') {
      message = `¿Desea asignar la beca "${selectedBeca?.nombre}" a todos los alumnos del curso?`;
    } else if (action === 'asignar') {
      message = `¿Desea asignar la beca "${selectedBeca?.nombre}" a ${alumno.nombres} ${alumno.apat}?`;
    } else if (action === 'eliminar') {
      message = `¿Desea eliminar la beca de ${alumno.nombres} ${alumno.apat}?`;
    }

    return (
      <Dialog
        maxWidth="sm"
        TransitionProps={{ onEntered: handleEntered }}
        open={confirmDialog.open}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          Confirmar Acción
        </DialogTitle>
        <DialogContent dividers sx={{ fontFamily: 'Arial', fontSize: '16px', lineHeight: 1.5, p: 3 }}>
          <Typography sx={{ whiteSpace: 'pre-line' }}>{message}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="error"
            variant="contained"
            size="large"
            aria-label="Cancelar acción"
            ref={noButtonRef}
          >
            No
          </Button>
          <Button
            onClick={confirmAction}
            color="success"
            variant="contained"
            size="large"
            aria-label="Confirmar acción"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const confirmAction = async () => {
    const { action, alumno } = confirmDialog;
    if (action === 'select_all') {
      setLoading(true);
      try {
        for (const a of alumnosRef.current) {
          const error = validateBeca(a, selectedBeca);
          if (error) {
            setSnackbar({ open: true, message: error, severity: 'error' });
            continue;
          }
          const montoDescuento = selectedBeca.descuento != null && Number(selectedBeca.descuento) > 0 ? Number(selectedBeca.descuento) : null;
          await api_asignarBecaAlumnos(
            {
              rut: a.rut,
              id_tipo_beca: selectedBeca.id,
              porcentaje_asignado: selectedBeca.porcentaje != null ? Number(selectedBeca.porcentaje).toFixed(2) : null,
              monto_descuento: montoDescuento,
              apagar: selectedBeca.monto != null ? Number(selectedBeca.monto) : (montoDescuento && configMonto ? configMonto - montoDescuento : null),
              agno: selectedYear,
              configMonto,
            },
            credentials
          );
        }
        setSnackbar({ open: true, message: 'Beca asignada a todos los alumnos del curso', severity: 'success' });
        await fetchAlumnos(new AbortController().signal);
      } catch (error) {
        console.error('confirmSelectAll - error:', error);
        setSnackbar({ open: true, message: error.message || 'Error al asignar becas a todos', severity: 'error' });
      } finally {
        setLoading(false);
      }
    } else if (action === 'asignar') {
      await confirmApplyBeca(alumno);
    } else if (action === 'eliminar') {
      try {
        const response = await api_eliminarBecaAlumno(
          {
            rut: alumno.rut,
            agno: selectedYear,
          },
          credentials
        );
        console.log('confirmDeleteBeca - response:', response);
        if (response.error) {
          throw new Error(response.message);
        }
        setSnackbar({ open: true, message: `Beca eliminada de ${alumno.nombres} ${alumno.apat}`, severity: 'success' });
        // Actualizar estado local para reflejar eliminación
        setAlumnos((prev) =>
          prev.map((r) =>
            r.id === alumno.id
              ? {
                  ...r,
                  id_tipo_beca: null,
                  nombre: 'Sin beca',
                  porcentaje_asignado: '',
                  montodescuento: '',
                  apagar: '',
                }
              : r
          )
        );
        alumnosRef.current = alumnos; // Actualizar ref
        await fetchAlumnos(new AbortController().signal); // Sincronizar con backend
      } catch (error) {
        console.error('confirmDeleteBeca - error:', error);
        setSnackbar({ open: true, message: error.message || 'Error al eliminar la beca', severity: 'error' });
      }
    }
    setConfirmDialog({ open: false, alumno: null, action: '' });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, alumno: null, action: '' });
  };

  const handleEntered = () => {
    noButtonRef.current?.focus();
  };

  const columns = useMemo(
    () => [
      {
        field: 'rut',
        headerName: 'RUT',
        width: 100,
        valueGetter: (value, row) => row.rut ?? '',
      },
      {
        field: 'dv',
        headerName: 'DV',
        width: 50,
        valueGetter: (value, row) => row.dv ?? '',
      },
      {
        field: 'apat',
        headerName: 'Apellido Paterno',
        width: 120,
        valueGetter: (value, row) => row.apat ?? '',
      },
      {
        field: 'amat',
        headerName: 'Apellido Materno',
        width: 120,
        valueGetter: (value, row) => row.amat ?? '',
      },
      {
        field: 'nombres',
        headerName: 'Nombres',
        width: 150,
        valueGetter: (value, row) => row.nombres ?? '',
      },
      {
        field: 'id_tipo_beca',
        headerName: 'Tipo de Beca',
        width: 150,
        valueGetter: (value, row) => {
          if (!row.id_tipo_beca) return 'Sin beca';
          return row.nombre;
        },
      },
      {
        field: 'montodescuento',
        headerName: 'Descuento (CLP)',
        width: 120,
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        editable: isDescuentoEditable,
        valueGetter: (value, row) => row.montodescuento ?? '',
        renderCell: (params) => {
          const value = params.row.montodescuento;
          console.log('renderCell montodescuento - params:', params);
          return value != null && value !== '' ? `$${Number(value).toLocaleString('es-CL')}` : '';
        },
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        type: 'actions',
        getActions: ({ row }) => {
          const showEdit = isDescuentoEditable;
          const showDelete = row.id_tipo_beca != null;

          return [
            showEdit ? (
              <IconButton
                key="edit"
                onClick={() => handleEditMonto(row.id)}
                color="primary"
                aria-label="Editar monto de descuento"
                title="Editar monto de descuento"
              >
                <Edit />
              </IconButton>
            ) : null,
            showDelete ? (
              <IconButton
                key="delete"
                onClick={() => handleDeleteBeca(row)}
                color="error"
                aria-label="Eliminar beca"
                title="Eliminar beca"
              >
                <Delete />
              </IconButton>
            ) : null,
          ].filter(Boolean);
        },
      },
    ],
    [isDescuentoEditable]
  );

  return (
    <Card sx={{ maxWidth: '100%', boxShadow: 3, m: 2, borderRadius: 2, mx: 'auto' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="h6" gutterBottom>
            Asignar Becas a Alumnos {selectedYear ? `(${selectedYear})` : ''}
            {selectedBeca?.nombre ? `     Beca seleccionada: ${selectedBeca.nombre} con $ ${selectedBeca.descuento ?? '0'} de descuento` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleccione un curso y haga doble click en un alumno para asignar la beca seleccionada. Para becas con monto editable, haga clic en el ícono de editar y modifique el monto en la columna Descuento.
          </Typography>
        </Box>
        <Box sx={{ height: 400, width: '100%', mx: 'auto', mt: 5 }}>
          {renderConfirmDialog()}
          <DataGrid
            rows={alumnos}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            onRowDoubleClick={handleDoubleClick}
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={36}
            localeText={{
              ...esES.components.MuiDataGrid.defaultProps.localeText,
              noRowsLabel: selectedCurso ? 'No hay alumnos' : 'Seleccione un curso',
            }}
            loading={loading}
            slots={{ toolbar: Toolbar }}
            slotProps={{
              toolbar: { selectedYear, selectedBeca, cursos, selectedCurso, setSelectedCurso, showSelectAll, handleSelectAll },
            }}
            disableRowSelectionOnClick
            disableSelectionOnClick={loading || alumnos.length === 0 || !selectedCurso}
            apiRef={gridRef}
            sx={{
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
              '& .MuiDataGrid-row.Mui-selected': { backgroundColor: '#bbdefb' },
              '& .MuiDataGrid-cell': { padding: '4px', fontSize: '14px' },
              '& .MuiDataGrid-columnHeader': { fontSize: '14px', fontWeight: 'bold' },
            }}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar({ open: false, message: '', severity: 'info' })}
              severity={snackbar.severity}
              sx={{ width: '100%', boxShadow: 3 }}
            >
              <AlertTitle>{snackbar.severity === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AsignarBecaAlumnos;
/* eslint-disable react-hooks/exhaustive-deps */
/*
from '../../../docentes/api-docentes';
      const dataArray = Object.values( data )
      const processedData = dataArray

*/
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DataGrid, GridRowModes, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
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
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { esES } from '@mui/x-data-grid/locales';
import { getPagosTipoBeca, UpsertPagosTipoBeca, DeletePagosTipoBeca } from '../../../docentes/api-docentes';

function EditToolbar({ setRows, setRowModesModel, selectedYear }) {
  const handleClick = () => {
    if (!selectedYear) {
      alert('Por favor, seleccione un año en Configuración de Montos primero.');
      return;
    }
    const id = `new-${Date.now()}`; // ID temporal para filas nuevas
    setRows((oldRows) => [
      ...oldRows,
      { id, nombre: '', descripcion: '', agno: selectedYear, porcentaje: '', descuento: '', monto: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick} disabled={!selectedYear}>
        Agregar
      </Button>
    </GridToolbarContainer>
  );
}

const computeMutation = (newRow, oldRow) => {
  let ret = '';
  let salto = '\n';
  if (newRow.nombre !== oldRow.nombre) {
    ret += `Nombre de "${oldRow.nombre || ''}" a "${newRow.nombre || ''}"${salto}`;
  }
  if (newRow.descripcion !== oldRow.descripcion) {
    ret += `Descripción de "${oldRow.descripcion || ''}" a "${newRow.descripcion || ''}"${salto}`;
  }
  if (newRow.porcentaje !== oldRow.porcentaje) {
    ret += `Porcentaje de ${oldRow.porcentaje ? Number(oldRow.porcentaje).toFixed(3) + '%' : 'ninguno'} a ${
      newRow.porcentaje ? Number(newRow.porcentaje).toFixed(3) + '%' : 'ninguno'
    }${salto}`;
  }
  if (newRow.descuento !== oldRow.descuento) {
    ret += `Descuento de $${Number(oldRow.descuento || 0).toLocaleString('es-CL')} a $${Number(newRow.descuento || 0).toLocaleString('es-CL')}${salto}`;
  }
  if (newRow.monto !== oldRow.monto) {
    ret += `Monto de $${Number(oldRow.monto || 0).toLocaleString('es-CL')} a $${Number(newRow.monto || 0).toLocaleString('es-CL')}${salto}`;
  }
  return ret;
};

const PagosTipoBecas = ({ credentials, selectedYear, configMonto }) => {
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [rowModesModel, setRowModesModel] = useState({});
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const noButtonRef = useRef(null);
  const rowsRef = useRef(rows);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Cambia a true cuando el procedimiento almacenado acepte id
  const useIdForDelete = false;

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // Fetch data from API when selectedYear changes
  useEffect(() => {
    if (!selectedYear) {
      setRows([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchTiposBeca(controller.signal);
    return () => controller.abort();
  }, [selectedYear]);
  
  const fetchTiposBeca = async (signal) => {
    setLoading(true);
    try {
      const data = await getPagosTipoBeca({ agno: selectedYear }, credentials, signal);
      // console.log('fetchTiposBeca - raw data:', data);
      if (data.error) {
        throw new Error(data.message);
      }
      const dataArray = Object.values( data )
      const processedData = dataArray
        .filter((row) => row && row.id != null)
        .map((row) => ({
          id: row.id,
          nombre: row.nombre ?? '',
          descripcion: row.descripcion ?? '',
          agno: row.agno != null ? parseInt(row.agno) : selectedYear,
          porcentaje: row.porcentaje != null ? Number(row.porcentaje) : '',
          descuento: row.descuento != null ? Number(row.descuento) : '',
          monto: row.monto != null ? Number(row.monto) : '',
        }));
      // console.log('fetchTiposBeca - processed data:', processedData);
      setRows(processedData);
      if (processedData.length <= paginationModel.page * paginationModel.pageSize) {
        setPaginationModel((prev) => ({ ...prev, page: Math.max(0, Math.floor((processedData.length - 1) / prev.pageSize)) }));
      }
      // console.log('fetchTiposBeca - updated rows:', processedData, 'paginationModel:', paginationModel);
    } catch (error) {
      console.error('fetchTiposBeca - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al cargar los tipos de beca', severity: 'error' });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle row edit stop
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowModes.rowFocus) {
      event.defaultMuiPrevented = true;
    }
  };

  // Handle edit click
  const handleEditClick = (id) => () => {
    // console.log('handleEditClick - id:', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // Handle save click
  const handleSaveClick = (id) => () => {
    // console.log('handleSaveClick - id:', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // Handle delete click
  // jrjr
  const handleDeleteClick = (id) => () => {
    // console.log('handleDeleteClick - id:', id, 'rows==>', JSON.stringify(rows, null, 2));
    setSnackbar({
      open: true,
      message: '¿Está seguro de eliminar este registro?',
      severity: 'warning',
      action: (
        <Box>
          <Button
            sx={{ color: 'success.main' }}
            onClick={() => confirmDelete(id)}
            startIcon={<Delete />}
          >
            Confirmar
          </Button>
          <Button
            sx={{ color: 'error.main' }}
            onClick={() => setSnackbar({ open: false, message: '', severity: 'info', action: null })}
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
        </Box>
      ),
    });
  };

  // Confirm delete
  const confirmDelete = async (id) => {
    // console.log('confirmDelete - received id:', id, 'rows==>', JSON.stringify(rowsRef.current, null, 2));
    const row = rowsRef.current.find((r) => String(r.id) === String(id));
    // console.log('confirmDelete - id:', id, 'row:', JSON.stringify(row, null, 2));
    if (!row && !useIdForDelete) {
      setSnackbar({ open: true, message: `No se encontró el registro con id ${id} en la lista`, severity: 'error' });
      return;
    }
    if (row && row.isNew) {
      setRows(rowsRef.current.filter((r) => String(r.id) !== String(id)));
      setSnackbar({ open: true, message: 'Fila cancelada correctamente', severity: 'success' });
      if (rowsRef.current.length <= paginationModel.page * paginationModel.pageSize) {
        setPaginationModel((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }));
      }
      // console.log('confirmDelete - updated rows:', JSON.stringify(rowsRef.current.filter((r) => String(r.id) !== String(id)), null, 2), 'paginationModel:', paginationModel);
      return;
    }
    try {
      const response = await DeletePagosTipoBeca(useIdForDelete ? { id } : { agno: row.agno, nombre: row.nombre }, credentials);
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({ open: true, message: 'Tipo de beca eliminado correctamente', severity: 'success' });
      await fetchTiposBeca(new AbortController().signal);
      // console.log('confirmDelete - after fetchTiposBeca, rows:', JSON.stringify(rows, null, 2), 'paginationModel:', paginationModel);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al eliminar el tipo de beca', severity: 'error' });
    }
  };

  // Handle cancel click
  const handleCancelClick = (id) => () => {
    // console.log('handleCancelClick - id:', id);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => String(row.id) === String(id));
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => String(row.id) !== String(id)));
    }
  };

  // Validate row data
  const validateRow = (row) => {
    const errors = {};
    const nombreStr = String(row.nombre ?? '').trim();
    if (!nombreStr || nombreStr.length === 0) {
      errors.nombre = 'El nombre es obligatorio';
    } else if (nombreStr.length > 50) {
      errors.nombre = 'El nombre no puede exceder los 50 caracteres';
    }
    const porcentajeStr = String(row.porcentaje ?? '').trim();
    if (porcentajeStr && !/^\d+(\.\d{1,3})?$/.test(porcentajeStr)) {
      errors.porcentaje = 'El porcentaje debe ser un número decimal con hasta 3 decimales';
    } else if (porcentajeStr && (Number(porcentajeStr) < 0 || Number(porcentajeStr) > 100)) {
      errors.porcentaje = 'El porcentaje debe estar entre 0 y 100';
    }
    if (row.agno !== selectedYear) {
      errors.agno = 'El año debe coincidir con el seleccionado';
    }
    if (porcentajeStr && !configMonto) {
      errors.porcentaje = 'No hay monto configurado para el año seleccionado';
    }
    return errors;
  };

  // Process row update
  const processRowUpdate = useCallback(
    (newRow, oldRow) =>      
      new Promise((resolve, reject) => {
        if (!configMonto) {
      setSnackbar({
        open: true,
        message: 'Debe configurar el monto base primero',
        severity: 'error'
      });
      return Promise.reject(oldRow);
    }
 // Validación inicial de parámetros
        console.log('newRow en processRowUpdate:', newRow); // Verifica qué contiene newRow
        const errors = validateRow(newRow);
        if (Object.keys(errors).length > 0) {
           console.log('en processRowUpdate error :', errors);
          setSnackbar({ open: true, message: errors.nombre || errors.porcentaje || errors.agno, severity: 'error' });
          reject(oldRow);
          return;
        }
        // Calculate descuento and monto based on porcentaje and configMonto
           console.log('en processRowUpdate Calculando descuentos...');
        let updatedRow = { ...newRow };
        if (newRow.porcentaje && configMonto) {
          const porcentaje = Number(newRow.porcentaje);
          updatedRow.descuento = Math.round(configMonto * (porcentaje / 100));
          updatedRow.monto = configMonto - updatedRow.descuento;
        } else {
          updatedRow.descuento = null;
          updatedRow.monto = null;
        }
        // console.log('processRowUpdate - updatedRow:', updatedRow);
        const mutation = computeMutation(updatedRow, oldRow);
        if (mutation) {
          setPromiseArguments({ resolve, reject, newRow: updatedRow, oldRow });
        } else {
          resolve(oldRow);
        }
      }),
    [selectedYear, configMonto]
  );

  // Handle row modes model change
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Handle process row update error
  const handleProcessRowUpdateError = (error) => {
    console.error('Error al procesar la actualización de la fila:', error);
    setSnackbar({ open: true, message: 'Error al procesar los cambios', severity: 'error' });
  };

  // Handle dialog confirmation
  const handleNo = () => {
    const { newRow, oldRow, resolve } = promiseArguments;
    // console.log('handleNo - newRow:', newRow, 'oldRow:', oldRow);
    if (newRow && newRow.isNew) {
      setRows(rows.filter((row) => String(row.id) !== String(newRow.id)));
    }
    resolve(oldRow);
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, reject, resolve } = promiseArguments;
    try {
      const response = await UpsertPagosTipoBeca(
        {
          nombre: newRow.nombre.trim(),
          descripcion: newRow.descripcion ? newRow.descripcion.trim() : null,
          agno: parseInt(newRow.agno, 10),
          porcentaje: newRow.porcentaje ? Number(newRow.porcentaje) : null,
          descuento: newRow.descuento,
          monto: newRow.monto,
        },
        credentials
      );
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({ open: true, message: 'Tipo de beca guardado correctamente', severity: 'success' });
      resolve({ ...newRow, id: response.id || newRow.id, isNew: false });
      setPromiseArguments(null);
      await fetchTiposBeca(new AbortController().signal);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al guardar el tipo de beca', severity: 'error' });
      reject(newRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    noButtonRef.current?.focus();
  };

  // Render confirm dialog
  // jrjr
  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }
    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);
    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle sx={{ backgroundColor: 'blue', color: 'white' }}>
          ¿Está seguro?
        </DialogTitle>
        <DialogContent dividers style={{ whiteSpace: 'pre-line', fontFamily: 'Arial', fontSize: '18px' }}>
          {`Presione 'Sí' para efectuar los cambios:\n${mutation}`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo} color="error" variant="contained">
            No
          </Button>
          <Button onClick={handleYes} color="success" variant="contained">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Memoize columns
  const columns = useMemo(
    () => [
      {
        field: 'nombre',
        headerName: 'Nombre',
        width: 150,
        editable: true,
        type: 'string',
        valueGetter: (value, row) => {
          // console.log('valueGetter nombre - value:', value, 'row:', row);
          return row.nombre ?? '';
        },
      },
      {
        field: 'descripcion',
        headerName: 'Descripción',
        width: 200,
        editable: true,
        type: 'string',
        valueGetter: (value, row) => {
          // console.log('valueGetter descripcion - value:', value, 'row:', row);
          return row.descripcion ?? '';
        },
        renderCell: (params) => {
          // console.log('renderCell descripcion - params.value:', params.value, 'params.row:', params.row);
          return params.value || 'Sin descripción';
        },
      },
      {
        field: 'porcentaje',
        headerName: 'Porcentaje (%)',
        width: 120,
        editable: true,
        type: 'number',
        valueGetter: (value, row) => {
          // console.log('valueGetter porcentaje - value:', value, 'row:', row);
          return row.porcentaje != null ? Number(row.porcentaje) : null;
        },
        // valueParser: (value) => {
        // return value != null && value !== '' ? Number(value) : null;
valueParser: (value) => {
  if (value == null || value === '') return null;
  // Reemplaza comas por puntos para el parseo numérico
  const normalizedValue = String(value).replace(',', '.');
  return Number(normalizedValue);
  },
        renderCell: (params) => {
          // console.log('renderCell porcentaje - params.value:', params.value, 'params.row:', params.row);
          const value = params.row.porcentaje;
          return value != null ? `${Number(value).toFixed(3)}%` : '';
        },
      },
      {
        field: 'descuento',
        headerName: 'Descuento (CLP)',
        width: 120,
        editable: false, // Calculated field
        type: 'number',
        valueGetter: (value, row) => {
          // console.log('valueGetter descuento - value:', value, 'row:', row);
          return row.descuento ?? '';
        },
        renderCell: (params) => {
          // console.log('renderCell descuento - params.value:', params.value, 'params.row:', params.row);
          const value = params.row.descuento;
          return value != null && value !== '' ? `$${Number(value).toLocaleString('es-CL')}` : '';
        },
      },
      {
        field: 'monto',
        headerName: 'Monto (CLP)',
        width: 120,
        editable: false, // Calculated field
        type: 'number',
        valueGetter: (value, row) => {
          // console.log('valueGetter monto - value:', value, 'row:', row);
          return row.monto ?? '';
        },
        renderCell: (params) => {
          // console.log('renderCell monto - params.value:', params.value, 'params.row:', params.row);
          const value = params.row.monto;
          return value != null && value !== '' ? `$${Number(value).toLocaleString('es-CL')}` : '';
        },
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 150,
        type: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{ color: 'primary.main' }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                color="error"
                onClick={handleCancelClick(id)}
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              color="primary"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              color="error"
              onClick={handleDeleteClick(id)}
            />,
          ];
        },
      },
    ],
    [rowModesModel]
  );

if (!selectedYear || !configMonto) {
    return (
      <Card sx={{ maxWidth: 900, boxShadow: 3, p: 3 }}>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Configuración requerida</AlertTitle>
            {!selectedYear && !configMonto ? (
              <>Por favor seleccione una fila de año monto <strong>Configuración de Montos</strong></>
            ) : (
              <>Por favor configure el monto base primero en <strong>Configuración de Montos</strong></>
            )}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 900, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Configuración de Tipos de Beca {selectedYear ? `(${selectedYear})` : ''}</Typography>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          {renderConfirmDialog()}
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={36}
            localeText={{
              ...esES.components.MuiDataGrid.defaultProps.localeText,
              noRowsLabel: selectedYear ? 'No hay tipos de beca' : 'Seleccione un año en Configuración de Montos',
            }}
            loading={loading}
            slots={{ toolbar: EditToolbar }}
            slotProps={{ toolbar: { setRows, setRowModesModel, selectedYear } }}
            sx={{
              '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
              '& .MuiDataGrid-row.Mui-selected': { backgroundColor: '#e3f2fd' },
              '& .MuiDataGrid-cell': {
                padding: '4px',
              },
            }}
            disableSelectionOnClick={loading || rows.length === 0 || !selectedYear}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.action ? null : 4000}
            onClose={() => setSnackbar({ open: false, message: '', severity: 'info', action: null })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            {snackbar.action ? (
              <Alert
                severity={snackbar.severity}
                sx={{ width: '100%', backgroundColor: 'white', color: 'black' }}
                action={snackbar.action}
              >
                <AlertTitle>{snackbar.severity === 'success' ? 'Éxito' : snackbar.severity === 'error' ? 'Error' : 'Advertencia'}</AlertTitle>
                {snackbar.message}
              </Alert>
            ) : (
              <Alert
                onClose={() => setSnackbar({ open: false, message: '', severity: 'info', action: null })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                <AlertTitle>{snackbar.severity === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
                {snackbar.message}
              </Alert>
            )}
          </Snackbar>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagosTipoBecas;
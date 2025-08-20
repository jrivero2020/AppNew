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
} from '@mui/material';
import { esES } from '@mui/x-data-grid/locales';
import { getCursos, api_getAlumnosBecas, api_asignarBecaAlumnos } from "../../../docentes/api-docentes";

function Toolbar({ selectedYear, selectedBeca, cursos, selectedCurso, setSelectedCurso }) {
  // Validar props
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
    </GridToolbarContainer>
  );
}

const AsignarBecaAlumnos = ({ credentials, selectedYear, configMonto, selectedBeca }) => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, alumno: null });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 47 });
  const noButtonRef = useRef(null);
  const alumnosRef = useRef(alumnos);

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

      if (data.error) {
        throw new Error(data.message);
      }
      const dataArray = Object.values(data)
            console.log('fetchAlumnos - raw dataArray:', dataArray);
      const processedData = dataArray
        .filter((row) => row && row.rut != null)
        .map((row) => ({
          id: row.rut, // Usar rut como ID único
          rut: row.rut ?? '',
          dv: row.dv ?? '',
          nombres: row.nombres ?? '',
          apat: row.apat ?? '',
          amat: row.amat ?? '',
          id_tipo_beca: row.id_tipo_beca ?? null,
          porcentaje_asignado: row.porcentaje_asignado != null ? Number(row.porcentaje_asignado) : '',
          montodescuento: row.montodescuento != null ? Number(row.montodescuento) : '',
          nombre: row.nombre != null ? row.nombre:'Sin beca',
          apagar: row.apagar != null ? Number(row.apagar) : '',
        }));
      setAlumnos(processedData);
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
    if (beca.nombre === 'Básica' && !(selectedCurso?.cod_ense !== 110 && selectedCurso?.cod_grado === 1)) {
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
    console.log('handleDoubleClick - alumno:', params.row, 'selectedBeca:', selectedBeca);
    setConfirmDialog({ open: true, alumno: params.row });
  };

  const confirmApplyBeca = async () => {
    const { alumno } = confirmDialog;
    if (!alumno || !selectedBeca) return;

    let porcentaje_asignado = selectedBeca.porcentaje != null && selectedBeca.porcentaje !== 0 ? Number(selectedBeca.porcentaje) : null;
    let monto_descuento = selectedBeca.descuento != null && selectedBeca.descuento !== 0 ? Number(selectedBeca.descuento): 0;
    let apagar = selectedBeca.monto != null && selectedBeca.monto !== 0 ? Number(selectedBeca.monto): 0;

    try {
      const response = await api_asignarBecaAlumnos(
        {
          rut: alumno.rut,
          id_tipo_beca: selectedBeca.id,
          porcentaje_asignado,
          monto_descuento,
          apagar,
          agno: selectedYear,
          configMonto
        },
        credentials
      );
      console.log('confirmApplyBeca - response:', response);
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({ open: true, message: `Beca "${selectedBeca.nombre}" asignada a ${alumno.nombres} ${alumno.apat}`, severity: 'success' });
      await fetchAlumnos(new AbortController().signal);
    } catch (error) {
      console.error('confirmApplyBeca - error:', error);
      setSnackbar({ open: true, message: error.message || 'Error al asignar la beca', severity: 'error' });
    } finally {
      setConfirmDialog({ open: false, alumno: null });
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, alumno: null });
  };

  const handleEntered = () => {
    noButtonRef.current?.focus();
  };

  const processRowUpdate = (newRow, oldRow) => {
    if (!selectedBeca || (selectedBeca.porcentaje != null && selectedBeca.porcentaje !== 0)) {
      return oldRow; // Solo editable si porcentaje es null/0
    }
    const errors = {};
    const montoStr = String(newRow.montodescuento ?? '').trim();
    if (montoStr && !/^\d+$/.test(montoStr)) {
      errors.montodescuento = 'El monto de descuento debe ser un número entero';
    } else if (montoStr && Number(montoStr) < 0) {
      errors.montodescuento = 'El monto de descuento no puede ser negativo';
    } else if (montoStr && configMonto && Number(montoStr) > configMonto) {
      errors.montodescuento = 'El monto de descuento no puede exceder el monto base';
    }
    if (Object.keys(errors).length > 0) {
      setSnackbar({ open: true, message: errors.montodescuento, severity: 'error' });
      return oldRow;
    }
    return {
      ...newRow,
      montodescuento: montoStr ? Number(montoStr) : '',
      apagar: montoStr && configMonto ? configMonto - Number(montoStr) : '',
    };
  };

  const handleProcessRowUpdateError = (error) => {
    setSnackbar({ open: true, message: 'Error al procesar los cambios', severity: 'error' });
  };

  const renderConfirmDialog = () => {
    if (!confirmDialog.open || !confirmDialog.alumno || !selectedBeca) return null;
    const message = `¿Desea asignar la beca "${selectedBeca.nombre}" a ${confirmDialog.alumno.nombres} ${confirmDialog.alumno.apat}?`;

    return (
      <Dialog
        maxWidth="sm"
        TransitionProps={{ onEntered: handleEntered }}
        open={confirmDialog.open}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          Confirmar Asignación de Beca
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
            aria-label="Cancelar asignación"
            ref={noButtonRef}
          >
            No
          </Button>
          <Button
            onClick={confirmApplyBeca}
            color="success"
            variant="contained"
            size="large"
            aria-label="Confirmar asignación"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    );
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
          //if (selectedBeca && row.id_tipo_beca === selectedBeca.id) return selectedBeca.nombre;
          return row.nombre;
        },
      },
      {
        field: 'montodescuento',
        headerName: 'Descuento (CLP)',
        width: 120,
        editable: selectedBeca && (selectedBeca.porcentaje == null || selectedBeca.porcentaje === 0),
        type: 'number',
        align: 'center',
        headerAlign: 'center',
        valueGetter: (value, row) => row.montodescuento ?? '',
        renderCell: (params) => {
          const value = params.row.montodescuento;
          return value != null && value !== '' ? `$${Number(value).toLocaleString('es-CL')}` : '';
        },
      },
    ],
    [selectedBeca]
  );

  return (
    <Card sx={{ maxWidth: '100%', boxShadow: 3, m: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" mb={2}>
          <Typography variant="h6" gutterBottom>
            Asignar Becas a Alumnos {selectedYear ? `(${selectedYear})` : ''}
            {selectedBeca.nombre ? '     Beca seleccionada:' + selectedBeca.nombre + ' con $ ' + selectedBeca.descuento + ' de descuento' :'' }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleccione un curso y haga doble click en un alumno para asignar la beca seleccionada.
          </Typography>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          {renderConfirmDialog()}
          <DataGrid
            rows={alumnos}
            columns={columns}
            editMode="row"
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
              toolbar: { selectedYear, selectedBeca, cursos, selectedCurso, setSelectedCurso },
            }}
            disableRowSelectionOnClick
            disableSelectionOnClick={loading || alumnos.length === 0 || !selectedCurso}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AsignarBecaAlumnos;
import React, { useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Snackbar, Stack, Typography } from "@mui/material";

// import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { esES } from '@mui/x-data-grid/locales';

import BotonConHover from "../Botones/BtnDataAlumnos";
import { AuthContext } from "../../core/AuthProvider";
import { api_GetAlumnosCurso, api_ActAlumnoCurso } from "../../docentes/api-docentes";
import { CustomGridTitulo, } from "../componentes/customGridPaper/customVerAlumnos";
import { AlCursocolumns } from '../data/columnasGrid/AlumnosDelCurso'


function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = 0;

    setRows((oldRows) => [...oldRows, {
      id, nroal: 0, apat: '', amat: '', nombres: '',
      rut: 0, dv: '', nro_matricula: 0, fecharetiro: '1900-01-01', isNew: true
    }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nroal' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

function funcDateStr(lafecha) {
  let localFecha = (lafecha === null ? '01/01/1900' : lafecha)

  if (typeof localFecha === "string") {
    console.log("Es string localFecha", localFecha)
    localFecha = funcDateDate(localFecha)
  }

  console.log("funcDateStr ", localFecha)
  console.log("Tipo de lafecha ", typeof localFecha)

  return String(localFecha.getDate()).padStart(2, '0') + '/' + String(localFecha.getMonth() + 1).padStart(2, '0') + "/" + localFecha.getFullYear()
}

function funcDateDate(lafecha) {
  const [day, month, year] = lafecha.split('-');
  const date = new Date(year, month - 1, day);
  //const formattedDate = date.toLocaleDateString('es-ES'); // '30/03/2024'  
  return date
  //.toLocaleDateString('es-ES');
}


function computeMutation(newRow, oldRow) {
  let ret = ''
  const salto = "\n";
  const fechaNew = funcDateStr(newRow.fecharetiro)
  const fechaOld = funcDateStr(oldRow.fecharetiro)

  if (newRow.nro_matricula !== oldRow.nro_matricula) {
    ret = `Nº Matrícula ${oldRow.nro_matricula} por ${newRow.nro_matricula} ${salto}`
  }
  if (newRow.nroal !== oldRow.nroal) {
    ret += `Nº Lista ${oldRow.nroal} por ${newRow.nroal} ${salto}`
  }
  if (fechaNew !== fechaOld) {
    ret += `Fecha retiro ${fechaOld} por ${fechaNew} ${salto}`
  }
  if (newRow.activo !== oldRow.activo) {
    ret += `Alumno Activo ${oldRow.activo} por ${newRow.activo} ${salto}`
  }
  return ret;
}

const useMutation = () => {
  return React.useCallback(
    (user, jwt) =>
      new Promise((resolve, reject) => {
        api_ActAlumnoCurso({ rutAl: user.rut }, { t: jwt.token }, user).then((data) => {
          if (data && data.error) {
            reject();
          } else {
            resolve(user);
          }
        })
      }),
    [],
  );
};


const GridVerManejaDocentes = ({ idCurso, setIdCurso }) => {

  const [rows, setRows] = React.useState();
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    // console.log("Estoy en handleEditClick con id ", id)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  const mutateRow = useMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    [],
  );


  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  const newCol = {
    id: 0,
    nroal: 0,
    rut: 0,
    field: 'actions',
    type: 'actions',
    headerName: 'Acciones',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ];
    },
  }

  const columns = [...AlCursocolumns, newCol]
  const { jwt } = useContext(AuthContext);
  const [ShowPanel, setShowPanel] = useState(false);
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    api_GetAlumnosCurso(idCurso, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const [results, metadata] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          alert("**ATENCION** Alumnos no encotrados en el curso", metadata);
        } else {
          let arrRet = Object.values(results)
          setRows(arrRet)
          setShowPanel(true);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ResetMostarTodoElCurso = () => {
    console.log("rows con y sin modificaciones :", rows)
    setIdCurso({ ...idCurso, ense: "", grado: "", letra: "", curso: "" });
  };

  const handleProcessRowUpdateError = (error) => {
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario o registrando el error en la consola
    console.error('Error al procesar la actualización de la fila:', error);
  };



  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, jwt);
      setSnackbar({ children: 'Los cambios han sido guardados', severity: 'success', variant: "filled" });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: 'No puede grabar datos vacíos', severity: 'error', variant: "filled" });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };
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
        <DialogTitle sx={{ backgroundColor: 'blue', color: 'white' }}>Está seguro?</DialogTitle>
        <DialogContent dividers style={{ whiteSpace: "pre-line", fontFamily: "Arial", fontSize: "18px" }}>
          {`Presione 'Sí' para efectuar los cambios ${'\n'} ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo} color="error" variant="contained">
            No
          </Button>
          <Button onClick={handleYes} color="success" variant="contained" >Sí</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div style={{ paddingTop: "1px" }}>
      <CustomGridTitulo
        titulo={idCurso.curso}
        color={"#FFFFFF"}
        backGround={"#1976d2"}
      />
      <Grid
        container
        spacing={2}
        sx={{ margin: "auto", maxWidth: "95%" }}
      ></Grid>
      {ShowPanel && (
        <Grid item xs={10}>
          <Paper
            elevation={8}
            sx={{ pb: 3, pt: 2, backgroundColor: "#efebe9" }}
          >
            <Stack alignItems="center">
              {renderConfirmDialog()}
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowHeight={25}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                rowModesModel={rowModesModel}
                getRowId={(row) => row.rut}
                onRowModesModelChange={handleRowModesModelChange}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                  toolbar: EditToolbar,
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
              />
              {!!snackbar && (

                <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={4000} >

                  <Alert {...snackbar} onClose={handleCloseSnackbar}>
                    <AlertTitle>
                      {snackbar.severity === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
                    {snackbar.children}
                  </Alert>
                </Snackbar>

              )}

            </Stack>
          </Paper>
        </Grid>
      )}
     
    </div>
  );
};

export { GridVerManejaDocentes };
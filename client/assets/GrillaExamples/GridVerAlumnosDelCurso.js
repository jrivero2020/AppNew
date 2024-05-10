import React, { useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Grid, Paper, Stack, Typography } from "@mui/material";

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

import BotonConHover from "./../../assets/Botones/BtnDataAlumnos";
import { AuthContext } from "./../../core/AuthProvider";
import { api_GetAlumnosCurso } from "../../docentes/api-docentes";
import { CustomGridTitulo, } from "./../../assets/componentes/customGridPaper/customVerAlumnos";
import { AlCursocolumns } from './../../assets/data/columnasGrid/AlumnosDelCurso'


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


const GridVerAlumnosDelCurso = ({ idCurso, setIdCurso }) => {

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

  const processRowUpdate = (newRow) => {
    console.log("newRow.fecharetiro:", newRow.fecharetiro)
    const lafecha = newRow.fecharetiro === null ? (new Date('1900-01-01')) : newRow.fecharetiro
    const lafechaFmto = lafecha.getFullYear() + "-" + String(lafecha.getMonth() + 1).padStart(2, '0') + "-" + String(lafecha.getDate()).padStart(2, '0');
    const fechaDate = new Date(lafechaFmto)
    const fechaDateMas = fechaDate.setDate(fechaDate.getDate() + 1);
    const newRowActualizado = { ...newRow, fecharetiro: fechaDateMas }
    const updatedRow = { ...newRowActualizado, isNew: false, isUpdt:true };

    setRows(rows.map((row) => (row.rut === newRowActualizado.rut ? updatedRow : row)));
    return updatedRow;
  };

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
  //const columns = AlCursocolumns;

  const { jwt } = useContext(AuthContext);
  //const [dataCurso, setDataCurso] = useState(null);
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
          // setDataCurso(Object.values(results));
          // console.log("Alumnos del curso: ", arrRet)
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

            </Stack>
          </Paper>
        </Grid>
      )}

      <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }}>
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{ pb: 1, pt: 1, backgroundColor: "#1976d2" }}
          >
            <Stack alignItems="center">
              <Typography>&nbsp;</Typography>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Stack alignItems="center">
                    <Paper elevation={2} sx={{ px: 5, pb: 2, pt: 2 }}>
                      <BotonConHover
                        render={({
                          handleMouseEnter,
                          handleMouseLeave,
                          buttonStyle,
                        }) => (
                          <Button
                            size="large"
                            style={buttonStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            variant="contained"
                            onClick={ResetMostarTodoElCurso}
                            sx={{ fontSize: "11px" }}
                          >
                            Volver al panel de cursos
                          </Button>
                        )}
                      />
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export { GridVerAlumnosDelCurso };

/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/base";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';




import { esES } from '@mui/x-data-grid/locales';

import BotonConHover from "./../assets/Botones/BtnDataAlumnos";
import { AuthContext } from "./../core/AuthProvider";
import { api_GetAlumnosCurso } from "../docentes/api-docentes";

import {
  CustomGridTitulo,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

// import {AlCursocolumns} from './../assets/data/columnasGrid/AlumnosDelCurso'

const VerAlumnosDelCurso = ({ idCurso, setIdCurso }) => {
  const { jwt } = useContext(AuthContext);
  const [dataCurso, setDataCurso] = useState(null);
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
          alert("**ATENCION** Alumnos no encotrados en el curso");
        } else {
          setDataCurso(Object.values(results) );
          setShowPanel(true);
        }
      }
    });
  }, []);


  const ResetMostarTodoElCurso = () => {
    setIdCurso({ ...idCurso, ense: "", grado: "", letra: "", curso: "" });
  };

  const AlCursocolumns = [
    {
      field: "nroal",
      headerName: "Nº Lista",
      width: 80,
      height: 25,
      type: 'number',
      editable: true,
    },
    {
      field: "apat",
      headerName: "Ap. Paterno",
      width: 160,
      height: 25,
      editable: false,
    },
    {
      field: "amat",
      headerName: "Ap. Materno",
      width: 160,
      height: 25,
      editable: false,
    },
    {
      field: "nombres",
      headerName: "Nombres",
      width: 240,
      height: 25,
      editable: false,
    },
    {
      field: "rut",
      headerName: "Rut",
      width: 90,
      height: 25,
      editable: false,
    },
    {
      field: "dv",
      headerName: "dv",
      width: 1,
      height: 25,
      editable: false,
    },
    {
      field: "nro_matricula",
      headerName: "Nº Matrícula",
      width: 95,
      height: 25,
      type: 'number',
      editable: true,
    },
    {
      field: "fecharetiro",
      headerName: "F.Retiro",
      width: 180,
      height: 25,
      type: 'Date',
      editable: true,
    },

    {
      field: "activo",
      headerName: "activo",
      width: 60,
      height: 25,
      type: 'boolean',
      editable: true,
    },
  ];


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
                rows={dataCurso}
                columns={AlCursocolumns}
                editMode="row"

                rowHeight={25}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                getRowId={(row) => row.rut}
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

export { VerAlumnosDelCurso };

/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/base";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";

import BotonConHover from "./../assets/Botones/BtnDataAlumnos";
import { AuthContext } from "./../core/AuthProvider";
import { api_GetAlumnosCurso } from "../docentes/api-docentes";

import {
  CustomGridTitulo,
  agregarEspacios,
  CustomGridItem,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

const VerAlumnosDelCurso = ({ idCurso, setIdCurso }) => {
  const { jwt } = useContext(AuthContext);
  const [dataCurso, setDataCurso] = useState(null);
  const [ShowPanel, setShowPanel] = useState(false);
  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    api_GetAlumnosCurso(idCurso, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log("Ocurrió un error :===>", data, data.error);
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
          setDataCurso(results);
          setShowPanel(true);
        }
      }
    });
  }, []);

  const columns = [
    {
      field: "nroal",
      headerName: "Nº Lista",
      width: 80,
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
      editable: false,
    },
    {
      field: "fincorpora",
      headerName: "F.Ingreso",
      width: 95,
      height: 25,
      editable: false,
    },
    {
      field: "activo",
      headerName: "activo",
      width: 60,
      height: 25,
      editable: false,
    },
  ];

  /*		
/*
activo: 1
amat: "ARRIAGADA"
apat: "AGUILAR"
dv: "0"
fincorpora: "2023-12-27"
nombres: "IGNACIA ANTONIA"
nro_matricula: 1
nroal: 1
rut: 23497508 
*/

  const ResetMostarTodoElCurso = () => {
    setIdCurso({ ...idCurso, ense: "", grado: "", letra: "", curso: "" });
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
                rowHeight={25}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                rows={Object.values(dataCurso)}
                getRowId={(row) => row.rut}
                columns={columns}
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

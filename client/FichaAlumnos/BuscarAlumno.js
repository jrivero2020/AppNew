import React, { useContext, useEffect } from "react";
import { Grid, createTheme, ThemeProvider } from "@mui/material";

import { AuthContext } from "../core/AuthProvider";
// import { cFichaAlumno } from "./../Matriculas/matriculasCampos"

import {
  CustomGridTitulo,
  PaperBuscaAlumno,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

import {
  fNuevoAlumno,
  BuscaRut,
  BuscaNombre,
} from "./../assets/GrillaExamples/GridBuscarFichaAlumnos";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

export default function BuscarAlumno() {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  useEffect(() => {
      setDataBuscaAl({ ...dataBuscaAl, al_rut:0, al_dv:'',al_nombres:'',al_apat:'', al_amat:'',abort: true, nuevo: true, datagrid:false, buscando:true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>

      { dataBuscaAl.buscando && dataBuscaAl.abort && (
        <ThemeProvider theme={theme}>
          <div style={{ paddingTop: "99px" }}>
            <CustomGridTitulo
              titulo={"Busca alumno por ..."}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />

            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <PaperBuscaAlumno
                anchocol={3}
                titulo="Nuevo Alumno"
                BuscarX={fNuevoAlumno}
              />
              <PaperBuscaAlumno anchocol={3} titulo="Rut" BuscarX={BuscaRut} />
              <PaperBuscaAlumno
                anchocol={6}
                titulo="Nombre"
                BuscarX={BuscaNombre}
              />
            </Grid>
          </div>
        </ThemeProvider>
      )}
      { dataBuscaAl.datagrid && (
  <ThemeProvider theme={theme}>
  <div style={{ paddingTop: "99px" }}>
    <CustomGridTitulo
      titulo={"Aqui viene la datagrid de alumnos"}
      color={"#FFFFFF"}
      backGround={"#1976d2"}
    />
  </div>
</ThemeProvider>
      )}



      {!dataBuscaAl.buscando && !dataBuscaAl.nuevo && (
        <ThemeProvider theme={theme}>
          <div style={{ paddingTop: "99px" }}>
            <CustomGridTitulo
              titulo={"Alumno antiguo, confirmar los datos"}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />
          </div>
        </ThemeProvider>
      )}

      {!dataBuscaAl.buscando && !dataBuscaAl.abort && dataBuscaAl.nuevo && (
        <ThemeProvider theme={theme}>
          <div style={{ paddingTop: "99px" }}>
            <CustomGridTitulo
              titulo={"Alumno Nuevo, llenar todos los datos"}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />
          </div>
        </ThemeProvider>
      )}
      
    </>
  );
}

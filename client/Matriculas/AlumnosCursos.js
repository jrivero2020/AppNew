import React, { useState, useContext, useEffect } from "react";
import { Grid, createTheme, ThemeProvider, Paper, Button } from "@mui/material";
import { AuthContext } from "../core/AuthProvider";
import { VerAlumnosDelCurso } from "./../Matriculas/VerAlumnosDelCurso";

import {
  api_CantAlumnosCurso,
  api_NroMatriculas,
} from "./../docentes/api-docentes";

import {
  CustomPaper,
  CustomGridTitulo,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

const abortController = new AbortController();
const signal = abortController.signal;

const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

const SumarArray = (array) => {
  const totalSumado = array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.nroAlumnos;
  }, 0);

  return totalSumado;
};

const fNumero = (numero) => {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function AlumnosCursos() {
  const [dataMatricula, setDataMatricula] = useState({
    ki: 0,
    pk: 0,
    ba: 0,
    me: 0,
  });
  const [dataCursos, setDataCursos] = useState({
    arPk: [],
    TotalPk: 0,
    arKi: [],
    TotalKi: 0,
    arBa: [],
    TotalBa: 0,
    arMe: [],
    TotalMe: 0,
  });
  const [anchoGrid, setAnchoGrid] = useState({ pk: 6, ki: 6, ba: 1.5, me: 3 });

  const [idCurso, setIdCurso] = useState({
    ense: "",
    grado: "",
    letra: "",
    curso: "",
  });
  const [totalAlumnos, setTotalAlumnos] = useState(0);

  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    if (jwt === undefined) return;

    api_CantAlumnosCurso({ t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log("**ERROR** Obtener nro.alumnos x curso:", data.error);
      } else {
        const ArrayData = Object.values(data[0]);

        const arPk = ArrayData.filter(
          (prebasica) => prebasica.cod_ense === 10 && prebasica.cod_grado === 4
        );
        const arKi = ArrayData.filter(
          (prebasica) => prebasica.cod_ense === 10 && prebasica.cod_grado === 5
        );
        const arBa = ArrayData.filter((basica) => basica.cod_ense === 110);
        const arMe = ArrayData.filter((media) => media.cod_ense === 310);
        const TotalPk = SumarArray(arPk);
        const TotalKi = SumarArray(arKi);
        const TotalBa = SumarArray(arBa);
        const TotalMe = SumarArray(arMe);

        setTotalAlumnos(fNumero(arPk[0].tMatricula));
        setDataCursos({
          ...dataCursos,
          arPk,
          TotalPk,
          arKi,
          TotalKi,
          arBa,
          TotalBa,
          arMe,
          TotalMe,
        });
      }
    });
    api_NroMatriculas({ t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log("**ERROR** Obtener nro matriculas x curso:", data.error);
      } else {
        const arrayMatr = Object.values(data[0]);
        let pk = 0;
        let ki = 0;
        let ba = 0;
        let me = 0;
        for (const item of arrayMatr) {
          if (item.nivel === "PK") pk = item.nroMatricula;
          if (item.nivel === "KI") ki = item.nroMatricula;
          if (item.nivel === "BA") ba = item.nroMatricula;
          if (item.nivel === "ME") me = item.nroMatricula;
        }
        setDataMatricula({ ...dataMatricula, pk, ki, ba, me });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // nro_matricula,rut,dv, nombres,apat,amat,fincorpora,nroal, activo

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingTop: "99px" }}>
        {idCurso.ense !== "" && (
          <VerAlumnosDelCurso idCurso={idCurso} setIdCurso={setIdCurso} />
        )}

        {idCurso.ense === "" && (
          <>
            <CustomGridTitulo
              titulo={"Educación pre Básica"}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <CustomPaper
                anchogrid={anchoGrid.pk}
                anchocol={6}
                arreglo={dataCursos.arPk}
                titulo="Pre Kinder"
                total={dataCursos.TotalPk}
                nroMatr={dataMatricula.pk}
                setIdCurso={setIdCurso}
                idCurso={idCurso}
              />
              <CustomPaper
                anchogrid={anchoGrid.ki}
                anchocol={6}
                arreglo={dataCursos.arKi}
                titulo="Kinder"
                total={dataCursos.TotalKi}
                nroMatr={dataMatricula.ki}
                setIdCurso={setIdCurso}
                idCurso={idCurso}
              />
            </Grid>
            <CustomGridTitulo
              titulo={"Educación Básica"}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
              titTotales={dataCursos.TotalBa}
              nroMatr={dataMatricula.ba}
            />
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <CustomPaper
                anchogrid={anchoGrid.ba}
                anchocol={12}
                arreglo={dataCursos.arBa}
                titulo="Básica"
                setIdCurso={setIdCurso}
                idCurso={idCurso}
              />
            </Grid>

            <CustomGridTitulo
              titulo={"Educación Media"}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
              titTotales={dataCursos.TotalMe}
              nroMatr={dataMatricula.me}
            />
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <CustomPaper
                anchogrid={anchoGrid.me}
                anchocol={12}
                arreglo={dataCursos.arMe}
                titulo="Media"
                setIdCurso={setIdCurso}
                idCurso={idCurso}
              />
            </Grid>
            <CustomGridTitulo
              titulo={`Total de alumnos del Colegio: ${totalAlumnos} `}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
              variant="h6"
            />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

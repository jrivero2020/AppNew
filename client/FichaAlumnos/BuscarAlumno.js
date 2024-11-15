import React, { useContext, useEffect, useState } from "react";
import { Grid, createTheme, ThemeProvider } from "@mui/material";

import { AuthContext } from "../core/AuthProvider";
import {
  CustomGridTitulo,
  PaperBuscaAlumno,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

import {
  fNuevoAlumno,
  BuscaRut,
  BuscaNombre,
  GetApiData,
} from "./../assets/GrillaExamples/GridBuscarFichaAlumnos";

import ConfirmationModal from "./../assets/dialogs/ConfirmationModal";
import { ListaNombresGrilla } from "./../assets/componentes/DataGrid/Lst-selNombres";
import { MsgMuestraError } from "./../assets/dialogs/MuestraError";
import { CargaDataFichaAlumno } from "./CargaDataRutAlumno";
import { FFichaAlumno } from "./../Matriculas/Formularios/FFichaAlumno";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

export default function BuscarAlumno() {
  const [snackbar, setSnackbar] = useState(null);
  // const handleCloseSnackbar = () => setSnackbar(null);
  const [resultado, setResultado] = useState({
    fRut: "",
    dv:"",
    result: 0,
    al_amat: "",
    al_apat: "",
    al_nombres: "",
  });

  const [alumnosGetApi, SetAlumnosGetApi] = useState([]);
  const gridBusca = [0, 3, 4]; // 0=init, 3=error,4=abort
  const alNuevo = 1;
  const rutOk = 2;
  const alAntiguo = 5;
  const buscarNombre = 6;
  const NombreNotFound = 7;
  const openGridAlumno = 8;
  const RutNotFound = 9;
  const DataFichaCargada = 10;

  const MsgRut = 0;
  const MsgNombre = 1;
  const MsgRutNotFound = 2;

  const rutMalo = 3;

  const { setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);

  const MsgError = (ptrMsg) => {
    const arrMensaje = [
      "Rut ingresado no es válido",
      "Alumno no existe en B.Datos",
      "Alumno no existe en B.Datos",
    ];

    setSnackbar({
      mensaje: arrMensaje[ptrMsg], // "Rut ingresado no es válido",
      severity: "error",
      variant: "filled",
    });
    setResultado({ ...resultado, fRut: "", dv:"", result: 0 });
  };

  const AlertaRut = ({ resultado, setResultado }) => {
    const title = "Rut no está en Base de Datos!!";
    const message = "Desea ingresarlo como alumno nuevo ?";
    const open = true;

    const onConfirm = () => {
      setResultado({ ...resultado, result: 1 });
    };
    const onCancel = () => {
      setResultado({ ...resultado, result: 0 });
    };

    return (
      <ConfirmationModal
        open={open}
        title={title}
        message={message}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  };

  return (
    <>
      {gridBusca.includes(resultado.result) && (
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
              {/*   
              <PaperBuscaAlumno
                anchocol={3}
                titulo="Nuevo Alumno"
                BuscarX={fNuevoAlumno}
                resultado={resultado}
                setResultado={setResultado}
              />
              */}
              <PaperBuscaAlumno
                anchocol={3}
                titulo="Rut"
                BuscarX={BuscaRut}
                resultado={resultado}
                setResultado={setResultado}
              />
              <PaperBuscaAlumno
                anchocol={6}
                titulo="Nombre"
                BuscarX={BuscaNombre}
                resultado={resultado}
                setResultado={setResultado}
              />
            </Grid>
          </div>
        </ThemeProvider>
      )}

      {resultado.result === buscarNombre &&
        GetApiData({
          resultado,
          setResultado,
          alumnosGetApi,
          SetAlumnosGetApi,
        })}
      {resultado.result === rutOk &&
        CargaDataFichaAlumno({ resultado, setResultado, jwt, setDataBuscaAl })}
      {resultado.result === NombreNotFound && MsgError(MsgNombre)}
      {resultado.result === rutMalo && MsgError(MsgRut)}

      {resultado.result === RutNotFound &&
        AlertaRut({ resultado, setResultado })}

      {resultado.result === openGridAlumno &&
        ListaNombresGrilla({ alumnosGetApi, resultado, setResultado })}
      {resultado.result === DataFichaCargada && (
        <FFichaAlumno resultado={resultado} setResultado={setResultado} />
      )}
      {resultado.result === alNuevo && (
        <FFichaAlumno resultado={resultado} setResultado={setResultado} />
      )}

      {snackbar && MsgMuestraError({ snackbar, setSnackbar })}
    </>
  );
}
//       {resultado.result === RutNotFound && MsgError(MsgRutNotFound)}

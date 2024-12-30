import React, { useContext, useState, useEffect } from "react";
import { Grid, createTheme, ThemeProvider } from "@mui/material";

import { AuthContext } from "../core/AuthProvider";
import {
  CustomGridTitulo,
  PaperBuscaAlumno,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

import {
  BuscaRut,
  BuscaNombre,
  GetApiData,
} from "./../assets/GrillaExamples/GridBuscarFichaAlumnos";

import ConfirmationModal from "./../assets/dialogs/ConfirmationModal";
import { ListaNombresGrilla } from "./../assets/componentes/DataGrid/Lst-selNombres";
import { MsgMuestraError } from "./../assets/dialogs/MuestraError";
import { CargaDataFichaAlumno } from "./CargaDataRutAlumno";
import { FFichaAlumno } from "./../Matriculas/Formularios/FFichaAlumno";
import { cFichaAlumno, dataResultado } from "./../Matriculas/matriculasCampos";
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
  const [resultado, setResultado] = useState(dataResultado);

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
  const ErrorServidor = 11;
  const MantenerTabs = 12;
  const DatosGrabados = 13;
  const NovalidoFormulario = 14;

  const MsgRut = 0;
  const MsgNombre = 1;
  const MsgRutNotFound = 2;
  const MsgServerError = 3;

  const rutMalo = 3;

  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);

  const MsgError = (ptrMsg) => {
    const arrMensaje = [
      "Rut ingresado no es válido",
      "Alumno no existe en B.Datos",
      "Alumno no existe en B.Datos",
      "Error interno del servidor",
    ];
    const retorno = ptrMsg === 3 ? DataFichaCargada : 0;
    setSnackbar({
      mensaje: arrMensaje[ptrMsg], // "Rut ingresado no es válido",
      severity: "error",
      variant: "filled",
    });
    if (retorno === 0) {
      setResultado((prev) => ({ ...prev, fRut: "", dv: "", result: retorno }));
    } else {
      setResultado((prev) => ({ ...prev, result: retorno }));
    }
  };

  const AlertaRut = ({ resultado, setResultado }) => {
    const title = `Rut (${resultado.fRut}) no está en Base de Datos!!`;
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
  useEffect(() => {
    if (gridBusca.includes(resultado.result)) setDataBuscaAl(cFichaAlumno);
  }, [resultado.result, gridBusca, setDataBuscaAl]);

  return (
    <>
      {gridBusca.includes(resultado.result) && (
        <ThemeProvider theme={theme}>
          <div style={{ paddingTop: "99px" }}>
            <CustomGridTitulo
              titulo={"BUSCAR ALUMNO POR..."}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <PaperBuscaAlumno
                anchocol={6}
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
        CargaDataFichaAlumno({
          resultado,
          setResultado,
          jwt,
          dataBuscaAl,
          setDataBuscaAl,
        })}
      {resultado.result === NombreNotFound && MsgError(MsgNombre)}
      {resultado.result === ErrorServidor && MsgError(MsgServerError)}

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

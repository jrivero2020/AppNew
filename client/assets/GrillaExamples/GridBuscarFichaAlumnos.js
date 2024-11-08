import React, { useState, useContext, useEffect } from "react";
import { Grid, Button, Stack, TextField } from "@mui/material";
import { AuthContext } from "./../../core/AuthProvider";

import BotonConHover from "./../Botones/BtnDataAlumnos";
import { manejoCambiofRut, validarRut, QuitaPuntos } from "./../js/FmtoRut";
import {
  api_getAlumnosNombres,
  getDatosMatricula,
} from "./../../docentes/api-docentes";
import { cFichaAlumno } from "./../../Matriculas/matriculasCampos";

export const FBuscaRut = (resultado, setResultado) => {
  const frut = resultado.fRut;
  if (frut === undefined || frut === "") {
    return false;
  }
  if (validarRut(frut)) {
    let rutBuscar = QuitaPuntos(frut.slice(0, -1));
    setResultado({ ...resultado, fRut: rutBuscar, result: 2 });
    //   Cargar las variables de data alumno con sp getDatosMatricula
    return true;
    //
    // setDataBuscaAl({ ...dataBuscaAl, abort: false, nuevo: false, buscando: false });
  }
  setResultado({ ...resultado, result: 3 });
  return false;
};

/*
const abortController = new AbortController();
  const signal = abortController.signal;
    getDatosMatricula(rutBuscar, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const [results] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          setResultado({...resultado, result:3});
          alert(
            "**ATENCION** Rut no encontrado en las Matrículas del establecimiento"
          );
        } else {
          const [results] = data;
          // setDataBuscaAl(results[0]);
          console.log("results[0]:==>", results[0]);
          setResultado({...resultado, result:5});
        }
        // setSelectedCurso(results[0].c_nomcorto);
        // setvViveCon(results[0].al_idvivecon);
        // setvCurRepe(results[0].al_cur_repe === "No" ? "No" : "Sí");
        // setvEnfermedad(results[0].al_enfermo === "0" ? "No" : "Sí");
      }
    });
  
*/

const handleChange = (name, resultado, setResultado) => (event) => {
  console.log("handleChange");
  console.log("name: ", name, "dataBuscaAl: ", resultado);
  setResultado({ ...resultado, [name]: event.target.value });
};

const fBuscaNombres = (resultado, setResultado, jwt) => {
  const { al_nombres, al_apat, al_amat } = resultado;
  const resultadoLocal = { al_nombres, al_apat, al_amat };
  const todosVacios = Object.values(resultadoLocal).every(
    (valor) => valor === ""
  );

  console.log("todosVacios :", todosVacios);
  if (todosVacios) {
    setResultado({ ...resultado, result: 0 });
    return false;
  }
  setResultado({ ...resultado, result: 6 });
  return;
};

export const GetApiData = ({ resultado, setResultado, alumnosGetApi, SetAlumnosGetApi }) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  
  api_getAlumnosNombres(resultado, signal).then((data) => {
    if (data && data.error) {
      return false;
    } else {
      // eslint-disable-next-line no-unused-vars
      const [results, metadata] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        setResultado({ ...resultado, result: 7 });
      } else {
        console.log("Datos de b.dato: ", results);
        setResultado({ ...resultado, result: 8 });

        SetAlumnosGetApi(results)
      }
    }
  });
  return;
};

const fIngresoNuevoAlumno = (
  fRut = 0,
  setfRut = "",
  modo = "",
  dataBuscaAl,
  setDataBuscaAl,
  jwt
) => {
  setDataBuscaAl({
    ...dataBuscaAl,
    abort: false,
    nuevo: true,
    buscando: false,
  });
  return;
};

const BotonBuscar = ({
  label = "Sin label",
  FBusca,
  resultado,
  setResultado,
  modo = "",
}) => {
  // const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  // const { jwt } = useContext(AuthContext);

  if (modo === "" || modo === undefined) return "";
  return (
    <Stack alignItems="center">
      <BotonConHover
        render={({ handleMouseEnter, handleMouseLeave, buttonStyle }) => (
          <Button
            size="medium"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variant="contained"
            sx={{ fontSize: "11px", mt: "10px" }}
            onClick={() => FBusca(resultado, setResultado)}
          >
            {label}
          </Button>
        )}
      />
    </Stack>
  );
};

export const fNuevoAlumno = () => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        margin: "auto",
        maxWidth: "95%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={6}>
        <TextField
          disabled
          style={{ fontSize: "13px" }}
          size="small"
          label="NUEVO AL."
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          margin: "auto",
          maxWidth: "95%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <BotonBuscar
            label="Ingresar"
            FBusca={fIngresoNuevoAlumno}
            modo="ingreso"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const BuscaRut = ({ resultado, setResultado }) => {
  // const [fRut, setfRut] = useState("");

  return (
    <Grid
      container
      spacing={2}
      sx={{
        margin: "auto",
        maxWidth: "95%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={6}>
        <TextField
          style={{ fontSize: "13px" }}
          size="small"
          label="Rut"
          variant="outlined"
          fullWidth
          value={resultado.fRut}
          onChange={manejoCambiofRut("fRut", resultado, setResultado)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          margin: "auto",
          maxWidth: "95%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <BotonBuscar
            label="Buscar"
            FBusca={FBuscaRut}
            resultado={resultado}
            setResultado={setResultado}
            modo="rut"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const BuscaNombre = ({ resultado, setResultado }) => {
  //   const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);

  // useEffect(() => {
  //     setDataBuscaAl({ ...dataBuscaAl, abort: true, nuevo: true });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // console.log("BuscaNombre: debería llamar a fbuscanombre ", dataBuscaAl);
  return (
    <Grid
      container
      spacing={2}
      sx={{
        margin: "auto",
        maxWidth: "95%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={6} md={3}>
        <TextField
          style={{ fontSize: "13px" }}
          size="small"
          label="Nombres"
          value={resultado.al_nombres}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_nombres", resultado, setResultado)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          size="small"
          label="Ap. Paterno"
          value={resultado.al_apat}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_apat", resultado, setResultado)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          size="small"
          label="Ap. Materno"
          value={resultado.al_amat}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_amat", resultado, setResultado)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6}>
        <BotonBuscar
          label="Buscar"
          FBusca={fBuscaNombres}
          modo="nombres"
          resultado={resultado}
          setResultado={setResultado}
        />
      </Grid>
    </Grid>
  );
};

import React, { useState, useContext, useEffect } from "react";
import { Grid, Button, Stack, TextField } from "@mui/material";

import BotonConHover from "./../Botones/BtnDataAlumnos";
import { manejoCambiofRut, validarRut, QuitaPuntos } from "./../js/FmtoRut";
import { api_getAlumnosNombres } from "./../../docentes/api-docentes";

export const FBuscaRut = (resultado, setResultado) => {
  const frut = resultado.fRut;
  const [RutNumero, RutDv] = frut.split("-");

  if (frut === undefined || frut === "") {
    return false;
  }

  if (validarRut(frut)) {
    let rutBuscar = QuitaPuntos(frut.slice(0, -1));
    setResultado({
      ...resultado,
      fRut: frut,
      dv: RutDv,
      result: 2,
      RutBuscar: rutBuscar,
    });
    return true;
  }
  setResultado({ ...resultado, result: 3 });
  return false;
};

const handleChange = (name, resultado, setResultado) => (event) => {
  setResultado({ ...resultado, [name]: event.target.value });
};

const fBuscaNombres = (resultado, setResultado, jwt) => {
  const { al_nombres, al_apat, al_amat } = resultado;
  const resultadoLocal = { al_nombres, al_apat, al_amat };
  const todosVacios = Object.values(resultadoLocal).every(
    (valor) => valor === ""
  );
  if (todosVacios) {
    setResultado({ ...resultado, result: 0 });
    return false;
  }
  setResultado({ ...resultado, result: 6 });
  return;
};

export const GetApiData = ({
  resultado,
  setResultado,
  alumnosGetApi,
  SetAlumnosGetApi,
}) => {
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
        setResultado({ ...resultado, result: 8 });
        SetAlumnosGetApi(results);
      }
    }
  });
  return;
};

const fIngresoNuevoAlumno = (resultado, setResultado) => {
  setResultado({ ...resultado, result: 1 });
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

export const fNuevoAlumno = ({ resultado, setResultado }) => {
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
            resultado={resultado}
            setResultado={setResultado}
            modo="nuevo"
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

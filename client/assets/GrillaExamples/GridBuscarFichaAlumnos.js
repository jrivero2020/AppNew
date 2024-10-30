import React, { useState, useContext, useEffect } from "react";
import { Grid, Button, Stack, TextField } from "@mui/material";
import { AuthContext } from "./../../core/AuthProvider"


import BotonConHover from "./../Botones/BtnDataAlumnos";
import { manejoCambiofRut, validarRut, QuitaPuntos } from "./../js/FmtoRut";
import {
  api_getAlumnosNombres,
  getDatosMatricula,
} from "./../../docentes/api-docentes";
import { cFichaAlumno } from "./../../Matriculas/matriculasCampos"

export const FBuscaRut = (
  frut,
  setfRut,
  modo,
  dataBuscaAl,
  setDataBuscaAl,
  jwt
) => {
  const abortController = new AbortController();
  const signal = abortController.signal;

  if (frut === undefined || frut === "") return;
  if (validarRut(frut)) {
    let rutBuscar = QuitaPuntos(frut.slice(0, -1));
    setfRut(rutBuscar);
    //   Cargar las variables de data alumno con sp getDatosMatricula
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
          alert(
            "**ATENCION** Rut no encontrado en las Matrículas del establecimiento"
          );
        } else {
          const [results] = data;
          setDataBuscaAl(results[0]);
          console.log("results[0]:==>", results[0]);
          /*
          setValores(results[0]);

          setSelectedComuna(results[0].al_id_comuna);
          if (results[0].al_genero === "M") {
            setvSexo("Masculino");
          } else {
            setvSexo("Femenino");
          }
            */
        }
        // setSelectedCurso(results[0].c_nomcorto);
        // setvViveCon(results[0].al_idvivecon);
        // setvCurRepe(results[0].al_cur_repe === "No" ? "No" : "Sí");
        // setvEnfermedad(results[0].al_enfermo === "0" ? "No" : "Sí");
      }
    });

    setDataBuscaAl({ ...dataBuscaAl, abort: false, nuevo: false, buscando: false });
  }
  return;
};

const handleChange = (name, dataBuscaAl, setDataBuscaAl) => (event) => {
  console.log("handleChange");
  console.log("name: ", name, "dataBuscaAl: ", dataBuscaAl);
  setDataBuscaAl({ ...dataBuscaAl, [name]: event.target.value });
};

const fBuscaNombres = (
  fRut,
  setfRut,
  modo,
  dataBuscaAl,
  setDataBuscaAl,
  jwt
) => {
  // console.log("fBuscaNombres:", dataBuscaAl);
  const abortController = new AbortController();
  const signal = abortController.signal;
  const AlumnoBuscar = {
    ...dataBuscaAl,
    al_amat: dataBuscaAl.al_apat,
    al_apat: dataBuscaAl.al_amat,
    al_nombres: dataBuscaAl.al_nombres,
  };
  const todosVacios = Object.values(AlumnoBuscar).every(
    (valor) => valor === ""
  );
  if (todosVacios) return false;

  api_getAlumnosNombres(AlumnoBuscar, signal).then((data) => {
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
        alert(
          "**ATENCION** Datos no encontrados en las Matrículas del establecimiento"
        );
      } else {
        console.log("Cargar Datagrid:" )
        setDataBuscaAl({ ...dataBuscaAl, datagrid: true, buscando:false });
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
  setDataBuscaAl({ ...dataBuscaAl, abort: false, nuevo: true, buscando:false  });
  return;
};

const BotonBuscar = ({
  label = "Sin label",
  FBusca,
  fRut,
  setfRut,
  modo = "",
}) => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);

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
            onClick={() =>
              FBusca(fRut, setfRut, modo, dataBuscaAl, setDataBuscaAl, jwt)
            }
          >
            <> {label} </>
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

export const BuscaRut = () => {
  const [fRut, setfRut] = useState("");
  if (typeof FBuscaRut !== "function") {
    throw new Error("BuscaRut====> FBuscaRut no es una función");
  }

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
          value={fRut}
          onChange={manejoCambiofRut("fRut", fRut, setfRut)}
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
            fRut={fRut}
            setfRut={setfRut}
            modo="rut"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const BuscaNombre = () => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);

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
          value={dataBuscaAl.al_nombres}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_nombres", dataBuscaAl, setDataBuscaAl)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          size="small"
          label="Ap. Paterno"
          value={dataBuscaAl.al_apat}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_apat", dataBuscaAl, setDataBuscaAl)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          size="small"
          label="Ap. Materno"
          value={dataBuscaAl.al_amat}
          variant="outlined"
          fullWidth
          onChange={handleChange("al_amat", dataBuscaAl, setDataBuscaAl)}
          sx={{ backgroundColor: "#E8EAF6" }}
          inputProps={{ style: { fontSize: "13px" } }}
        />
      </Grid>
      <Grid item xs={6}>
        <BotonBuscar label="Buscar" FBusca={fBuscaNombres} modo="nombres" />
      </Grid>
    </Grid>
  );
};

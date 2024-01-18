import React, { useState } from "react";
import { TextField, Typography, Button, Grid, Paper } from "@mui/material";
import { api_getAlumnosNombres } from "./../docentes/api-docentes";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BackspaceIcon from "@mui/icons-material/Backspace";

export default function ManejaModalNombre({
  OnShowGrid,
  ModalOffBtnOff,
  AlumnosNombres,
  setAlumnosNombres,
  ModalOffBtnOn,
}) {
  const [NomBusca, setNomBusca] = useState({
    busca_amat: "",
    busca_apat: "",
    busca_nombres: "",
  });
  const manejaCambiosNomBusca = (name) => (event) => {
    setNomBusca({ ...NomBusca, [name]: event.target.value });
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13 || event.key === "Enter") {
      ManejaBuscaNombre();
    }
  };

  const ManejaBuscaNombre = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const AlumnoBuscar = {
      ...NomBusca,
      al_amat: NomBusca.busca_amat,
      al_apat: NomBusca.busca_apat,
      al_nombres: NomBusca.busca_nombres,
    };
    const todosVacios = Object.values(NomBusca).every((valor) => valor === "");
    if (todosVacios) return;

    console.log("NomBusca: ", AlumnoBuscar);
    api_getAlumnosNombres(AlumnoBuscar, signal).then((data) => {
      if (data && data.error) {
        console.log("*** Error ***", data.error);
      } else {
        const [results, metadata] = data;
        console.log("Data[0]", data[0]);
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          alert(
            "**ATENCION** Datos no encontrados en las Matrículas del establecimiento"
          );
        } else {
          console.log("ALumnos encontrados results:", results);
          setAlumnosNombres(results);
          ModalOffBtnOff();
          OnShowGrid();
          console.log(
            "************************************AlumnosNombres:",
            AlumnosNombres
          );
        }
      }
    });
  };

  console.log("ManejaModalNombre");
  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        maxWidth: "90%",
      }}
    >
      <Grid item xs={12} mt={"-25px"}>
        <Paper
          elevation={4}
          sx={{
            padding: "1rem",
            border: "1px solid black",
            backgroundColor: "lightgrey",
          }}
        >
          <Typography
            style={{ fontSize: "13px" }}
            variant="h6"
            gutterBottom
            sx={{ color: "blue", textAlign: "center" }}
          >
            Buscar por nombres y/o por apellido paterno y/o apellido materno
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12} md={3}>
              <TextField
                style={{ fontSize: "13px" }}
                size="small"
                label="Nombres"
                variant="outlined"
                fullWidth
                value={NomBusca.busca_nombres}
                onChange={manejaCambiosNomBusca("busca_nombres")}
                onKeyUp={handleKeyUp}
                sx={{ backgroundColor: "#E8EAF6" }}
                inputProps={{ style: { fontSize: "13px" } }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Ap. Paterno"
                variant="outlined"
                fullWidth
                value={NomBusca.busca_apat}
                onChange={manejaCambiosNomBusca("busca_apat")}
                onKeyUp={handleKeyUp}
                sx={{ backgroundColor: "#E8EAF6" }}
                inputProps={{ style: { fontSize: "13px" } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Ap. Materno"
                variant="outlined"
                fullWidth
                value={NomBusca.busca_amat}
                onChange={manejaCambiosNomBusca("busca_amat")}
                onKeyUp={handleKeyUp}
                sx={{ backgroundColor: "#E8EAF6" }}
                inputProps={{ style: { fontSize: "13px" } }}
              />
            </Grid>
            <Grid item xs={6} md={1.5}>
              <Button
                variant="contained"
                size="small"
                style={{ fontSize: "9px" }}
                startIcon={<PersonSearchIcon />}
                onClick={ManejaBuscaNombre}
              >
                Busca
              </Button>
            </Grid>
            <Grid item xs={6} md={1.5}>
              <Button
                variant="contained"
                size="small"
                style={{ fontSize: "9px" }}
                startIcon={<BackspaceIcon />}
                onClick={ModalOffBtnOn}
              >
                Cancela
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

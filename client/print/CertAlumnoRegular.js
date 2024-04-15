/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  TextField,
  Typography,
  CardActions,
  Button,
  Grid,
  Card,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDatosCert } from "./../docentes/api-docentes";
import Item from "../core/Item";
import { FmtoRut, validarRut, QuitaPuntos } from "../assets/js/FmtoRut";
// import ImprimeCertificado from "./ImprimeCertificado";
import PrintHojaImpresa from "./PrintHojaImpresa";


export default function CertAlumnoRegular() {

  // amat: "CONTRERAS"apat: "RAMOS"desc_grado: "4° básico"dv: "7"genero: "M"letra: "A"nombres: "MARIO EDUARDO"nro_matricula: 364rut: 24473677
  const [valores, setValores] = useState({
    amat: "",
    apat: "",
    desc_grado: "",
    dv: "",
    genero: "",
    letra: "",
    nombres: "",
    nro_matricula: "",
    rut: "",
    cod_ense: "",
    open: false,
    error: "",
    parapresentar: "",
  });

  const [fRut, setfRut] = useState("");

  const manejoCambiofRut = (name) => (event) => {
    let tvalue = FmtoRut(event.target.value);
    if (fRut.length === 1 && tvalue === null) tvalue = "";

    if (tvalue != null) {
      setfRut(tvalue);
    }
  };

  const actualizaValores = () => {
    setValores({
      ...valores,
      rut: QuitaPuntos(fRut.slice(0, -1)),
      dv: fRut.slice(-1),
    });
  };

  const cierreDialog = () => {
    setValores({ ...valores, open: false });
  };

  const clickSubmit = (event) => {
    event.preventDefault();

    if (!validarRut(fRut)) {
      alert("Rut ingresado erróneo");
      return;
    }
    actualizaValores();

    const user = {
      rut: QuitaPuntos(fRut.slice(0, -1)) || "",
    };

    if (
      user.rut === ""
    ) {
      alert("Debe ingresar Rut");
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;
    getDatosCert(user, signal).then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const [results, metadata] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          return false;
        } else {
          setValores({ ...results[0], open: true });
        }
      }
    });
  };

  return (
    <>
      <Grid
        container
        rowSpacing={1}
        sx={{
          paddingTop: "100px",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >
        <Grid item xs={12}>
          <Item>
            <Typography variant="h5" gutterBottom sx={{ color: "blue" }}>
              Certificado Alumno Regular
            </Typography>
          </Item>
          <br />
        </Grid>

        <Grid item xs={6} sx={{ justifyContent: "center" }}>
          {!valores.open ? (
            <TextField
              id="rut"
              label="Rut del Alumno"
              value={fRut}
              onChange={manejoCambiofRut("fRrut")}
              margin="normal"
            />
          ) : null}
        </Grid>

        <Grid item xs={6} sx={{ justifyContent: "center" }}>
          {!valores.open ? (
            <CardActions>
              <Button color="primary" variant="contained" onClick={clickSubmit}>
                Buscar
              </Button>
            </CardActions>
          ) : null}
        </Grid>
        <br />
        {valores.open ? (
          <Grid item xs={12}>
            <Item>
              <Typography variant="h5" gutterBottom sx={{ color: "blue" }}>
                {FmtoRut(valores.rut + "-" + valores.dv)} &nbsp;&nbsp;{valores.nombres + " " + valores.apat + " " + valores.amat + "    " + valores.desc_grado + valores.letra}
              </Typography>
            </Item>
          </Grid>

        ) : null}
        {valores.open ? (
          <Grid item xs={12}>
            <Item>
              <Typography variant="h5" gutterBottom sx={{ color: "blue" }}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={cierreDialog}
                >
                  Buscar otro Rut
                </Button>
              </Typography>
            </Item>
          </Grid>

        ) : null}
        {valores.open ? (
          <Card style={{ maxWidth: "90%", margin: "auto" }}>
            <PrintHojaImpresa data={valores} />
          </Card>
        ) : null}
      </Grid>

      <Grid
        container
        sx={{
          paddingTop: "2x",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >

      </Grid>
    </>
  );
}

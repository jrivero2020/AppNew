import React, { useEffect } from "react";
import { TextField, Grid, Box, Typography, Paper, Card } from "@mui/material";
import { useState } from "react";
import BasicEditingGrid from "./TablaGrillaAlumno";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";

export default function GridBuscaAlumnos(props) {
  const { btnBuscaNombres, setbtnBuscaNombres } = props;
  /********************************************************************* */
  const [valores, setValores] = useState({
    al_amat: "",
    al_apat: "",
    al_nombres: "",
  });

  const [PanelBusca, setPanelBusca] = useState({
    inputT: true,
    grillaVer: false,
  });

  const [dRut, setdRut] = useState({ rut: 0, dv: "", visitado: false });

  /************************************************************************ */

  const manejaSetdRut = (objRut) => {
    setdRut(objRut);
  };

  const handleChange = (name) => (event) => {
    setValores({ ...valores, [name]: event.target.value });
  };

  const switchPanel = () => {
    setPanelBusca({ ...PanelBusca, inputT: false, grillaVer: true });
  };

  const switchCancel = () => {
    setPanelBusca({ ...PanelBusca, inputT: false, grillaVer: false });
    setbtnBuscaNombres({
      ...btnBuscaNombres,
      btnBusca: true,
      btnDialog: false,
    });
  };

  if (dRut.visitado) {
    // console.log("dRut.rut =", dRut.rut)
    // console.log("dRut.dv =", dRut.dv)
    return false;
  }

  const [VerGrilla, setVerGrilla] = useState(false);

  const VerGrillaAlumnos = () => {
    if (
      valores.al_apat !== "" ||
      valores.al_amat !== "" ||
      valores.al_nombres !== ""
    ) {
      // console.log("Tengo datos y se va a BasicEditingGrid estos son los valores", valores)
      setVerGrilla(true);
    }

    return (
      VerGrilla && (
        <div>
          <BasicEditingGrid
            datosal={valores}
            dRut={dRut}
            manejaSetdRut={manejaSetdRut}
            PanelBusca={PanelBusca}
            setPanelBusca={setPanelBusca}
          />
        </div>
      )
    );
  };

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
      <Grid item xs={12}>
        {PanelBusca.inputT && (
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
                  value={valores.al_nombres}
                  onChange={handleChange("al_nombres")}
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
                  value={valores.al_apat}
                  onChange={handleChange("al_apat")}
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
                  value={valores.al_amat}
                  onChange={handleChange("al_amat")}
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
                  onClick={switchPanel}
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
                  onClick={switchCancel}
                >
                  Cancela
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {PanelBusca.grillaVer && (
          <Card
            style={{
              maxWidth: "100%",
              margin: "auto",
            }}
          >
            <VerGrillaAlumnos />
          </Card>
        )}
      </Grid>
    </Grid>
  );
}

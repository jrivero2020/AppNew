import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CardActions, Button, Grid } from "@mui/material";
import Item from "../core/Item";
// import logo from "./../assets/images/LogoColegio_p.png";
import { FmtoRut } from "../assets/js/FmtoRut";
import { useLocation } from "react-router";
import { useReactToPrint } from "react-to-print";

// const logo = "dist/images/links/LogoColegio_p.png";

function PrintHojaImpresa(props) {
  const datoAlumno = props.data;
  const f = new Date();
  const agno = f.getFullYear();
  const TxtDiaHoy = f.getDate();
  let Codense = datoAlumno.cod_ense;
  let Ensenanza =
    Codense === 10 ? "Pre-básica" : Codense === 110 ? "Básica" : "Media";
  const TxtMesHoy = () => {
    // eslint-disable-next-line no-array-constructor
    let meses = new Array(
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    );
    return meses[f.getMonth()];
  };

  const componentRef = useRef();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "cert-data",
  });

  return (
    <>
      <div ref={componentRef}>
        <Box sx={{ paddingTop: "129px", paddingLeft: "158" }}>
          <Grid container direction="column">
            <Grid item>
              <Typography
                align="Left"
                sx={{ mx: 0.5, fontSize: 22, ml: "85px" }}
              >
                <b>Colegio Los Conquistadores Cerrillos</b>
              </Typography>
            </Grid>

            <Grid
              container
              sx={{
                paddingTop: "50",
                alignItems: "left",
                justifyContent: "left",
              }}
            >
              <Grid item xs={12} sx={{ mt: "49px", ml: "68px" }}>
                <Typography align="Left" sx={{ mx: 0.5, fontSize: 14 }}>
                  <b>
                    Resolución
                    exenta&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    7701&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    1985&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp; 9903-1{" "}
                  </b>
                  <br />
                  <br />
                  <br />
                  <br />
                  {datoAlumno.nombres} {datoAlumno.apat} {datoAlumno.amat}
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {FmtoRut(datoAlumno.rut + datoAlumno.dv)}
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {datoAlumno.nro_matricula}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {agno}
                  <br />
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {datoAlumno.desc_grado} {datoAlumno.letra}
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {Ensenanza}
                </Typography>
                <br />
                <br />
                <br />

                <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; los
                  fines que estime pertinente
                </Typography>

                <br />
                <br />
                <br />
                <br />

                <br />
                <br />

                <Typography
                  sx={{
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 12,
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cerrillos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {TxtDiaHoy}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <TxtMesHoy />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {agno}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Grid
        container
        rowSpacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >
        <Grid item xs={3}>
          <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
            <Button onClick={handlePrint}>Imprimir</Button>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
            <Button onClick={() => navigate(-1)}>Volver</Button>
          </Typography>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </>
  );
}

export default PrintHojaImpresa;

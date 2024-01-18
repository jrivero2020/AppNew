import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CardActions, Button, Grid } from "@mui/material";
import Item from "../core/Item";
// import logo from "./../assets/images/LogoColegio_p.png";
import { FmtoRut } from "../assets/js/FmtoRut";
import { useLocation } from "react-router";
import { useReactToPrint } from "react-to-print";

const logo = "dist/images/links/LogoColegio_p.png";

function PrintCertAReg(props) {
  const datoAlumno = props.data;
  const f = new Date();
  const agno = f.getFullYear();
  const cod_ense = "";
  const TxtFechaHoy = () => {
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
    return f.getDate() + " de " + meses[f.getMonth()] + " de " + agno;
  };
  const componentRef = useRef();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "cert-data",
  });
  let valumno = datoAlumno.genero == "M" ? "El alumno " : "La alumna ";
  let vmatri = datoAlumno.genero == "M" ? "matriculado " : "matriculada ";
  let vinscrito = datoAlumno.genero == "M" ? "inscrito " : "inscrita ";

  return (
    <>
      <div ref={componentRef}>
        <Box sx={{ flexGrow: 1, paddingTop: "88px", paddingLeft: "50px" }}>
          <Grid container direction="column" alignItems="flex-start">
            <Grid item>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "50px", marginLeft: "57px", marginTop: "6px" }}
              />
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Grid item>Colegio Los Conquistadores</Grid>
                <Grid item>Cerrillos</Grid>
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              sx={{
                paddingTop: "65",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                maxWidth: "65%",
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 18,
                    textDecoration: "underline",
                    textAlign: "center",
                  }}
                >
                  CERTIFICADO DE ALUMNO REGULAR
                </Typography>

                <br />
                <br />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    mx: 0.5,
                    fontSize: 12,
                    textAlign: "right",
                  }}
                >
                  <TxtFechaHoy />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
                  <b> ALEJANDRA MYRIAM ECHEVERRÍA BOCAZ</b>, Directora del
                  Colegio Los Conquistadores de Cerrillos, RBD:9903-1,
                  Reconocido por el Ministerio de Educación de Chile, según
                  Resolución exenta Nº 7701 del año 1985, certifica que:
                  <br />
                  <br />
                  {valumno} {datoAlumno.nombres} {datoAlumno.apat}{" "}
                  {datoAlumno.amat}, cédula de identidad Nº
                  {FmtoRut(datoAlumno.rut + datoAlumno.dv)}, {vinscrito} con el
                  Nº {datoAlumno.nro_matricula} del Registro, año {agno}, se
                  encuentra {vmatri} y asistiendo regularmente a nuestro
                  establecimiento, cursando actualmente: {datoAlumno.desc_grado}{" "}
                  {datoAlumno.letra}
                </Typography>
                <br />
                <br />

                <br />
                <br />
                <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
                  Se extiende el presente certificado a petición del apoderado
                  para los fines que estime pertinente
                </Typography>
              </Grid>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />

              <Grid item xs={12}>
                <Typography align="center" sx={{ mx: 0.5, fontSize: 11 }}>
                  <b>ALEJANDRA MYRIAM ECHEVERRÍA BOCAZ</b>
                </Typography>
                <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
                  Directora
                </Typography>
                <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
                  Colegio Los Conquistadores
                </Typography>
                <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
                  Cerrillos
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
          paddingTop: "65",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >
        <Grid item xs={3}></Grid>
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

export default PrintCertAReg;

//             <Grid item xs={4} sx={{ mt: '1', position: 'relative', left: 30, display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
//                         {FmtoRut(datoAlumno.rut + datoAlumno.dv)}, se encuentra {vmatri} y asistiendo regularmente a nuestro establecimiento,

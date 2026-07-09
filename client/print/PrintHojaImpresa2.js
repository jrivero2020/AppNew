import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import { FmtoRut } from "../assets/js/FmtoRut";
import { useReactToPrint } from "react-to-print";

function PrintHojaImpresa(props) {
  const datoAlumno = props.data;
  const f = new Date();
  const agno = f.getFullYear();
  const TxtDiaHoy = f.getDate();
  const mediano = agno.toString().substring(2);
  const Codense = datoAlumno.cod_ense;
  const Ensenanza =
    Codense === 10 ? "Pre-básica" : Codense === 110 ? "Básica" : "Media";

  const TxtMesHoy = () => {
    const meses = [
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
      "Diciembre",
    ];
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
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
          py: 2,
        }}
      >
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={handlePrint}
            fullWidth
            sx={{ fontSize: 14 }}
          >
            Imprimir
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            fullWidth
            sx={{ fontSize: 14 }}
          >
            Volver
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ display: "none" }}>
        <Box
          ref={componentRef}
          sx={{
            width: "215.9mm", // Ancho carta
            height: "279.4mm", // Alto carta
            position: "relative",
            fontFamily: '"Helvetica", "Arial", sans-serif',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "left",
              position: "absolute",
              top: "49mm", // antes 34mm
              left: "83mm", // 25mm + 48mm
            }}
          >
            Colegio Los Conquistadores Cerrillos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: 14,
              position: "absolute",
              top: "71mm", // antes 55mm
              left: "76mm", // 23mm + 48mm
            }}
          >
            Resolución exenta
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: 14,
              position: "absolute",
               top: "71mm", // antes 55mm
              left: "115mm", // 62mm + 48mm
            }}
          >
            7701
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: 14,
              position: "absolute",
               top: "71mm", // antes 55mm
              left: "138mm", // 85mm + 48mm
            }}
          >
            1985
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: 14,
              position: "absolute",
               top: "71mm", // antes 55mm
              left: "187mm", // 132mm + 48mm
            }}
          >
            9903-1
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 18,
              position: "absolute",
              top: "93mm", //antes 76
              left: "76mm", // 23mm + 48mm
            }}
          >
            {datoAlumno.nombres} {datoAlumno.apat} {datoAlumno.amat}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 18,
              position: "absolute",
              top: "105mm",// antes 88
              left: "89mm", // 33mm + 48mm
            }}
          >
            {FmtoRut(datoAlumno.rut + datoAlumno.dv)}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              position: "absolute",
              top: "118mm", // antes 100
              left: "106mm", // 48mm + 48mm
            }}
          >
            {datoAlumno.idmatricula}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              position: "absolute",
              top: "118mm", // antes 100
              left: "166mm", // 113mm + 48mm
            }}
          >
            {agno}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              position: "absolute",
              top: "141mm", //"119mm"
              left: "100mm", // 47mm + 48mm
            }}
          >
            {datoAlumno.desc_grado} {datoAlumno.letra}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              position: "absolute",
              top: "153mm", //"131mm",
              left: "98mm", // 45mm + 48mm
            }}
          >
            {Ensenanza}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              position: "absolute",
              top: "175mm",//"154mm",
              left: "86mm", // 33mm + 48mm
            }}
          >
            los fines que estime pertinente
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              fontSize: 12,
              position: "absolute",
              top: "213mm",//"198mm",
              left: "77mm", // 24mm + 48mm
            }}
          >
            Cerrillos
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              fontSize: 12,
              position: "absolute",
              top: "213mm",
              left: "133mm", // 78mm + 48mm
            }}
          >
            {TxtDiaHoy}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              fontSize: 12,
              position: "absolute",
              top: "213mm",
              left: "148mm", // 92mm + 48mm
            }}
          >
            {TxtMesHoy()}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              fontSize: 12,
              position: "absolute",
              top: "213mm",
              left: "190mm", // 130mm + 48mm
            }}
          >
            {mediano}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default PrintHojaImpresa;
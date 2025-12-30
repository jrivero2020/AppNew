import React from "react";
import { Box, Grid, Typography } from "@mui/material";

function CertificadoTemplate({ children }) {
  const f = new Date();
  const agno = f.getFullYear();
  
  const TxtFechaHoy = () => {
    let meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return f.getDate() + " de " + meses[f.getMonth()] + " de " + agno;
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      paddingTop: "88px", 
      paddingLeft: "50px",
      position: "relative"
    }}>
      <Grid container direction="column" alignItems="flex-start">
        {/* Logo */}
        <Grid item>
          <img
            src="dist/images/links/LogoColegio_p.png"
            alt="Logo"
            style={{ 
              height: "50px", 
              marginLeft: "57px", 
              marginTop: "6px" 
            }}
          />
        </Grid>
        
        {/* Encabezado */}
        <Grid item>
          <Grid container direction="column" alignItems="center" sx={{ width: "100%" }}>
            <Grid item sx={{ fontSize: "14px", fontWeight: "bold" }}>
              Colegio Los Conquistadores
            </Grid>
            <Grid item sx={{ fontSize: "14px" }}>
              Cerrillos
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Contenido principal con Grid como tu original */}
      <Grid
        container
        rowSpacing={1}
        sx={{
          paddingTop: "65px",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >
        {/* Título */}
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

        {/* Fecha */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: "bold",
              mx: 0.5,
              fontSize: 12,
              textAlign: "right",
            }}
          >
            {TxtFechaHoy()}
          </Typography>
        </Grid>

        {/* Texto estático inicial */}
        <Grid item xs={12}>
          <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
            <b> ALEJANDRA MYRIAM ECHEVERRÍA BOCAZ</b>, Directora del
            Colegio Los Conquistadores de Cerrillos, RBD:9903-1,
            Reconocido por el Ministerio de Educación de Chile, según
            Resolución exenta Nº 7701 del año 1985, certifica que:
          </Typography>
          <br />
          <br />
        </Grid>

        {/* ESPACIO PARA DATOS DINÁMICOS - JUSTO DESPUÉS DEL TEXTO INICIAL */}
        <Grid item xs={12} sx={{ minHeight: "50px" }}>
          {children}
        </Grid>

        {/* Texto final estático */}
        <Grid item xs={12}>
          <br />
          <br />
          <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
            Se extiende el presente certificado a petición del apoderado
            para los fines que estime pertinente.
          </Typography>
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
     
        
        </Grid>

        {/* Firma */}
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
    </Box>
  );
}

export default CertificadoTemplate;
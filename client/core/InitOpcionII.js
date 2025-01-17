import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LazyLoadImage } from "react-lazy-load-image-component";

//import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import { Copyright } from "../assets/js/CopyRight";
import { AuthContext } from "./AuthProvider";
// import activeImgLinks from "./../assets/data/json/CardOpcionesPaginaPrincipal.json"
import { chkActivoRolAutentica } from "./../assets/js/funciones";
//import { api_GetJsonInitOpcion } from "./../docentes/api-docentes";
import { Box, CardHeader, Divider } from "@mui/material";
// import { borderRadius } from "@mui/system";

import Footer from "../core/PieDePagina";
import Noticias from "./Noticias";

// import * as FooterModule from "../core/PieDePagina";
// console.log(FooterModule);

const useStyles = makeStyles({
  imgBtn: {
    width: "100%",
    height: "100%",
    borderRadius: "13%",
    transform: "scale(1)",
    transition: "transform 0.2s",
    objectFit: "scaleDown",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
});

export default function BasicGrid() {
  const { isAuthenticated, isJwtRol, activeImgLinks } = useContext(AuthContext);
  const jwtRol = isJwtRol ? isJwtRol._rol : 0;

  const [showOpc, setShowOpc] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();
  const pathImg = "dist/images/links/";
  const backgroundFondo = "dist/images/fotos/portada/Principal_gui.jpg";

  const abrirPaginaExterna = (url) => {
    window.open("https://" + url, "_blank");
  };

  return (
    <div>
      <div
        className="App"
        style={{
          paddingTop: "80px",
          backgroundColor: "#E1E1E1",
          backgroundSize: "cover",
        }}
        sx={{ justify: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: "100%",
            height: "48%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={backgroundFondo}
            alt="Img.Fondo"
            style={{ objectFit: "fill" }}
          />
        </Box>
      </div>
      <Noticias />

      <Card sx={{ backgroundColor: "#E1E1E1" }}>
        <CardHeader
          title="Contenido"
          sx={{ backgroundColor: "blue", color: "white", maxHeight: 12 }}
        />
        <CardContent></CardContent>
      </Card>

      <Container maxWidth="false" sx={{ backgroundColor: "#E1E1E1" }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {showOpc &&
            activeImgLinks.map(
              (ImagenLnk) =>
                chkActivoRolAutentica(
                  ImagenLnk.datos,
                  isAuthenticated,
                  jwtRol
                ) && (
                  <Grid
                    item
                    xs={6}
                    sm={5}
                    md={4}
                    lg={4}
                    xl={3}
                    key={ImagenLnk.datos.id}
                  >
                    <Card
                      elevation={8}
                      sx={{ maxWidth: 325, maxHeight: 450 }}
                      onClick={() => {
                        if (!ImagenLnk.datos.llamada) {
                          return;
                        }
                        if (ImagenLnk.datos.llamada.param) {
                          navigate(ImagenLnk.datos.llamada.componente, {
                            state: {
                              param: ImagenLnk.datos.llamada.param,
                              archivo: ImagenLnk.datos.llamada.param.archivo,
                              titulo: ImagenLnk.datos.titulo,
                            },
                          });
                        }
                        if (ImagenLnk.datos.llamada.link) {
                          abrirPaginaExterna(ImagenLnk.datos.llamada.link.url);
                        }
                      }}
                    >
                      <CardActionArea>
                        <CardMedia sx={{ mt: 1 }}>
                          <LazyLoadImage
                            alt={ImagenLnk.datos.titulo}
                            src={pathImg + ImagenLnk.datos.foto}
                            effect="blur"
                            style={{
                              height: "115",
                              display: "block",
                              margin: "0 auto",
                              width: "80%",
                            }}
                            className={classes.imgBtn}
                          />
                        </CardMedia>
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {ImagenLnk.datos.titulo}
                          </Typography>
                          {ImagenLnk.datos.texto && (
                            <Typography variant="body2" color="text.secondary">
                              {ImagenLnk.datos.texto}
                            </Typography>
                          )}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
            )}

          <Grid item sm={12}>
            <Footer sx={{ mt: 5 }} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

/*

      <Card sx={{ backgroundColor: "#E1E1E1" }}>
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            textAlign: "center",
            padding: 2, // Espaciado interno
            fontSize: "2.25rem", // Tamaño del texto similar a un título
            fontWeight: "bold", // Negrita para parecerse al título del CardHeader
          }}
        >
          Noticias
        </Box>
        <CardContent>
          <Typography variant="h6" align="left">
            Estimada Comunidad Educativa: Junto con saludar, se informa que el
            Colegio comenzará a atender público desde el próximo 25 de Febrero,
            desde las 9:00 hrs. y hasta las 16:00.
          </Typography>
          <Typography variant="h6" align="left">
            Les deseamos unas muy felices y reponedoras vacaciones.
          </Typography>
          <Typography variant="h6" align="left">
            Les saluda muy afectuosamente, Equipo Directivo.
          </Typography>
        </CardContent>

        <Divider sx={{ backgroundColor: "blue" }} />
      </Card>

*/

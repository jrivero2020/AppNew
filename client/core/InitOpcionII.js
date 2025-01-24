import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "./AuthProvider";
import { chkActivoRolAutentica } from "./../assets/js/funciones";
import { Box, CardHeader } from "@mui/material";
import Footer from "../core/PieDePagina";
import Noticias from "./Noticias";

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

  const [imgActivaLinks, setImgActivaLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();
  const pathImg = "dist/images/links/";
  const backgroundFondo = "dist/images/fotos/portada/Principal_gui.jpg";

  const isSmallScreen = useMediaQuery("(max-width:500px)");
  // const isLargeScreen = useMediaQuery("(min-width: 2040px)");

  const abrirPaginaExterna = (url) => {
    window.open("https://" + url, "_blank");
  };

  useEffect(() => {
    if (activeImgLinks.length > 0) {
      // Filtrar solo los registros con "tipo" igual a "opccgi"
      const filteredPages = activeImgLinks
        .filter((item) => item.datos.tipo === "opccgi")
        .sort((a, b) => a.id - b.id); // Ordenar por id en orden ascendente

      setImgActivaLinks(filteredPages);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImgLinks]);

  if (loading) return <p></p>;

  return (
    <div>
      {!loading && (
        <>
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
                "@media (max-width: 720px)": {
                  height: "30%", // Cambiar el tamaño en pantallas móviles
                },
              }}
            >
              <img
                src={backgroundFondo}
                alt="Img.Fondo"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
          </div>
          <Noticias />

          <Card sx={{ backgroundColor: "#E1E1E1" }}>
            <CardHeader
              sx={{
                backgroundColor: "blue",
                color: "white",
                textAlign: "center",
                padding: "0.8rem",
              }}
              title={
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.3rem",
                    }, // Ajuste dinámico del tamaño del texto
                    fontWeight: "bold", // Negrita
                  }}
                >
                  Contenido
                </Typography>
              }
            />
            <CardContent></CardContent>
          </Card>

          <Container maxWidth="false" sx={{ backgroundColor: "#E1E1E1" }}>
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="center"
            >
              {imgActivaLinks.map(
                (ImagenLnk) =>
                  chkActivoRolAutentica(ImagenLnk, isAuthenticated, jwtRol) && (
                    <Grid
                      item
                      xs={6}
                      md={4}
                      lg={3}
                      xl={2.4}
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
                            abrirPaginaExterna(
                              ImagenLnk.datos.llamada.link.url
                            );
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
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              sx={{
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "1rem",
                                  md: "1.3rem",
                                }, // Ajuste dinámico del tamaño del texto
                                fontWeight: "bold", // Negrita
                              }}
                            >
                              {ImagenLnk.datos.titulo}
                            </Typography>
                            {!isSmallScreen && ImagenLnk.datos.texto && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: {
                                    xs: "0.9rem",
                                    md: "0.9rem",
                                    lg: "1.1rem",
                                  }, // Ajusta el tamaño del contenido
                                }}
                              >
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
        </>
      )}
    </div>
  );
}

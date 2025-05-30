import React, { useContext } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  // useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "./AuthProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";

const useStyles = makeStyles({
  imgBtn: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export default function Noticias() {
  const { Noticias } = useContext(AuthContext);
  // const theme = useTheme();
  // const isMediumScreen = useMediaQuery(theme.breakpoints.up("md")); // Detectar pantallas medianas en adelante

  const isSmallScreen = useMediaQuery("(max-width:720px)");
  const isShortScreen = useMediaQuery("(max-height: 720px)");
  const isMovil = isSmallScreen || isShortScreen;
  const classes = useStyles();
  const pathImg = "dist/images/links/";

  const agregarEspacios = (cantidad) => {
    return "\u00A0".repeat(cantidad); // Espacio en blanco no rompible
  };

  if (Noticias.length === 0) return <></>;

  return (
    <>
      {Noticias.length !== 0 && (
        <div>
          <Card sx={{ backgroundColor: "#E1E1E1" }}>
            <Box
              sx={{
                backgroundColor: "blue",
                color: "white",
                textAlign: "center",
                padding: 2, // Espaciado interno
                fontSize: {
                  xs: "0.8rem",
                  sm: "1.2rem",
                  md: "1.8rem",
                },
                fontWeight: "bold", // Negrita para parecerse al título del CardHeader
              }}
            >
              Noticias
            </Box>
          </Card>
          <Grid
            container
            spacing={3}
            sx={{
              margin: "auto",
              maxWidth: "98%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Noticias.map((noticia) => (
              <Grid item key={noticia.datos.nro} xs={12} md={6}>
                {noticia.datos.modo === "img" && (
                  <>
                    <Card elevation={8}>
                      <CardActionArea>
                        <CardMedia sx={{ mt: isMovil ? 0 : 1 }}>
                          <LazyLoadImage
                            src={pathImg + noticia.datos.src}
                            effect="blur"
                            style={{
                              height: "100",
                              display: "block",
                              margin: "0 auto",
                              width: "90%",
                            }}
                            className={classes.imgBtn}
                          />
                        </CardMedia>
                      </CardActionArea>
                    </Card>
                  </>
                )}

                {noticia.datos.modo === "txt" && (
                  <Paper
                    elevation={10}
                    sx={{
                      pb: "0.5rem",
                      pt: "0.5rem",
                      backgroundColor: "#efebe9",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <>
                      <Typography
                        sx={{
                          textAlign: "center", // Justificar el texto
                          fontWeight: "bold",
                          fontSize: {
                            xs: "0.8rem",
                            sm: "1rem",
                            md: "1.2rem",
                          }, // Ajusta el tamaño del título
                        }}
                      >
                        {noticia.datos.titulo}
                      </Typography>
                      <Typography> {agregarEspacios(20)}</Typography>
                      <Typography
                        sx={{
                          textAlign: "left", // Justificar el texto
                          marginLeft: {
                            xs: "1rem", // 1rem de margen izquierdo para pantallas pequeñas
                          },
                          marginRight: {
                            xs: "1rem", // 1rem de margen derecho para pantallas pequeñas
                          },
                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.8rem",
                            md: "1rem",
                            lg: "1.2rem",
                          }, // Ajusta el tamaño del título
                        }}
                      >
                        {noticia.datos.contenido}
                      </Typography>
                    </>
                  </Paper>
                )}
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
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
                fontSize: {
                  xs: "1rem",
                  sm: "1.5rem",
                  md: "2rem",
                  lg: "2.5rem",
                },
                fontWeight: "bold", // Negrita para parecerse al título del CardHeader
              }}
            >
              Noticias
            </Box>

            <CardContent style={{ whiteSpace: "pre-line" }}>
              {Noticias.map((noticia, index) => (
                <div key={index}>
                  <Typography
                    align="left"
                    sx={{
                      fontWeight: "bold",
                      fontSize: {
                        xs: "1rem",
                        sm: "1.2rem",
                        md: "1.4rem",
                        lg: "1.6rem",
                        xl: "1.8rem",
                      }, // Ajusta el tamaño del título
                    }}
                  >
                    {noticia.datos.titulo}
                  </Typography>
                  <Typography> {agregarEspacios(20)} </Typography>
                  <Typography
                    align="left"
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.4rem",
                        xl: "1.6rem",
                      }, // Ajusta el tamaño del contenido
                    }}
                  >
                    {noticia.datos.contenido}
                  </Typography>
                </div>
              ))}
            </CardContent>

            <Divider sx={{ backgroundColor: "blue" }} />
          </Card>

*/

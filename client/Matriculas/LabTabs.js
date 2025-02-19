import React from "react";
import Carousel from "react-material-ui-carousel";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  styled,
} from "@mui/material";

// import { styled } from "@mui/system";
import InitOpcion from "./../core/InitOpcion";

const pathImg = "dist/images/fotos/portada/";
const ImgFondoP = "dist/images/links/FondoPantalla.jpg";
import { imgCarousel } from "../../config/ConfigPdf";

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "scaleDown",
});

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "70vh",
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "left",
  backgroundColor: "BlanchedAlmond",
}));

function carousel() {
  return (
    <div style={{ paddingTop: "77px", background: `url(${ImgFondoP})` }}>
      <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "100%" }}>
        <Grid item xs={2}>
          <Box
            sx={{
              width: "100%",
              height: "68vh",
              overflow: "hidden",
              border: "2px solid",
            }}
          >
            <Paper elevation={16}>
              <DemoPaper variant="elevation">
                <Typography
                  style={{ fontSize: "16px" }}
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: "Center" }}
                >
                  Colegio Particular subvencionado
                  <br /> Científico-Humanista.
                  <br />
                  Dirección: San José 215, Cerrillos.
                  <br />
                  Teléfono: 225386855.
                  <br />
                  Directora: Alejandra Echeverría Bocaz.
                  <br />
                  Corporación Educacional
                  <br /> Los Conquistadores de Chile.
                  <br />
                  RBD: 9903-1.
                </Typography>
                <Box
                  sx={{
                    mt: "57px",
                    width: "100%",
                    height: "45vh",
                    overflow: "hidden",
                    border: "1px solid",
                    alignItems: "center",
                    background: "CornflowerBlue",
                  }}
                >
                  <CardContent
                    sx={{ background: "CornflowerBlue" }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 18, alignItems: "center" }}
                      color="Azure"
                      gutterBottom
                    >
                      Sitios de Interés
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 18 }}
                      color="primary"
                      gutterBottom
                    >
                      <a
                        href="https://www.mineduc.cl/servicios/informacion-sobre-educacion/"
                        target="_blank"
                      >
                        Información sobre educación
                      </a>
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 18 }}
                      color="primary"
                      gutterBottom
                    >
                      <a
                        href="https://admision.mineduc.cl/registro/"
                        target="_blank"
                      >
                        Sistema de Admisión Escolar
                      </a>
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 18 }}
                      color="primary"
                      gutterBottom
                    >
                      <a
                        href="https://www.mineduc.cl/servicios/tramites-subsecretaria-de-educacion/"
                        target="_blank"
                      >
                        Trámites Subsecretaría de Educación
                      </a>
                    </Typography>
                  </CardContent>
                </Box>
              </DemoPaper>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Carousel
            animation="slide"
            navButtonsAlwaysVisible={true}
            duration={500}
            swipe={false}
            sx={{ bgcolor: "primary.main" }}
          >
            {imgCarousel.map((elemento) => (
              <Paper key={elemento.id}>
                <Box
                  sx={{
                    width: "100%",
                    height: "68vh",
                    overflow: "hidden",
                    border: "2px solid",
                  }}
                >
                  <StyledImage alt="Imagen" src={pathImg + elemento.foto} />
                </Box>
              </Paper>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <InitOpcion />
    </div>
  );
}

export default carousel;

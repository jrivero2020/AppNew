import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  useMediaQuery,
  Stack,
  CardContent,
} from "@mui/material";
import VisorPdfFinal from "./VisorPdfFinal";
import { archivoPdf, imgLinks } from "../../config/ConfigPdf";
import { Link } from "react-router-dom";

const ListaUtiles = "dist/images/links/ListaUtiles.png";
/* **********************ESTILOS PERSONALES PARA Item y CardMedia con imagenes *** */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const StyledCarmedia = styled(CardMedia)({
  width: "100%",
  height: "100%",
  objectFit: "scaleDown",
});

const StyledCarmediaImage = styled(CardMedia)({
  width: "100%",
  height: "50%",
  objectFit: "scaleDown",
  display: "flex",
  margin: "auto",
});

const useStyles = makeStyles({
  imgBtn: {
    width: "100%",
    height: "100%",
    objectFit: "scaleDown",
  },
});

/* **********************FIN ESTILOS PERSONALES PARA Item y CardMedia con imagenes *** */
export default function BasicGrid() {
  const classes = useStyles();

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedNoticia, setSelectedNoticia] = useState(true);
  const [Docu, setDocu] = useState(null);

  const handleOptionClick = (option) => {
    if (option !== null) {
      let pdfResult = archivoPdf.find((pdf) => pdf.id == option);
      setDocu(pdfResult.archivo);
    }
    setSelectedOption(option);
    setSelectedNoticia(false);
  };

  const handleNoticiaClick = () => {
    setSelectedNoticia(true);
    setSelectedOption(false);
  };
  const Noticia1 =
    "dist/images/links/" + imgLinks.find((img) => img.id == 11).foto;
  const Noticia2 =
    "dist/images/links/" + imgLinks.find((img) => img.id == 12).foto;

  const isSmallScreen = useMediaQuery("(max-width:900px)");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{ marginLeft: "10px", marginRight: "10px" }}
          style={{ paddingTop: "100px" }}
        >
          <Item>
            <Typography variant="h3" gutterBottom sx={{ color: "blue" }}>
              Útiles escolares año 2024
            </Typography>
          </Item>
        </Grid>

        <Grid item xs={2}>
          <Item>
            <Card sx={{ maxWidth: 380, marginLeft: "20px" }}>
              <CardActionArea>
                <StyledCarmedia
                  component="img"
                  height="320"
                  image={ListaUtiles}
                  style={{
                    display: "flex",
                    margin: "auto",
                    textAlign: "justify",
                  }}
                />
              </CardActionArea>
            </Card>
          </Item>
          <Item></Item>
          <Item
            style={{ justifyContent: "center", alignItems: "center" }}
            sx={{
              backgroundColor: selectedOption === null ? "grey.400" : "white",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "40%", textAlign: "center" }}
              onClick={() => handleNoticiaClick()}
            >
              * Noticias *
            </Button>
          </Item>
          <Item
            style={{ justifyContent: "center", alignItems: "center" }}
            sx={{
              backgroundColor: selectedOption === 4 ? "grey.400" : "white",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "40%", textAlign: "center" }}
              onClick={() => handleOptionClick(4)}
            >
              Prekinder
            </Button>
          </Item>

          <Item
            sx={{
              backgroundColor: selectedOption === 5 ? "grey.400" : "white",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "40%" }}
              onClick={() => handleOptionClick(5)}
            >
              Kinder
            </Button>
          </Item>
          <Item
            sx={{
              backgroundColor: selectedOption === 6 ? "grey.400" : "white",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "40%" }}
              onClick={() => handleOptionClick(6)}
            >
              Básica
            </Button>
          </Item>
        </Grid>

        <Grid item xs={10}>
          {selectedOption && (
            <Item>
              <Card
                style={{ maxWidth: "90%", margin: "auto", height: "920px" }}
              >
                <VisorPdfFinal ArchivoUrl={Docu} />
              </Card>
            </Item>
          )}
          {selectedNoticia && (
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
                <Typography
                  style={{ fontSize: "18px" }}
                  variant="h6"
                  gutterBottom
                  sx={{ color: "blue", textAlign: "justify" }}
                >
                  <b>
                    Estimada Comunidad Educativa: Junto con saludar se adjuntan
                    las listas de útiles para la educación pre básica y
                    enseñanza básica (de 1° a 8°) del presente año, con el
                    respectivo plan lector. Adjuntamos también algunos códigos
                    de descuentos en TiendaSM y en Dimeiggs para la lista de
                    útiles. Saludos Cordiales.{" "}
                  </b>
                </Typography>
              </Grid>

              <Grid
                item
                sm={12}
                lg={6}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Grid container>
                  <Grid item>
                    <Box
                      sx={{
                        ml: "5px",
                        color: "white",
                        height: "57vh",
                        width: "62vh",
                        alignItems: "center",
                        justifyContent: "center",
                        display: { xs: "none", md: "flex" },
                      }}
                    >
                      <img
                        alt="Imagen"
                        src={Noticia1}
                        className={classes.imgBtn}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 18 }}
                        color="primary"
                        gutterBottom
                      >
                        <a href="https://www.tiendasm.cl" target="_blank">
                          Visitar el sitio web TiendaSm
                        </a>
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                sm={12}
                lg={6}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Grid container>
                  <Grid item>
                    <Box
                      sx={{
                        ml: "5px",
                        color: "white",
                        height: "57vh",
                        width: "62vh",
                        alignItems: "center",
                        justifyContent: "center",
                        display: { xs: "none", md: "flex" },
                      }}
                    >
                      <img
                        alt="Imagen"
                        src={Noticia2}
                        className={classes.imgBtn}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 18 }}
                        color="primary"
                        gutterBottom
                      >
                        <a
                          href="https://www.dimeiggs.cl/arma-tu-lista"
                          target="_blank"
                        >
                          Visitar el sitio web Dimeiggs
                        </a>
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

/*






                <Item>
                  <Card style={{ margin: "auto", height: "900px" }}>
                    <CardActionArea>
                      <StyledCarmediaImage component="img" image={Noticia1} />
                    </CardActionArea>
                  </Card>
                  <a href="https://www.tiendasm.cl" target="_blank">
                    Visitar el sitio web TiendaSm
                  </a>
                </Item>

                                <Item>
                  <Card style={{ margin: "auto", height: "900px" }}>
                    <CardActionArea>
                      <StyledCarmediaImage component="img" image={Noticia2} />
                    </CardActionArea>
                  </Card>
                  <a
                    href="https://www.dimeiggs.cl/arma-tu-lista"
                    target="_blank"
                  >
                    Visitar el sitio web Dimeiggs
                  </a>
                </Item>

*/

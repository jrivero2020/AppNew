import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Button,
} from "@mui/material";
import VisorPdfFinal from "./VisorPdfFinal";

import { archivoPdf } from "../../config/ConfigPdf";

// Viewer Pdf
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// ************************************************************************

// import ListaUtiles from "./../assets/images/ListaUtiles.png";
// import "../assets/css/dlCore_index.css";
// import "../assets/css/dlStyles_index.css";

const ListaUtiles = "dist/images/links/ListaUtiles.png";

// const WorkerMinJs = "dist/pdf.worker.min.js";
// const UtilesDoc = [
//   "dist/pdf/Lut_prekinder23.pdf",
//   "dist/pdf/lut_kinder23.pdf",
//   "dist/pdf/Lut_basica23.pdf",
// ];

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
/* **********************FIN ESTILOS PERSONALES PARA Item y CardMedia con imagenes *** */

export default function BasicGrid() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [Docu, setDocu] = useState(null);

  const handleOptionClick = (option) => {
    let pdfResult = archivoPdf.find((pdf) => pdf.id == option);
    setSelectedOption(option);
    setDocu(pdfResult.archivo);
  };

  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
                  style={{ display: "flex", margin: "auto" }}
                />
              </CardActionArea>
            </Card>
          </Item>
          <Item></Item>
          <Item
            sx={{
              backgroundColor: selectedOption === 4 ? "grey.400" : "white",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "40%" }}
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
              {" "}
              Kinder{" "}
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
              {" "}
              Básica{" "}
            </Button>
          </Item>
        </Grid>

        <Grid item xs={10}>
          <Item>
            <Card style={{ maxWidth: "90%", margin: "auto", height: "920px" }}>
              {selectedOption ? (
                <VisorPdfFinal ArchivoUrl={Docu} />
              ) : (
                <Typography style={{ paddingTop: "100px" }}>
                  Seleccione una opción para ver el contenido del documento
                </Typography>
              )}
            </Card>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

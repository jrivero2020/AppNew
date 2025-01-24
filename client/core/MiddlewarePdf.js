import React from "react";

import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import VisorPdfFinal from "./VisorPdfFinal";
// import { archivoPdf } from "../../config/ConfigPdf";
import { useNavigate, useLocation } from "react-router";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function VisorPdfMiddleware() {
  const location = useLocation();
  const navigate = useNavigate();
  // const idArch = location.state.ptr;
  //   const pdfResult = archivoPdf.find((pdf) => pdf.id === idArch);
  const pdfResult = location.state;

  if (!pdfResult.archivo) return;

  const urlPdf = "dist/Pdf/" + pdfResult.archivo;

  return (
    <Grid
      item
      md={12}
      sx={{
        paddingTop: "88px",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "auto",
        maxWidth: {
          xs: "98%", // Casi 100% para pantallas pequeñas
          sm: "96%", // Disminuye ligeramente para pantallas pequeñas-medianas
          md: "87%", // Ajuste adicional para pantallas medianas
          lg: "82%", // Pantallas grandes
          xl: "80%", // Menor anchura para pantallas extra grandes
        },
      }}
    >
      <Item>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "blue",
            fontSize: {
              xs: "1.1rem",
              md: "1.5rem",
              lg: "2.5rem",
              xl: "3rem",
            }, // Ajusta el tamaño del contenido
          }}
        >
          {pdfResult.titulo}
        </Typography>
      </Item>

      <Card>
        <CardContent
          sx={{
            height: {
              xs: "55rem", // Casi como xl
              sm: "57.5rem", // Equivalente a 920px
            },
            padding: 0, // Elimina el padding para evitar márgenes no deseados
          }}
        >
          <VisorPdfFinal ArchivoUrl={urlPdf} />
        </CardContent>
      </Card>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => {
          navigate("/");
        }}
      >
        Cerrar
      </Button>
    </Grid>
  );
}

export default VisorPdfMiddleware;

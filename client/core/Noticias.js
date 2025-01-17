import React, { useContext } from "react";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { AuthContext } from "./AuthProvider";

export default function Noticias() {
  const { Noticias } = useContext(AuthContext);
  const agregarEspacios = (cantidad) => {
    return "\u00A0".repeat(cantidad); // Espacio en blanco no rompible
  };

  return (
    <>
      {Noticias.length !== 0 ? (
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
          <CardContent style={{ whiteSpace: "pre-line" }}>
            <Typography
              variant="h5"
              align="left"
              style={{ fontWeight: "bold" }}
            >
              {Noticias.titulo}
            </Typography>
            <Typography> {agregarEspacios(20)} </Typography>
            <Typography variant="h6" align="left">
              {Noticias.contenido}
            </Typography>
          </CardContent>

          <Divider sx={{ backgroundColor: "blue" }} />
        </Card>
      ) : (
        <div></div>
      )}
    </>
  );
}

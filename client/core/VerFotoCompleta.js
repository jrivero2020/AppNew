import React from "react";

import { Card, Grid, Button, CardActionArea, CardMedia } from "@mui/material";

import { useNavigate, useLocation } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";

function VerFotoCompleta(imagen) {
  const location = useLocation();
  const navigate = useNavigate();

  const imgResult = location.state;

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
      <Card>
        <CardActionArea>
          <CardMedia sx={{ mt: 1 }}>
            <LazyLoadImage
              src={imgResult.imagen}
              effect="blur"
              style={{
                height: "115",
                display: "block",
                margin: "0 auto",
                width: "100%",
              }}
            />
          </CardMedia>
        </CardActionArea>
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

export default VerFotoCompleta;

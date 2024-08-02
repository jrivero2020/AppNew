import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { imgCarousel } from "../../config/ConfigPdf";
import InitOpcion from "./../core/InitOpcionII";
import "./../assets/css/image-gallery.css";
import { Box, Grid } from "@mui/material";

const pathImg = "dist/images/fotos/portada/";
//const pathImgThum = "dist/images/fotos/portada/thum/";
//const ImgFondoP = "dist/images/fotos/portada/formacion1.jpg";

const backgrounds = [
  pathImg + "fondo.jpg",
  pathImg + "fondo.jpg",
  pathImg + "fondo.jpg",
];

// const StyledImage = styled("img")({
//   width: "100%",
//   height: "100%",
//   objectFit: "scaleDown",
// });

function ReactImageGalery() {
  const [showOpc, setShowOpc] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(0);
  const Images = imgCarousel.map((elemento) => ({
    original: pathImg + elemento.foto,
  }));

  useEffect(() => {
    setShowOpc(true);
  }, []);

  useEffect(() => {
    // Cambiar la imagen de fondo cada 5 segundos (ajusta según tus necesidades)
    const interval = setInterval(() => {
      setCurrentBackground(
        (prevBackground) => (prevBackground + 1) % backgrounds.length
      );
    }, 20000); // 5000 ms = 5 segundos

    return () => clearInterval(interval);
  }, []);
        // backgroundImage: `url(${backgrounds[currentBackground]})`,
  return (
    <div
      className="App"
      style={{
        paddingTop: "80px",
        backgroundColor:"CadetBlue" ,
        backgroundSize: "cover",
        height: "100vh",
        // Agrega más estilos según tus necesidades
      }}
      sx={{ justify: "center", alignItems: "center" }}
    >
      <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "100%" }}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Box
            sx={{
              width: "85%",
              overflow: "hidden",
              justify: "center",
              alignItems: "center",
            }}
          >
            <ImageGallery
              items={Images}
              lazyLoad={true}
              showThumbnails={false}
            />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>

      {showOpc && <InitOpcion />}
    </div>
  );
}

export default ReactImageGalery;

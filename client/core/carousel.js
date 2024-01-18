import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import Datacol from "./DataCol";
import "./../assets/css/myStyle.css";
// import entrada from "./../assets/images/Entrada1.jpg";
// import cancha1 from "./../assets/images/Cancha1.jpg";
// import pasillo from "./../assets/images/Pasillo.jpg";
// import pasillo2 from "./../assets/images/pasillo2.jpg";
// import patioPk from "./../assets/images/Patio_PK.jpg";
// import patioChico from "./../assets/images/patiochico.jpg";
// import patioPeques from "./../assets/images/patiopeques.jpg";
// import nina        from "./../assets/images/ninaLibros.jpg";
// import Bienvenidos from "./../assets/images/Bienvenidos.png";

const pathImg = "dist/images/fotos/portada/";
const imgCarousel = [
  {
    id: 1,
    foto: "Entrada1.jpg",
    titulo: "Entrada",
  },
  {
    id: 2,
    foto: "Cancha1.jpg",
    titulo: "Cancha 1",
  },
  {
    id: 3,
    foto: "Pasillo.jpg",
    titulo: "pasillo 1",
  },
  {
    id: 4,
    foto: "pasillo2.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 5,
    foto: "Patio_PK.jpg",
    titulo: "Patio_PK",
  },
  {
    id: 6,
    foto: "patiochico.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 7,
    foto: "patiopeques.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 8,
    foto: "Bienvenidos.png",
    titulo: "Bienvenidos",
  },
];

function carousel() {
  return (
    <div style={{ paddingTop: "88px" }}>
      <Carousel
        animation="slide"
        navButtonsAlwaysVisible={true}
        duration={500}
        swipe={false}
        sx={{ bgcolor: "primary.main" }}
      >
        {imgCarousel.map((elemento) => (
          <Paper key={elemento.id}>
            <div>
              {pathImg + elemento.foto}
              <img
                alt="Imagen"
                src={pathImg + elemento.foto}
                style={{
                  display: "block",
                  margin: "auto",
                  Width: "78vm",
                  height: "50vh",
                }}
              />
            </div>
          </Paper>
        ))}
      </Carousel>
      <Datacol />
    </div>
  );
}

export default carousel;

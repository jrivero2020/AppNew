import {
  Grid,
  React,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "../assets/data/constantesMui";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import PagPendiente from "./PagPendiente";
// import Bienvenidos from "./../assets/images/bienvenidos.jpg";
// import fondoPantalla from "./../assets/images/FondoPantalla.jpg";
// import CtaPublica from "./../assets/images/cuentaPublica2023.png";
// import ListaUtiles from "./../assets/images/ListaUtiles.png";
// import manualConvivencia from "./../assets/images/ManualConvivencia.png";
// import campaña_vacuna2023 from "./../assets/images/campaña_vacuna2023.png";
// import ReunionesPA from "./../assets/images/ReunionesPA.png";
// import ResulAcadem from "./../assets/images/ResultadosAcademicos.png";
// import Jornada from "./../assets/images/Jornada.png";
// import Faldas from "./../assets/images/Faldas.png";
// import Galeria from "./../assets/images/GaleriaFotos.png";
// import CertARegular from "./../assets/images/CertificadoARegular.png";

import { Copyright } from "../assets/js/CopyRight";

const pathImg = "dist/images/links/";
const imgLinks = [
  {
    id: 0,
    foto: "bienvenidos.jpg",
    titulo: "bienvenidos",
  },
  {
    id: 1,
    foto: "FondoPantalla.jpg",
    titulo: "FondoPantalla",
  },
  {
    id: 2,
    foto: "cuentaPublica2023.png",
    titulo: "cuentaPublica2023",
  },
  {
    id: 3,
    foto: "ListaUtiles.png",
    titulo: "ListaUtiles",
  },
  {
    id: 4,
    foto: "ManualConvivencia.png",
    titulo: "ManualConvivencia",
  },
  {
    id: 5,
    foto: "CertificadoARegular.png",
    titulo: "CertificadoARegular",
  },
  {
    id: 6,
    foto: "campaña_vacuna2023.png",
    titulo: "campaña_vacuna2023",
  },
  {
    id: 7,
    foto: "ReunionesPA.png",
    titulo: "ReunionesPA",
  },
  {
    id: 9,
    foto: "Jornada.png",
    titulo: "Jornada",
  },
  {
    id: 10,
    foto: "Faldas.png",
    titulo: "Faldas",
  },
  {
    id: 11,
    foto: "GaleriaFotos.png",
    titulo: "GaleriaFotos",
  },
];

const useStyles = makeStyles({
  marginAutoContainer: {
    width: 500,
    height: 80,
    display: "flex",
    backgroundColor: "gold",
  },
  marginAutoItem: {
    margin: "auto",
  },
  alignItemsAndJustifyContent: {
    width: 900,
    height: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink",
  },
  imgBtn: {
    display: "flex",
    margin: "auto",
    transform: "scale(1)",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
});

export default function BasicGrid() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPdf, setShowPdf] = useState(false);

  const Pendiente = () => {
    setShowPdf(!showPdf);
  };

  // const cargarVisorPdf = (docu) => {
  //   navigate("/VisorPdfII", { state: { idArchivo: docu } });
  // };

  // const cargarDocenteHoras = () => {
  //   navigate(`/DocenteHoras`);
  // };
  //
  // const CertAlumnoRegularPrint = () => {
  //   navigate(`/CertAlumnoRegular`);
  // };
  //

  return (
    <div style={{ background: `url(${pathImg + "FondoPantalla.jpg"})` }}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate("/VisorPdfII", { state: 1 });
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "bienvenidos.jpg"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate("/VisorPdfII", { state: 2 });
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "cuentaPublica2023.png"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate(`/VerUtilesEscolares`);
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "ListaUtiles.png"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate("/VisorPdfII", { state: 3 });
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "ManualConvivencia.png"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate(`/CertAlumnoRegular`);
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "CertificadoARegular.png"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea onClick={() => Pendiente(3)}>
              <CardMedia
                component="img"
                image={pathImg + "campaña_vacuna2023.png"}
                className={classes.imgBtn}
              />
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea onClick={() => Pendiente(3)}>
              <CardMedia
                component="img"
                image={pathImg + "ReunionesPA.png"}
                className={classes.imgBtn}
              />
              {showPdf && "Pronto Disponible"}
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea
              onClick={() => {
                navigate(`/DocenteHoras`);
              }}
            >
              <CardMedia
                component="img"
                image={pathImg + "Jornada.png"}
                className={classes.imgBtn}
              />
              {showPdf && "Pronto Disponible"}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea onClick={() => Pendiente(3)}>
              <CardMedia
                component="img"
                image={pathImg + "Faldas.png"}
                className={classes.imgBtn}
              />
              {showPdf && "Pronto Disponible"}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Card sx={{ maxWidth: 300, marginLeft: "20px" }}>
            <CardActionArea onClick={() => Pendiente(3)}>
              <CardMedia
                component="img"
                image={pathImg + "GaleriaFotos.png"}
                className={classes.imgBtn}
              />
              {showPdf && "Pronto Disponible"}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item sm={12}>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </div>
  );
}

import React, { useContext } from "react";
import { Grid } from "../assets/data/constantesMui";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copyright } from "../assets/js/CopyRight";

import { AuthContext } from "./../core/AuthProvider";
// import auth from "./../auth/auth-helper";

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  borderRadius: "13%",
  transform: "scale(1)",
  transition: "transform 0.2s",
  objectFit: "scaleDown",
  "&:hover": { transform: "scale(1.1)" },
});

const useStyles = makeStyles({
  imgBtn: {
    width: "100%",
    height: "100%",
    borderRadius: "13%",
    transform: "scale(1)",
    transition: "transform 0.2s",
    objectFit: "scaleDown",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
});

export default function BasicGrid() {
  const { isAuthenticated, isJwtRol } = useContext(AuthContext);

  const jwtRol = isJwtRol ? isJwtRol._rol : 0;

  const classes = useStyles();
  const navigate = useNavigate();
  const [showPdf, setShowPdf] = useState(false);
  const imgLinks = [
    {
      id: 0,
      foto: "bienvenidos.jpg",
      titulo: "bienvenidos",
      llamada: { componente: "/MiddlewarePdf", param: { ptr: 1 } },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 1,
      foto: "FondoPantalla.jpg",
      titulo: "FondoPantalla",
      llamada: "",
      activo: 0,
      autorizado: 1,
    },
    {
      id: 2,
      foto: "cuentapublica.png",
      titulo: "cuentapublica",
      llamada: {
        componente: "/MiddlewarePdf",
        param: { ptr: 2 },
      },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 3,
      foto: "ListaUtiles.png",
      titulo: "ListaUtiles",
      llamada: { componente: "/VerUtilesEscolares", param: {} },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 4,
      foto: "ManualConvivencia.png",
      titulo: "ManualConvivencia",
      llamada: { componente: "/MiddlewarePdf", param: { ptr: 3 } },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 5,
      foto: "CertificadoARegular.png",
      titulo: "CertificadoARegular",
      llamada: { componente: "/CertAlumnoRegular", param: {} },
      activo: 0,
      autorizado: isAuthenticated && (jwtRol === 1 || jwtRol === 2),
    },
    {
      id: 6,
      foto: "campana_vacuna.png",
      titulo: "campana_vacuna",
      llamada: { componente: "/Pendiente", param: {} },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 7,
      foto: "reunionespa.png",
      titulo: "reunionespa",
      llamada: { componente: "/Pendiente", param: {} },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 8,
      foto: "Jornada.png",
      titulo: "Jornada",
      llamada: { componente: "/Pendiente", param: {} },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 9,
      foto: "Faldas.png",
      titulo: "Faldas",
      llamada: { componente: "/Pendiente", param: {} },
      activo: 1,
      autorizado: isAuthenticated,
    },
    {
      id: 10,
      foto: "GaleriaFotos.png",
      titulo: "GaleriaFotos",
      llamada: {
        componente: "link",
        link: {
          url: "sites.google.com/conquistadores.red-lc.com/colegiolosconquistadores/quienes-somos",
        },
      },
      activo: 1,
      autorizado: 1,
    },
    {
      id: 11,
      foto: "tiendasm.png",
      titulo: "TiendaSm",
      llamada: "",
      activo: 0,
      autorizado: 1,
    },
    {
      id: 12,
      foto: "descuentodimeiggs.png",
      titulo: "DescuentosMeiggs",
      llamada: "",
      activo: 0,
      autorizado: 1,
    },
    {
      id: 13,
      foto: "calendarioescolar.png",
      titulo: "Calendario Escolar año 2024",
      llamada: { componente: "/MiddlewarePdf", param: { ptr: 7 } },
      activo: 1,
      autorizado: 1,
    },
  ];

  const pathImg = "dist/images/links/";
  const pathImgBack = "dist/images/fotos/portada/";

  // eslint-disable-next-line no-unused-vars
  const Pendiente = () => {
    setShowPdf(!showPdf);
    navigate("/Pendiente", { state: 1 });
  };
  const abrirPaginaExterna = (url) => {
    window.open("https://" + url, "_blank");
  };

  const activeImgLinks = imgLinks.filter(
    (link) => link.activo === 1 && link.autorizado
  );

  return (
    <div
      style={{
        paddingTop: "5px",
        background: `url(${pathImgBack + "formacion1.jpg"})`,
      }}
    >
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {activeImgLinks.map((ImagenLnk) => (
          <Grid item sm={6} md={4} lg={3} xl={2} key={ImagenLnk.id}>
            <Box
              onClick={() => {
                if (ImagenLnk.llamada.param) {
                  navigate(ImagenLnk.llamada.componente, {
                    state: ImagenLnk.llamada.param,
                  });
                }
                if (ImagenLnk.llamada.link) {
                  abrirPaginaExterna(ImagenLnk.llamada.link.url);
                }
              }}
              sx={{
                ml: "20px",
                color: "white",
                height: "20vh",
                width: "25vh",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                alt="Imagen"
                src={pathImg + ImagenLnk.foto}
                loading="lazy"
                className={classes.imgBtn}
              />
            </Box>
          </Grid>
        ))}
        <Grid item sm={12}>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </div>
  );
}

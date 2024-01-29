import {
  Grid,
  React,
  Card,
  CardActionArea,
  CardMedia,
} from "../assets/data/constantesMui";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Copyright } from "../assets/js/CopyRight";
import { imgLinks } from "../../config/ConfigPdf";

const activeImgLinks = imgLinks.filter((link) => link.activo === 1);
const pathImg = "dist/images/links/";

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

// display: "flex",
// margin: "auto",

export default function BasicGrid() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPdf, setShowPdf] = useState(false);

  const Pendiente = () => {
    setShowPdf(!showPdf);
    navigate("/Pendiente", { state: 1 });
  };

  return (
    <div
      style={{
        paddingTop: "5px",
        background: `url(${pathImg + "FondoPantalla.jpg"})`,
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

/* Modelo

        <Grid item sm={6} md={4} lg={3} xl={2}>
          <Box
            onClick={() => {
              navigate("/MiddlewarePdf", { state: 1 });
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
              src={pathImg + "cuentapublica.png"}
              className={classes.imgBtn}
            />
          </Box>
        </Grid>

*/

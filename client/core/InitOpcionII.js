import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from '@mui/material/Container';
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LazyLoadImage } from 'react-lazy-load-image-component';

//import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import { Copyright } from "../assets/js/CopyRight";
import { AuthContext } from "./AuthProvider";
import activeImgLinks from "./../assets/data/json/CardOpcionesPaginaPrincipal.json"
import { chkActivoRolAutentica } from "./../assets/js/funciones"
import { borderRadius } from "@mui/system";
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
  const pathImg = "dist/images/links/";
  
  const abrirPaginaExterna = (url) => {
    window.open("https://" + url, "_blank");
  };

  return (
    <Container maxWidth="false" sx={{ backgroundColor: "#E1E1E1" }} style={{ marginTop: "-15px" }}>

      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {activeImgLinks.map((ImagenLnk) => (
          chkActivoRolAutentica(ImagenLnk, isAuthenticated, jwtRol) && (
            <Grid item xs={8} sm={6} md={4} lg={2.5} xl={2} key={ImagenLnk.id}>
              <Card elevation={8} sx={{ maxWidth: 325, maxHeight: 450 }} onClick={() => {
                if (ImagenLnk.llamada.param) {
                  navigate(ImagenLnk.llamada.componente, {
                    state: ImagenLnk.llamada.param,
                  });
                }
                if (ImagenLnk.llamada.link) {
                  abrirPaginaExterna(ImagenLnk.llamada.link.url);
                }
              }}>
                <CardActionArea>
                  <CardMedia  sx={{mt:1}}>                  
                    <LazyLoadImage
                      alt={ImagenLnk.titulo}
                      src={pathImg + ImagenLnk.foto}
                      effect="blur"
                      style={{ height: '115', display: 'block', margin: '0 auto', width: '80%'  }}
                     
                      className={classes.imgBtn}
                    />
                  </CardMedia>          
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {ImagenLnk.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species, ranging across all continents except Antarctica
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        ))}
        <Grid item sm={12}>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </Container>
  );
}

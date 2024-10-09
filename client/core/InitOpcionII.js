import React, { useContext, useEffect, useState } from "react";
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
// import activeImgLinks from "./../assets/data/json/CardOpcionesPaginaPrincipal.json"
import { chkActivoRolAutentica } from "./../assets/js/funciones"
import { api_GetJsonInitOpcion } from "./../docentes/api-docentes";
import { Box, CardHeader, Divider } from "@mui/material";
// import { borderRadius } from "@mui/system";
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
  const { isAuthenticated, isJwtRol, activeImgLinks, setactiveImgLinks } = useContext(AuthContext);
  const jwtRol = isJwtRol ? isJwtRol._rol : 0;

  const [showOpc, setShowOpc] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();
  const pathImg = "dist/images/links/";
  const backgroundFondo = "dist/images/fotos/portada/Principal_gui.jpg";

  const abrirPaginaExterna = (url) => {
    window.open("https://" + url, "_blank");
  };

  return (
    <div >
 <div
      className="App" 
      style={{
        paddingTop: "80px",
        backgroundColor:"#E1E1E1" ,
        backgroundSize: "cover",
      }}
      sx={{ justify: "center", alignItems: "center" }}
    >
        <Box sx={{
          width: '100%',
          height: '48%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}  >
       
          <img src={backgroundFondo} alt="Img.Fondo"  style={{objectFit: "fill"}}/>
        </Box>

        </div>


      <Card sx={{ backgroundColor: "#E1E1E1" }}>
        <CardHeader
          title="Noticias"
          sx={{ backgroundColor: "blue", color: "white",  maxHeight: 12 }}
        />
        <CardContent>

          <Typography variant="body1" align="justify" sx={{ backgroundColor: "#E1E1E1" }} >
            Ea deserunt mollit id consectetur sunt id tempor consequat aliquip elit. Duis laboris in adipisicing amet ea cupidatat qui adipisicing. Id officia ea mollit aliquip consequat pariatur non ad sit occaecat aute do. Sunt elit excepteur sunt enim consectetur.
            Consectetur incididunt sit cupidatat ad consectetur est non consectetur adipisicing incididunt excepteur. Minim deserunt in cupidatat et id aliqua occaecat tempor anim Lorem Lorem ad ea magna. Eiusmod mollit aliquip ea pariatur in ullamco. Labore eu consectetur culpa aliquip exercitation proident exercitation occaecat aliquip nulla elit. Id dolor Lorem reprehenderit eu. Ipsum ea enim anim nostrud ea laborum pariatur occaecat in anim labore.

            Cillum ipsum ex eu aliquip ea ad nostrud proident. Fugiat Lorem irure anim adipisicing do ipsum officia Lorem in ipsum consequat reprehenderit. Reprehenderit ullamco enim eiusmod exercitation. Cupidatat tempor tempor nostrud reprehenderit culpa elit non proident amet ad.

            Veniam sit sit laborum sunt sint ea Lorem sint consectetur sit qui proident id nulla. Sit culpa est velit commodo adipisicing est tempor minim. Id esse ipsum elit consectetur aliquip Lorem occaecat esse.

            Dolor cillum esse labore aliquip dolor irure esse voluptate deserunt. Amet pariatur dolore nisi nisi cillum. Velit fugiat esse laboris enim Lorem dolore Lorem sunt dolor in cillum.
          </Typography>

        </CardContent>
        <Divider sx={{ backgroundColor: "blue" }} />
      </Card>
      <Card sx={{ backgroundColor: "#E1E1E1" }} >
        <CardHeader
          title="Contenido"
          sx={{ backgroundColor: "blue", color: "white",maxHeight: 12 }}
        />
         <CardContent></CardContent>

      </Card>

      <Container maxWidth="false" sx={{ backgroundColor: "#E1E1E1" }} >

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {showOpc && activeImgLinks.map((ImagenLnk) => (
            chkActivoRolAutentica(ImagenLnk.datos, isAuthenticated, jwtRol) && (
              <Grid item xs={8} sm={6} md={4} lg={2.5} xl={2} key={ImagenLnk.datos.id}>
                <Card elevation={8} sx={{ maxWidth: 325, maxHeight: 450 }} onClick={() => {
                  if (ImagenLnk.datos.llamada.param) {
                    navigate(ImagenLnk.datos.llamada.componente, {
                      state: ImagenLnk.datos.llamada.param,
                    });
                  }
                  if (ImagenLnk.datos.llamada.link) {
                    abrirPaginaExterna(ImagenLnk.datos.llamada.link.url);
                  }
                }}>
                  <CardActionArea>
                    <CardMedia sx={{ mt: 1 }}>
                      <LazyLoadImage
                        alt={ImagenLnk.datos.titulo}
                        src={pathImg + ImagenLnk.datos.foto}
                        effect="blur"
                        style={{ height: '115', display: 'block', margin: '0 auto', width: '80%' }}

                        className={classes.imgBtn}
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {ImagenLnk.datos.titulo}

                      </Typography>
                      {(ImagenLnk.datos.texto) &&
                        <Typography variant="body2" color="text.secondary">
                          {ImagenLnk.datos.texto}
                        </Typography>
                      }
                      {!(ImagenLnk.datos.texto) &&
                        <Typography variant="body2" color="text.secondary">
                          Lizards are a widespread group of squamate reptiles, with over 6,000
                          species, ranging across all continents except Antarctica
                        </Typography>
                      }
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
    </div>
  );

}

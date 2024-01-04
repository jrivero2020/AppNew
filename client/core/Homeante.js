import React from "react";
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Grid, Box } from "@mui/material";
import Paper from '@mui/material/Paper'
import './../assets/css/navbar.css'
import './../assets/css/myStyle.css'
import colegio from './../assets/images/Patio2.jpg'
import bkimg from './../assets/images/FondoPantalla.jpg'


export default function Home() {

    return (
        <Grid container spacing={1}  >
            <Grid item xs={12} mt={1} >
                <item >
                <Box sx={{ backgroundImage:`url(${bkimg})` }} border={2} justify="center" align="center" backgroundSize="cover">
                    <img src={colegio} width="96%"  alt="Patio" ></img>
                </Box>
                </item>
            </Grid>
        </Grid>
    )
}





/*
const theme = createTheme();

const useStyles = makeStyles(( theme )  =>({
    root: {
        minHeight: 550,
        backgroundImage: `url(${colegio})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    
    },

})

)
export default function Home() {
    const classes = useStyles()
    return (
        <ThemeProvider theme={theme}>
            <Container  sx={{ color: 'primary.main' }} component="main" maxWidth="xl">
                <CssBaseline />
                <CardMedia  component="img" image={colegio} title="Patio del Colegio"
 sx={{
    width:'88%',
       maxWidth: "xl",
       height:560,
       objectFit: 'contain',
       margin: 2

  }}                
                
                />

            </Container>
        </ThemeProvider>

    )
}


*/
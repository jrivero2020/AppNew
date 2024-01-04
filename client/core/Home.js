import React from "react";
import { Grid, Box } from "@mui/material";
import './../assets/css/navbar.css'
import './../assets/css/myStyle.css'
import colegio from './../assets/images/Entrada1.jpg'
import bkimg from './../assets/images/FondoPantalla.jpg'


export default function Home() {

    return (
        
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', bgcolor: 'primary.main' }}>
              <img src={colegio} alt="placeholder" style={{ Width: '92vm', height: '92vh' }} />
            </Box>
          );
        };



import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import InitOpcion from "./../core/InitOpcionII";

const pathImg = "dist/images/fotos/portada/Principal_gui.jpg";

export default function PrincipalGui() {
  const [showOpc, setShowOpc] = useState(false);
  useEffect(() => {
    setShowOpc(true);
  }, []);

    return (
      <div
      className="App" 
      style={{
        paddingTop: "80px",
        backgroundColor:"#E1E1E1" ,
        backgroundSize: "cover",
        // #5F9EA0
        // height: "100vh",
        // Agrega más estilos según tus necesidades
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
       
          <img src={pathImg} alt="Img.Fondo"  style={{objectFit: "fill"}}/>
        </Box>
        {showOpc && <InitOpcion />}
        </div>
      );
}

/*
 sx={{
                ml: "20px",
                color: "white",
                height: "20vh",
                width: "25vh",
                alignItems: "center",
                justifyContent: "center",
              }}
*/

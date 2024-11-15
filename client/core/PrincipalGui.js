import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import InitOpcion from "./../core/InitOpcionII";

const pathImg = "dist/images/fotos/portada/Principal_gui.jpg";

export default function PrincipalGui() {
  const [showOpc, setShowOpc] = useState(false);
  useEffect(() => {
    setShowOpc(true);
    // console.log("Estoy pasando por aquí****")
  }, []);

    return (
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

          <img src={pathImg} alt="Img.Fondo"  style={{objectFit: "fill"}}/>
        </Box>
        { showOpc && <InitOpcion /> }
        </div>
      );
}

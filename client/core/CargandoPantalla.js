import React from "react";
import {
  AppBar,
  Box,  
  CircularProgress,
  Container,
  IconButton,    
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
const logo = "dist/images/links/LogoColegio_p.png";

function CargandoPantalla() {
  return (
    <>
      <AppBar>
        <Container maxWidth="xl">
          <Box
            sx={{
              mt: "1",
              position: "absolute",
              left: 0,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                height: "45px",
                marginRight: "8px",
                marginTop: "6px",
                activo: 1,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{ ml: 1, lineHeight: "1", activo: 1 }}
            >
              Colegio Los Conquistadores
            </Typography>
            <Typography variant="subtitle1" sx={{ lineHeight: "1", activo: 1 }}>
              Cerrillos
            </Typography>
          </Box>

          <Toolbar
            disableGutters
            position="fixed"
            style={{ height: "90px", activo: 1 }}
            sx={{ justifyContent: "right", activo: 1 }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none", activo: 1 },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                sx={{ marginLeft: "auto", fontSize: "32px", activo: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "80px",
        }}
      >
        <Box
          display="flex"
          border={1}
          borderColor="primary.main"
          borderRadius={16}
          p={2}
          justifyContent="center"
          flexDirection="row"
          sx={{
            width: "55%",
            height: "48%",
            mt: "15px",
          }}
        >
          <CircularProgress color="secondary" />
          <CircularProgress color="success" />
          <CircularProgress color="inherit" />
          <br></br>
          <Typography variant="h6" gutterBottom color="primary">
            Cargando...
          </Typography>
        </Box>
      </div>
    </>
  );
}

export default CargandoPantalla;

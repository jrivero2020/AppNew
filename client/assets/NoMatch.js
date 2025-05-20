import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";

export const NoMatch = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#e3f2fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        spacing={3}
      >
        <Grid item>
          <Typography variant="h1" component="div" fontSize={{ xs: 60, md: 100 }}>
            😕
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1" fontWeight="bold">
            ¡Ups! Página No Existe
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" maxWidth="sm">
            Parece que te perdiste o esta página ya no existe. Pero no te preocupes,
            puedes volver al inicio fácilmente.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleBackHome}
          >
            Volver al Inicio
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default NoMatch;


import React from "react";
import { Box, Button, Grid, Paper, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router";
const pathImg = "dist/images/links/";

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});

export default function Pendiente() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: "100px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{ marginLeft: "10px", marginRight: "10px" }}
            style={{ paddingTop: "40px" }}
          >
            <Item>
              <Typography variant="h3" gutterBottom sx={{ color: "blue" }}>
                Esta Página estará Pronto Disponible
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid
            item
            xs={8}
            sx={{
              marginLeft: "10px",
              marginRight: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
            style={{ paddingTop: "40px" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
              }}
            >
              <StyledImage
                alt="Imagen"
                src={pathImg + "estamos-trabajando.png"}
              />
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          Cerrar
        </Button>
      </Box>
    </div>
  );
}

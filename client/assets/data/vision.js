import {
  Card,
  Button,
  Typography,
  CardContent,
  CardActions,
  Item,
  React,
  Box,
  Grid,
} from "./constantesMui";

import { useNavigate } from "react-router-dom";

import "./../css/myStyle.css";

export default function Vision() {
  const navigate = useNavigate();

  return (
    <div
      id="Aquicomienza"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "200px",
      }}
    >
      <Box sx={{ width: "50%", alignItems: "center" }}>
        <Grid container spacing={2} sx={{ bgcolor: "primary.main" }}>
          <Item sx={{ bgcolor: "#465053e0", border: "1px solid" }}>
            <Card sx={{ minWidth: 275, border: "1px solid" }}>
              <CardContent
                sx={{
                  background: "#dce1e5",
                  color: "#1352e7",
                  border: "5px solid #F57F17",
                  boxShadow: "inset 0 0 10px #503c02",
                }}
              >
                <Typography
                  fontFamily="'Tillana', cursive"
                  variant="h3"
                  component="div"
                >
                  <span style={{ fontWeight: "bold" }}> Nuestra Visión </span>
                  <br />
                  <br />
                </Typography>
                <Typography
                  fontFamily="'Tillana', cursive"
                  variant="body1"
                  sx={{ textAlign: "justify" }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    La visión de nuestro Colegio es la de seguir
                    perfeccionándose para cumplir con las exigencias de los
                    tiempos, mantener su condición de excelencia y continuar
                    entregando herramientas intelectuales y valóricas para el
                    éxito de nuestro alumnos y desarrollo de nuestro país.
                  </span>
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  bgcolor: "#465053e0",
                  boxShadow: "inset 0 0 11px #503c02",
                  justifyContent: "center",
                }}
              >
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
              </CardActions>
            </Card>
          </Item>
        </Grid>
      </Box>
    </div>
  );
}

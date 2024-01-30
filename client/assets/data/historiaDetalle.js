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
const ImgFondoP = "dist/images/links/FondoPantalla.jpg";
export default function HistoriaDetalle() {
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
                  <span style={{ fontWeight: "bold" }}> Nuestra Historia </span>
                  <br />
                  <br />
                </Typography>
                <Typography
                  fontFamily="'Tillana', cursive"
                  variant="body1"
                  sx={{ textAlign: "justify" }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    Corría el año 1976 y una visionaria profesora concretaba un
                    trascendental sueño: éste consistía en poner la primera
                    piedra de lo que sería nuestra institución. Hace años se
                    venía forjando en sus corazones el noble anhelo, y además
                    desafío, de trabajar por el bien social, específicamente, en
                    el área de la educación, un aspecto fundamental para el
                    desarrollo del país.
                    <br />
                    El objetivo, desde un comienzo, fue formar personas
                    integras, con una firme base valórica, seres autónomos y
                    críticos, que pudiesen, no sólo adaptarse a los cambios
                    abruptos de la sociedad, sino que además fueran parte activa
                    de ella.
                    <br />
                    Nuestro establecimiento se inició como jardín infantil en la
                    calle Acapulco con el nombre de Carolin que sólo impartía
                    los niveles de pre-kinder y kinder. Pese a la humildad de
                    nuestro colegio nos vimos en la necesidad y en el deber de
                    crecer y ser un aporte para la comunidad. Fue así como,
                    posteriormente, Carolin se cambiaría a la calle Los copihues
                    manteniendo este mismo nombre. La aprobación lograda por
                    parte de la comunidad, nos instó a que en 1983 diéramos un
                    gran y ambicioso salto, la construcción de un nuevo edificio
                    en San José, iniciando oficialmente las clases en Marzo de
                    1984. Se le bautizó como Colegio Los Conquistadores, pues se
                    pretendía conquistar a niños y jóvenes, imprimiéndoles un
                    sello original fundado en valores cristiano humanistas, en
                    el esfuerzo y la perseverancia. También se pretendía hacer
                    de ellos conquistadores de metas, desafíos y de almas que
                    ven en nuestros alumnos ejemplos de dedicación,
                    responsabilidad, y tolerancia.
                    <br />
                    Durante años trabajamos con dedicación y ahínco, no sólo en
                    el área curricular, sino también ayudando socialmente a
                    nuestros alumnos desarrollando las actitudes artísticas que
                    se reflejan en los numerosos y notables eventos que nos han
                    deleitado y grabado en nuestros corazones. Sin prisa, pero
                    con el firme convencimiento de hacer las cosas bien se pasó
                    de una sencilla construcción al moderno y acogedor edificio
                    que hoy se proyecta ambicioso para el futuro.
                    <br />
                    El Colegio Los Conquistadores se proyecta no con la
                    tranquilidad de una misión cumplida, sino con la inquietud
                    de seguir perfeccionándose para cumplir con las exigencias
                    de los tiempos, mantener su condición de excelencia y
                    continuar entregando herramientas intelectuales y valóricas
                    para el éxito de nuestro alumnos y desarrollo de nuestro
                    país.
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

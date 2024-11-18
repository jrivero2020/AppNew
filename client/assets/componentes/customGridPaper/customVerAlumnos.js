import React, { useState } from "react";
import { Grid, Stack, Paper, Typography, Button } from "@mui/material";

const agregarEspacios = (cantidad) => {
  return "\u00A0".repeat(cantidad); // Espacio en blanco no rompible
};

const CustomGridTitulo = ({
  titulo,
  color,
  backGround,
  titTotales,
  nroMatr,
  variant = "body1",
}) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ margin: "auto", maxWidth: "95%", justifyContent: "center" }}
    >
      <Grid item xs={12}>
        <Stack alignItems="left">
          <Paper
            elevation={3}
            sx={{
              backgroundColor: `${backGround}`,
              display: "flex", // Activa flexbox en el contenedor
              justifyContent: "center", // Centra el contenido horizontalmente
              alignItems: "center", // Centra el contenido verticalmente
            }}
          >
            <Typography
              variant={variant}
              sx={{
                fontWeight: "bold",
                color: `${color}`,
                textAlign: "center", // Centra el texto dentro de Typography
                mt: 1,
              }}
            >
              {titulo}{" "}
              {titTotales !== undefined ? (
                <>
                  {agregarEspacios(20)}Total de alumnos: {titTotales}
                </>
              ) : null}
              {nroMatr !== undefined ? (
                <>
                  {agregarEspacios(20)}Correlativo Nº de matrícula: {nroMatr}
                </>
              ) : (
                ""
              )}
              <br /> &nbsp;
            </Typography>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

const CustomPaper = ({
  anchogrid,
  anchocol,
  arreglo,
  titulo,
  total,
  nroMatr,
  setIdCurso,
  idCurso,
}) => {
  const MostarTodoElCurso = (cense, cgrado, letra, curso) => {
    setIdCurso({
      ...idCurso,
      ense: cense,
      grado: cgrado,
      letra: letra,
      curso: curso,
    });
  };

  return (
    <Grid item xs={anchocol}>
      <Paper elevation={8} sx={{ pb: 3, pt: 2, backgroundColor: "#efebe9" }}>
        <Stack alignItems="center">
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#000000" }}
          >
            {total !== undefined ? (
              <>
                Total alumnos en {titulo}: {total}
              </>
            ) : (
              ""
            )}
            {nroMatr !== undefined ? (
              <>
                {agregarEspacios(5)}Correlativo Nº de matrícula: {nroMatr}
              </>
            ) : (
              ""
            )}
          </Typography>
          <Typography>&nbsp;</Typography>

          <Grid container spacing={1}>
            {arreglo.map((elm, ind) => (
              <CustomGridItem
                anchoGrid={anchogrid}
                key={ind}
                label={elm.nomlargo}
                alumnos={elm.nroAlumnos}
                onClick={() =>
                  MostarTodoElCurso(
                    elm.cod_ense,
                    elm.cod_grado,
                    elm.letra,
                    elm.nomlargo
                  )
                }
              />
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Grid>
  );
};

const CustomGridItem = ({ anchoGrid, label, alumnos, onClick }) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const buttonStyle = {
    backgroundColor: "#efebe9",
    color: "#004D40",
    /* Estilos iniciales del botón */
    /* ... */
    cursor: "zoom-in",
    transform: isHover ? "scale(1.3)" : "scale(1)", // Escala el botón cuando está en hover
  };

  return (
    <Grid item xs={anchoGrid}>
      <Stack alignItems="center">
        <Paper elevation={6} sx={{ px: 1, pb: 1, pt: 1 }}>
          <Button
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            variant="contained"
            onClick={onClick}
            sx={{ fontSize: "11px" }}
          >
            {label}
            <br />
            {alumnos} Alumnos
          </Button>
        </Paper>
      </Stack>
    </Grid>
  );
};

const PaperBuscaAlumno = ({
  anchocol = 6,
  titulo = "No titulo",
  BuscarX,
  resultado,
  setResultado,
  valorOk,
}) => {
  return (
    <Grid item xs={anchocol}>
      <Paper elevation={8} sx={{ pb: 3, pt: 2, backgroundColor: "#efebe9" }}>
        <Stack alignItems="center">
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "#000000" }}
          >
            {titulo !== undefined ? <>{titulo}</> : ""}
          </Typography>
          <BuscarX
            resultado={resultado}
            setResultado={setResultado}
            valorOk={valorOk}
          />
        </Stack>
      </Paper>
    </Grid>
  );
};

export { CustomGridTitulo, CustomPaper, agregarEspacios, PaperBuscaAlumno };

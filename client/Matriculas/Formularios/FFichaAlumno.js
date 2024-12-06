import React, { useContext, useEffect, useState } from "react";
import {
  createTheme,
  Grid,
  ThemeProvider,
  Tabs,
  Tab,
  Button,
} from "@mui/material";

import { AuthContext } from "./../../core/AuthProvider";
import {
  getComunas,
  getParentesco,
  getCursos,
} from "./../../docentes/api-docentes";
import { CustomGridTitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";
import { DatosAlumno } from "./DatosAlumno";
import { DatosApoderado } from "./DatosApoderado";
import { DatosFamiliares } from "./DatosFamiliares";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import { MsgMuestraError } from "./../../assets/dialogs/MuestraError";
import { GrabarAlumno } from "./GrabaFichaAlumno";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

export const FFichaAlumno = ({ resultado, setResultado }) => {
  const [value, setvalue] = useState(0);
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [comunas, setComunas] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [cursos, setCursos] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  const alNuevo = 1;
  const handleChangeTabs = (event, newValue) => {
    setvalue(newValue);
  };

  const EsVacio = (valor) => {
    return valor === 0 || valor === "" || valor === null || valor === undefined;
  };

  // ************************************************
  // Inicializa select y data alumnos
  useEffect(() => {
    //     if (!iniciado && resultado.result !== alNuevo && dataBuscaAl) {
    getComunas().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        setComunas(data);
      }
    });

    getCursos().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const cursosArray = Object.values(data[0]);
        setCursos(cursosArray);
      }
    });

    getParentesco().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        setParentescos(data);
      }
    });
  }, []);

  useEffect(() => {
    if (comunas && comunas.length > 0 && resultado.result !== alNuevo) {
      if (EsVacio(dataBuscaAl.al_id_comuna)) {
        setDataBuscaAl({ ...dataBuscaAl, al_id_comuna: 13102 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comunas]);

  if (!dataBuscaAl) {
    return <div>Cargando datos del alumno...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingTop: "68px" }}>
        <CustomGridTitulo
          titulo={"FICHA INDIVIDUAL DEL ALUMNO"}
          color={"#FFFFFF"}
          backGround={"#1976d2"}
        />
      </div>
      <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChangeTabs}
            aria-label="Carpetas de datos"
            variant="scrollable" // Habilita el desplazamiento
            scrollButtons="auto" // Botones de desplazamiento automáticos
            TabIndicatorProps={{ sx: { display: "none" } }} // Oculta el indicador si se usa flexWrap
            sx={{
              ml: 8,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none", // Mantén el texto como está
                fontWeight: "bold",
                borderTopLeftRadius: "8px", // Bordes para el efecto de carpeta
                borderTopRightRadius: "8px",
                border: "1px solid #ddd",
                borderBottom: "none",
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  borderBottom: "1px solid transparent",
                },
              },
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap", // Permite que los tabs se ajusten
              },
            }}
          >
            <Tab label="I.- Del Alumno" value={0} />
            <Tab label="II.- Del Apoderado" value={1} />
            <Tab label="III.- Familiares" value={2} />
          </Tabs>
        </Grid>
        {value === 0 && (
          <DatosAlumno
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
          />
        )}

        {value === 1 && (
          <DatosApoderado
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
            parentescos={parentescos}
          />
        )}
        {value === 2 && (
          <DatosFamiliares
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
            parentescos={parentescos}
          />
        )}
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          margin: "auto",
          maxWidth: "95%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            sx={{ fontSize: "11px", mt: "10px" }}
            startIcon={<PersonAddIcon />}
            onClick={() =>
              setResultado({ ...resultado, result: 0, fRut: "", dv: "" })
            }
          >
            Nueva Búsqueda
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            sx={{
              fontSize: "11px",
              mt: "10px",
              backgroundColor: "green", // Fondo verde

              "&:hover": {
                // Estilo al pasar el mouse
                backgroundColor: "darkgreen", // Fondo verde más oscuro al hover
              },
            }}
            startIcon={<SaveIcon />}
            onClick={() =>
              GrabarAlumno({
                resultado,
                setResultado,
                setSnackbar,
                dataBuscaAl,
                setDataBuscaAl,
                jwt,
              })
            }
          >
            Grabar Ficha del Alumno
          </Button>
        </Grid>
      </Grid>
      {snackbar && MsgMuestraError({ snackbar, setSnackbar })}
    </ThemeProvider>
  );
};

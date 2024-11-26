import {
  Box,
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import Tab from "@mui/material/Tab";
// import TabPanel from "@mui/lab/TabPanel";
//import { cFichaAlumno } from "./../../Matriculas/matriculasCampos";
import { AuthContext } from "./../../core/AuthProvider";
import {
  getComunas,
  getParentesco,
  getCursos,
} from "./../../docentes/api-docentes";

import { CustomGridTitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";

import { FmtoRut } from "./../../assets/js/FmtoRut";
import { DatosAlumno } from "./DatosAlumno";
import { DatosApoderado } from "./DatosApoderado";
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

  const [comunas, setComunas] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [cursos, setCursos] = useState(null);

  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedParentesco, setSelectedParentesco] = useState(1);
  const [selectedParentescoSup, setSelectedParentescoSup] = useState(1);

  const [selectedComunaAp, setSelectedComunaAp] = useState("");
  const [selectedComunaApSup, setSelectedComunaApSup] = useState("");

  const [selectedCurso, setSelectedCurso] = useState("");

  const [vSexo, setvSexo] = useState("M");
  const [vCurRepe, setvCurRepe] = useState("No");
  const [vViveCon, setvViveCon] = useState(1);
  const [vEnfermedad, setvEnfermedad] = useState("No");
  const [iniciado, setIniciado] = useState(false);
  const alNuevo = 1;
  const handleChangeTabs = (event, newValue) => {
    setvalue(newValue);
  };

  const handleChange = (name) => (event) => {
    setDataBuscaAl({ ...dataBuscaAl, [name]: event.target.value });
  };

  const vViveConCambio = (event) => {
    setvViveCon(event.target.value);
  };

  const vCurRepeCambio = (event) => {
    setvCurRepe(event.target.value);
  };

  const vEnfermedadCambio = (event) => {
    setvEnfermedad(event.target.value);
  };

  const vSexoCambio = (event) => {
    console.log("vSexoCambio ", event.target.value);
    setvSexo(event.target.value);
  };

  const cambioComunaAP = (valor) => {
    setSelectedComunaAp(valor);
  };

  const cambioComunaAPSUP = (valor) => {
    setSelectedComunaApSup(valor);
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
  /*
    useEffect( () => {
      if (resultado.result !== alNuevo && !iniciado) {
 
        setIniciado(true);
      }
//     }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iniciado]);
*/
  useEffect(() => {
    if (comunas && comunas.length > 0 && resultado.result !== alNuevo) {
      if (EsVacio(dataBuscaAl.al_id_comuna)) {
        setDataBuscaAl({ ...dataBuscaAl, al_id_comuna: 13102 });
        setSelectedComuna(13102);
      } else {
        setSelectedComuna(dataBuscaAl.al_id_comuna);
      }

      if (EsVacio(dataBuscaAl.ap_id_comuna)) {
        setSelectedComunaAp(13102);
      } else {
        setSelectedComunaAp(dataBuscaAl.ap_id_comuna);
      }
      if (EsVacio(dataBuscaAl.apsu_id_comuna)) {
        setSelectedComunaApSup(13102);
      } else {
        setSelectedComunaApSup(dataBuscaAl.apsu_id_comuna);
      }
      if (EsVacio(dataBuscaAl.al_idparentesco)) {
        setSelectedParentesco(8);
      } else {
        setSelectedParentesco(dataBuscaAl.al_idparentesco);
      }
      if (EsVacio(dataBuscaAl.al_idparentescosupl)) {
        setSelectedParentesco(8);
      } else {
        setSelectedParentescoSup(dataBuscaAl.al_idparentescosupl);
      }
      console.log(
        "dataBuscaAl.al_genero ===>",
        dataBuscaAl.al_genero,
        " iniciado ===>",
        iniciado
      );
      if (dataBuscaAl.al_genero === "M") {
        setvSexo("Masculino");
      } else {
        setvSexo("Femenino");
      }
      setvViveCon(dataBuscaAl.al_idvivecon);
      setvCurRepe(dataBuscaAl.al_cur_repe === "No" ? "No" : "Sí");
      setvEnfermedad(dataBuscaAl.al_enfermo === "0" ? "No" : "Sí");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comunas]);

  useEffect(() => {
    if (cursos && cursos.length > 0 && resultado.result !== alNuevo)
      setSelectedCurso(dataBuscaAl.id_curso);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursos]);

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
            <Tab label="II.- Familiares" value={2} />
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
          <>
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%", marginTop: "-45px" }}
            >
              <Grid item xs={6}>
                <Grid container spacing={1.5}>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        mx: 0.5,
                        fontSize: 14,
                        textAlign: "center",
                        color: "blue",
                        justifyContent: "center",
                      }}
                    >
                      Antecedentes del Padre
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="rutpadre"
                      size="small"
                      label="R.u.n. Padre"
                      variant="outlined"
                      required
                      fullWidth
                      value={dataBuscaAl.padre_rut}
                      onChange={handleChange("padre_rut")}
                      margin="normal"
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      id="ap_nombres"
                      size="small"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.padre_nombres}
                      onChange={handleChange("padre_nombres")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Paterno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.padre_apat}
                      onChange={handleChange("padre_apat")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Materno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.padre_amat}
                      onChange={handleChange("padre_amat")}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      size="small"
                      label="Estudios"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.padre_estudios}
                      onChange={handleChange("padre_estudios")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ocupación"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.padre_ocupacion}
                      onChange={handleChange("padre_ocupacion")}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={1.5}>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        mx: 0.5,
                        fontSize: 14,
                        textAlign: "center",
                        color: "blue",
                        justifyContent: "center",
                      }}
                    >
                      Antecedentes de la Madre
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="idfRutAp"
                      size="small"
                      label="R.u.n. Madre"
                      variant="outlined"
                      required
                      fullWidth
                      value={dataBuscaAl.madre_rut}
                      onChange={handleChange("madre_rut")}
                      margin="normal"
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      id="madrenom"
                      size="small"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.madre_nombres}
                      onChange={handleChange("madre_nombres")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Paterno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.madre_apat}
                      onChange={handleChange("madre_apat")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Materno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.madre_amat}
                      onChange={handleChange("madre_amat")}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      size="small"
                      label="Estudios"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.madre_estudios}
                      onChange={handleChange("madre_estudios")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ocupación"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.madre_ocupacion}
                      onChange={handleChange("madre_ocupacion")}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%", marginTop: "10px" }}
            >
              <Box
                display="flex"
                justifyContent="flex-start"
                sx={{ border: 1, borderRadius: 1 }}
                mt={0.5}
                mb={2}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                  }}
                >
                  <Grid item mt={"-15px"} mb={"6px"}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: 14,
                        textAlign: "center",
                        color: "blue",
                        justifyContent: "center",
                      }}
                    >
                      Otros
                    </Typography>
                  </Grid>

                  <Grid item xs={6} mt={"-30px"}>
                    <Grid item>
                      <TextField
                        id="ingfamiliar"
                        size="small"
                        label="Ingreso del Grupo Familiar: $ "
                        variant="outlined"
                        required
                        fullWidth
                        value={dataBuscaAl.al_ingresogrupofamiliar}
                        onChange={handleChange("al_ingresogrupofamiliar")}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={6} mt={"-24px"}>
                    <Grid item>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        width={1}
                        sx={{
                          border: 1,

                          borderRadius: 1,
                          height: "40px",
                        }}
                      >
                        <FormLabel
                          id="vivienda"
                          sx={{ mt: 1, ml: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Vivienda &nbsp;&nbsp;
                        </FormLabel>
                        <FormControl size="small">
                          <RadioGroup
                            row
                            aria-labelledby="lingFamiliar"
                            name="rbGrupo"
                            value={vSexo}
                            size="small"
                            onChange={vSexoCambio}
                          >
                            <FormControlLabel
                              value="Propia"
                              control={<Radio size="small" />}
                              label="Propia"
                            />
                            <FormControlLabel
                              value="Cedida"
                              control={<Radio size="small" />}
                              label="Cedida"
                            />
                            <FormControlLabel
                              value="Arrendada"
                              control={<Radio size="small" />}
                              label="Arrendada"
                            />
                            <FormControlLabel
                              value="Allegados"
                              control={<Radio size="small" />}
                              label="Allegados"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      sx={{
                        border: 1,
                        borderRadius: 1,
                        height: "40px",
                      }}
                    >
                      <FormLabel
                        id="religion"
                        sx={{ mt: 1, ml: 2, mb: 3 }}
                        style={{ fontSize: "12px" }}
                      >
                        Autorizo que mi hijo sea evaluado en religión
                        &nbsp;&nbsp;
                      </FormLabel>
                      <FormControl size="small">
                        <RadioGroup
                          row
                          aria-labelledby="autorizo"
                          name="rbGrupo"
                          value={vSexo}
                          size="small"
                          onChange={vSexoCambio}
                        >
                          <FormControlLabel
                            value="Sí"
                            control={<Radio size="small" />}
                            label="Sí"
                          />
                          <FormControlLabel
                            value="No"
                            control={<Radio size="small" />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/*******************FIN Ingreso del grupo Familiar*********************** */}
          </>
        )}
      </Grid>
    </ThemeProvider>
  );
};

/*
         <>
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%", marginTop: "-45px" }}
            >
              <Grid item xs={6}>
                <Grid container spacing={1.5}>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        mx: 0.5,
                        fontSize: 14,
                        textAlign: "center",
                        color: "blue",
                        justifyContent: "center",
                      }}
                    >
                      Apoderado Titular
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="idfRutAp"
                      size="small"
                      label="R.u.n. Apoderado Titular"
                      variant="outlined"
                      required
                      fullWidth
                      value={dataBuscaAl.ap_rut}
                      onChange={handleChange("ap_rut")}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="ap_nombres"
                      size="small"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_nombres}
                      onChange={handleChange("ap_nombres")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Paterno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_apat}
                      onChange={handleChange("ap_apat")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Materno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_amat}
                      onChange={handleChange("ap_amat")}
                    />
                  </Grid>
                  <Grid item>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      width={1}
                      sx={{
                        border: 1,
                        borderRadius: 1,
                        height: "40px",
                      }}
                    >
                      <FormLabel
                        id="lCParentescos"
                        sx={{ mt: 1, ml: 2 }}
                        style={{ fontSize: "12px" }}
                      >
                        Parentesco&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </FormLabel>

                      <FormControl>
                        <Select
                          label="idParentesco"
                          value={selectedParentesco}
                          onChange={(e) =>
                            setSelectedParentesco(e.target.value)
                          }
                          required
                          sx={{
                            minWidth: 130,
                            height: "35px",
                            fontSize: "12px",
                            mt: 0.2,
                          }}
                        >
                          {parentescos.map((parentesco) => (
                            <MenuItem
                              key={parentesco.idparentesco}
                              value={parentesco.idparentesco}
                            >
                              {parentesco.descripcion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Teléfono 1"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_fono1}
                      onChange={handleChange("ap_fono1")}
                    />
                    <TextField
                      size="small"
                      label="Teléfono 2"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_fono2}
                      onChange={handleChange("ap_fono2")}
                    />
                    <TextField
                      size="small"
                      label="Emergencias"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_emergencia}
                      onChange={handleChange("ap_emergencia")}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      size="small"
                      label="email"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_email}
                      onChange={handleChange("ap_email")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Domicilio"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.ap_domicilio}
                      onChange={handleChange("ap_domicilio")}
                    />
                  </Grid>
                  <Grid item>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      width={1}
                      sx={{
                        border: 1,
                        borderRadius: 1,
                        height: "40px",
                      }}
                    >
                      <FormLabel
                        id="aptComuna"
                        sx={{ mt: 1, ml: 2 }}
                        style={{ fontSize: "12px" }} // Comuna del apoderado
                      >
                        Comuna&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </FormLabel>

                      <FormControl>
                        <Select
                          label="ComunasAp"
                          value={selectedComunaAp}
                          onChange={(e) => cambioComunaAP(e.target.value)}
                          required
                          sx={{
                            minWidth: 230,
                            height: "35px",
                            fontSize: "12px",
                            mt: 0.2,
                          }}
                        >
                          {comunas.map((comuna) => (
                            <MenuItem
                              key={comuna.id_comuna}
                              value={comuna.id_comuna}
                            >
                              {comuna.descripcion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
//   Lado derecho  
              <Grid item xs={6}>
                <Grid container spacing={1.5}>
                  <Grid item>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        mx: 0.5,
                        fontSize: 14,
                        textAlign: "center",
                        color: "blue",
                        justifyContent: "center",
                      }}
                    >
                      Apoderado Suplente
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="apSupRut"
                      size="small"
                      label="R.u.n. Apoderado Suplente"
                      variant="outlined"
                      required
                      fullWidth
                      value={dataBuscaAl.apsu_rut}
                      onChange={handleChange("apsu_rut")}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="apsup_nombres"
                      size="small"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_nombres}
                      onChange={handleChange("apsu_nombres")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Paterno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_apat}
                      onChange={handleChange("apsu_apat")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Ap. Materno"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_amat}
                      onChange={handleChange("apsu_amat")}
                    />
                  </Grid>
                  <Grid item>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      width={1}
                      sx={{
                        border: 1,
                        borderRadius: 1,
                        height: "40px",
                      }}
                    >
                      <FormLabel
                        id="lCParentescos"
                        sx={{ mt: 1, ml: 2 }}
                        style={{ fontSize: "12px" }}
                      >
                        Parentesco&nbsp;&nbsp;
                      </FormLabel>

                      <FormControl>
                        <Select
                          label="idParentesco"
                          value={selectedParentescoSup}
                          onChange={(e) =>
                            setSelectedParentescoSup(e.target.value)
                          }
                          required
                          sx={{
                            minWidth: 130,
                            height: "35px",
                            fontSize: "12px",
                            mt: 0.2,
                          }}
                        >
                          {parentescos.map((parentesco) => (
                            <MenuItem
                              key={parentesco.idparentesco}
                              value={parentesco.idparentesco}
                            >
                              {parentesco.descripcion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Teléfono 1"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_fono1}
                      onChange={handleChange("apsu_fono1")}
                    />
                    <TextField
                      size="small"
                      label="Teléfono 2"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_fono2}
                      onChange={handleChange("apsu_fono2")}
                    />
                    <TextField
                      size="small"
                      label="Emergencia"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_emergencia}
                      onChange={handleChange("apsu_emergencia")}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      size="small"
                      label="email"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_email}
                      onChange={handleChange("apsu_email")}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      size="small"
                      label="Domicilio"
                      variant="outlined"
                      fullWidth
                      value={dataBuscaAl.apsu_domicilio}
                      onChange={handleChange("apsu_domicilio")}
                    />
                  </Grid>
                  <Grid item>
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      width={1}
                      sx={{
                        border: 1,
                        borderRadius: 1,
                        height: "40px",
                      }}
                    >
                      <FormLabel
                        id="apsComuna"
                        sx={{ mt: 1, ml: 2 }}
                        style={{ fontSize: "12px" }} // Comuna ap. suplente
                      >
                        Comuna&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </FormLabel>
                      <FormControl>
                        <Select
                          label="ComunasApsU"
                          value={selectedComunaApSup}
                          onChange={(e) => cambioComunaAPSUP(e.target.value)}
                          required
                          sx={{
                            minWidth: 230,
                            height: "35px",
                            fontSize: "12px",
                            mt: 0.2,
                          }}
                        >
                          {comunas.map((comuna) => (
                            <MenuItem
                              key={comuna.id_comuna}
                              value={comuna.id_comuna}
                            >
                              {comuna.descripcion}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
*/

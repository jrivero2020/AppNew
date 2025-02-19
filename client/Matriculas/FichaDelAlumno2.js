/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import {
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// import { useNavigate } from "react-router-dom";
import {
  getDatosMatricula,
  getComunas,
  getParentesco,
  getCursos,
} from "./../docentes/api-docentes";

import { FmtoRut, validarRut, QuitaPuntos } from "../assets/js/FmtoRut";
import WarningIcon from "@mui/icons-material/Warning";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { cFichaAlumno, valAlumno } from "./matriculasCampos";
import ManejaModalNombre from "./ManejaModalNombre";
import ManejaModalGridNombre from "./ManejaModalGridNombre";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthContext } from "../core/AuthProvider";

// import { useForm } from "react-hook-form";
//import auth from "./../auth/auth-helper";
//import { useForm, Form } from './../assets/componentes/useForm'

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            fontSize: "12px",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "11px",
        },
      },
    },
    MuiGrid: {
      defaultProps: {
        item: true,
        xs: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
});

export default function FichaDelAlumno() {
  /********************************************************************* */
  // const navigate = useNavigate();
  const [valores, setValores] = useState(cFichaAlumno);
  const [validations, setValidations] = useState(valAlumno);
  const [fRut, setfRut] = useState("");
  const [fRutAp, setfRutAp] = useState("");

  const [comunas, setComunas] = React.useState([]);
  const [parentescos, setParentescos] = React.useState([]);
  const [cursos, setCursos] = React.useState(null);

  const [selectedComuna, setSelectedComuna] = React.useState("");
  const [selectedParentesco, setSelectedParentesco] = React.useState(1);
  const [selectedComunaAp, setSelectedComunaAp] = React.useState("");
  const [selectedCurso, setSelectedCurso] = React.useState("");

  const [vSexo, setvSexo] = React.useState("Masculino");
  const [vCurRepe, setvCurRepe] = React.useState("No");
  const [vViveCon, setvViveCon] = React.useState(1);
  const [vEnfermedad, setvEnfermedad] = React.useState("No");

  const [verBtnBusca, setverBtnBusca] = React.useState(false);
  const [ModalBuscaNombre, setModalBuscaNombre] = React.useState(false);
  const [ModalGridNombre, setModalGridNombre] = React.useState(false);
  const [btnBuscaNombres, setbtnBuscaNombres] = useState(true);
  const [AlumnosNombres, setAlumnosNombres] = useState({});
  const [RutGrilla, setRutGrilla] = useState(0);
  //Nueva rama ficha-alumno-v2
  //
  /************************************************************************ */
  const ModalOffBtnOn = () => {
    setModalBuscaNombre(false); // cierra modal para buscar nombres
    setbtnBuscaNombres(true); // activa Botón para Buscar por nombre
  };

  const ModalOnBtnOff = () => {
    setModalBuscaNombre(true); // abre modal para buscar nombres
    setbtnBuscaNombres(false); // cierr Botón para Buscar por nombre
  };

  const ModalOffBtnOff = () => {
    setModalBuscaNombre(false); // cierra modal para buscar nombres
    setbtnBuscaNombres(false); // cierra Botón para Buscar por nombre
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
    setvSexo(event.target.value);
  };

  const handleChange = (name) => (event) => {
    setValores({ ...valores, [name]: event.target.value });
  };

  const handleBlur = (campo) => () => {
    let ret = true;
    // let rutlocal = QuitaPuntos(fRut.slice(0, -1)) + fRut.slice(-1);
    if (campo === "al_rut") {
      if (fRut.length >= 8) {
        if (validarRut(fRut)) {
          setValores({
            ...valores,
            al_rut: QuitaPuntos(fRut.slice(0, -1)),
            al_dv: fRut.slice(-1),
          });

          setverBtnBusca(true);
          setbtnBuscaNombres(false);
        } else {
          setverBtnBusca(false);
          setbtnBuscaNombres(true);
          ret = false;
          console.log("Rut erroneo");
        }
      } else {
        ret = false;
      }
    }
    if (campo !== "al_rut") {
      ret = validarCampo(campo, valores[campo]);
    }
    return ret;
  };

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState("1");

  //***************************************************/
  //* manejoCambiofRut
  const manejoCambiofRut = (name) => (event) => {
    let tvalue = FmtoRut(event.target.value);
    if (tvalue === null) return false;

    if (tvalue.length <= 13) {
      setverBtnBusca(false);
      setbtnBuscaNombres(true);
      setfRut(tvalue);
    }

    if (tvalue.length >= 12) {
      setverBtnBusca(true);
      setbtnBuscaNombres(false);
    }
  };

  const manejaCambioEstado = (setter, value) => {
    setter(value);
  };

  //***************************************************/
  //* manejaCambioComunas
  const manejaCambioComunas = (event) => {
    setSelectedComuna(event.target.value);
  };
  //***************************************************/
  //* manejaCambioCursos
  const manejaCambioCursos = (event) => {
    setSelectedCurso(event.target.value);
  };

  //***************************************************/
  //* manejaCambioComunas Apoderado
  const manejaCambioComunasAp = (event) => {
    setSelectedComunaAp(event.target.value);
  };
  
  //***************************************************/
  //* manejaCambioParentesco
  const manejaCambioParentesco = (event) => {
    setSelectedParentesco(event.target.value);
  };

  // const jwt = auth.isAuthenticated();

  //***************************************************/
  //***************************************************/
  //* cargaDataFichaAlumno
  const { jwt } = useContext(AuthContext);

  const cargaDataFichaAlumno = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getDatosMatricula(valores, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const [results] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          alert(
            "**ATENCION** Rut no encontrado en las Matrículas del establecimiento"
          );
        } else {
          const [results] = data;
          setValores(results[0]);

          setSelectedComuna(results[0].al_id_comuna);
          if (results[0].al_genero === "M") {
            setvSexo("Masculino");
          } else {
            setvSexo("Femenino");
          }
        }
        setSelectedCurso(results[0].c_nomcorto);
        setvViveCon(results[0].al_idvivecon);
        setvCurRepe(results[0].al_cur_repe === "No" ? "No" : "Sí");
        setvEnfermedad(results[0].al_enfermo === "0" ? "No" : "Sí");

        setverBtnBusca(false);
        setbtnBuscaNombres(false);
      }
    });
  };

  //********************************************************************* */
  //    Validar campo
  const validarCampo = (campo, valorCampo) => {
    if (validations.hasOwnProperty(campo)) {
      const { ty, nn, ml } = validations[campo];
      const valor = valorCampo; //validations[campo].valor;
      if (valor !== "") {
        if (
          campo === "ma_promedionota" &&
          (!/^\d+(?:[.,]\d+)?$/.test(valor) || valor < 4 || valor > 7)
        ) {
          return false;
        }
        if (ty === "n" && !/^\d+$/.test(valor)) {
          return false;
        }
        if (ml > 0 && valor.length > ml) {
          return false;
        }
      } else {
        if (nn && valor === "") {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  };

  const Inicializar = () => {
    //setRutGrilla(0);
    setValores(cFichaAlumno);
    setbtnBuscaNombres(true);
    setfRut("");
    setvViveCon(1);
    //setbtnBuscaNombres(true);
  };

  //************************************************************** */
  // useEffect Inicio Componente
  useEffect(() => {
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

  const setRutlAlpadre = (rutdesdsehijo) => {
    setRutGrilla(rutdesdsehijo);
    setfRut(FmtoRut(rutdesdsehijo));
    setValores({
      ...valores,
      al_rut: QuitaPuntos(rutdesdsehijo.slice(0, -1)),
      al_dv: rutdesdsehijo.slice(-1),
    });
  };

  useEffect(() => {
    async function fRutGrilla() {
      if (RutGrilla !== 0) {
        cargaDataFichaAlumno();
        document.getElementById("al_nombres").focus();
      }
    }
    fRutGrilla();
  }, [RutGrilla]);

  // const { register, handleSubmit } = useForm();
  //   if (cursos === null) {
  //     // Muestra un indicador de carga mientras esperas los datos
  //     return <div>Cargando Cursos...</div>;
  //   }else{
  //     console.log("Este es el dato de cursos", cursos)
  //   }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={1}
        sx={{ paddingTop: "77px", margin: "auto", maxWidth: "95%" }}
      >
        <Grid item>
          <Typography variant="h5" gutterBottom sx={{ color: "blue" }}>
            Ficha Individual del Alumno
          </Typography>
        </Grid>
      </Grid>

      <TabContext value={value}>
        <TabList
          sx={{
            display: "flex",
            justifyContent: "left",
            paddingLeft: "45px",
            paddingTop: "-50px",
          }}
          onChange={handleChangeTabs}
          aria-label="lab API tabs example"
        >
          <Tab label="I.- Del Alumno" value="1" />
          <Tab label="II.- Del Apoderado" value="2" />
          <Tab label="II.- Familiares" value="3" />
        </TabList>
        <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }}>
          {btnBuscaNombres && value === "1" && (
            <Grid
              item
              mt={"-10px"}
              sx={{
                alignItems: "left",
                marginLeft: "25px",
                justifyContent: "left",
              }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ fontSize: "9px" }}
                startIcon={<PersonSearchIcon />}
                onClick={ModalOnBtnOff}
              >
                Busca por nombres
              </Button>
            </Grid>
          )}
          {ModalBuscaNombre && (
            <ManejaModalNombre
              OnShowGrid={() => setModalGridNombre(true)}
              ModalOffBtnOff={() => ModalOffBtnOff()}
              AlumnosNombres={AlumnosNombres}
              setAlumnosNombres={setAlumnosNombres}
              ModalOffBtnOn={() => ModalOffBtnOn()}
            />
          )}

          {ModalGridNombre && (
            <ManejaModalGridNombre
              AlumnosNombres={AlumnosNombres}
              OffShowGrid={() => setModalGridNombre(false)}
              ModalOffBtnOn={() => ModalOffBtnOn()}
              setRutlAlpadre={setRutlAlpadre}
            />
          )}
          {/************************************************** 6*/}
        </Grid>
        <TabPanel value="1">
          <Grid
            container
            spacing={2}
            sx={{ margin: "auto", maxWidth: "95%", marginTop: "-45px" }}
          >
            <Grid item xs={6}>
              <Paper elevation={6} sx={{ px: 1, pb: 2 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      id="idfRutAl"
                      size="small"
                      label="R.u.n. Alumno"
                      variant="outlined"
                      required
                      fullWidth
                      name="alRut"
                      value={fRut}
                      onChange={manejoCambiofRut("fRrut")}
                      margin="normal"
                      onBlur={handleBlur("al_rut")}
                      InputProps={{
                        endAdornment: verBtnBusca ? (
                          <>
                            <Button
                              color="success"
                              onClick={cargaDataFichaAlumno}
                              startIcon={<PersonSearchIcon />}
                            ></Button>
                          </>
                        ) : validations["al_rut"].value === false ? (
                          <Button
                            color="warning"
                            startIcon={<WarningIcon />}
                          ></Button>
                        ) : (
                          ""
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      style={{ width: "100%", alignItems: "center" }}
                      sx={{ mb: 2, pb: 2 }}
                    >
                      <FormControl size="small" sx={{ ml: 2 }}>
                        <FormLabel
                          id="selCursos"
                          sx={{ mt: 1, ml: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Curso
                        </FormLabel>

                        <Select
                          label="Curso"
                          value={selectedCurso}
                          onChange={(e) =>
                            manejaCambioEstado(setSelectedCurso, e.target.value)
                          }
                          required
                          sx={{
                            minWidth: 200,
                            height: "35px",
                            fontSize: "12px",
                          }}
                        >
                          {cursos !== null &&
                            cursos.map((curso, index) => (
                              <MenuItem key={index} value={curso.nomcorto}>
                                {curso.nomlargo}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      id="al_nombres"
                      size="small"
                      label="Nombres"
                      variant="outlined"
                      fullWidth
                      value={valores.al_nombres}
                      onChange={handleChange("al_nombres")}
                      onBlur={handleBlur("al_nombres")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Ap. Paterno"
                      variant="outlined"
                      fullWidth
                      value={valores.al_apat}
                      onChange={handleChange("al_apat")}
                      onBlur={handleBlur("al_apat")}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Ap. Materno"
                      variant="outlined"
                      fullWidth
                      value={valores.al_amat}
                      onChange={handleChange("al_amat")}
                      onBlur={handleBlur("al_amat")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Fecha Nacimiento"
                      variant="outlined"
                      fullWidth
                      type="date"
                      value={valores.al_f_nac}
                      onChange={handleChange("al_f_nac")}
                      onBlur={handleBlur("al_f_nac")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Paper elevation={3} sx={{ px: 2 }}>
                      <FormControl>
                        <FormLabel
                          id="lSexo"
                          sx={{ mt: 1, ml: 4 }}
                          style={{ fontSize: "12px" }}
                        >
                          Sexo
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="lSexo"
                          name="rbGrupo"
                          value={vSexo}
                          size="small"
                          onChange={vSexoCambio}
                        >
                          <FormControlLabel
                            value="Masculino"
                            control={<Radio size="small" />}
                            label="Masculino"
                          />
                          <FormControlLabel
                            value="Femenino"
                            control={<Radio size="small" />}
                            label="Femenino"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Domicilio"
                      variant="outlined"
                      fullWidth
                      value={valores.al_domicilio}
                      onChange={handleChange("al_domicilio")}
                      onBlur={handleBlur("al_domicilio")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      style={{ width: "100%", alignItems: "center" }}
                      sx={{ mb: 2, pb: 2 }}
                    >
                      <FormControl size="small" sx={{ ml: 2 }}>
                        <FormLabel
                          id="lComuna"
                          sx={{ mt: 1, ml: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Comuna
                        </FormLabel>

                        <Select
                          label="Comunas"
                          value={selectedComuna}
                          onChange={(e) =>
                            manejaCambioEstado(
                              setSelectedComuna,
                              e.target.value
                            )
                          }
                          required
                          sx={{
                            minWidth: 200,
                            height: "35px",
                            fontSize: "12px",
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
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Colegio Origen"
                      variant="outlined"
                      value={valores.al_procedencia}
                      fullWidth
                      onChange={handleChange("al_procedencia")}
                      onBlur={handleBlur("al_procedencia")}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* *************************************** */}

            <Grid item xs={6}>
              <Paper elevation={6} sx={{ px: 1, pb: 2 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      style={{ alignItems: "left" }}
                      inputProps={{ maxLength: 4, pattern: "[0-9,]*" }}
                      size="small"
                      label="Promedio de Notas"
                      variant="outlined"
                      value={valores.al_promedionota}
                      margin="normal"
                      onChange={handleChange("al_promedionota")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      style={{ width: "100%", alignItems: "center" }}
                      sx={{ mt: 2, mb: 2 }}
                    >
                      <FormControl size="small" sx={{ ml: 2 }}>
                        <FormLabel
                          id="lcursos"
                          sx={{ mt: 1, ml: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Cursos Repetidos
                        </FormLabel>

                        <RadioGroup
                          row
                          aria-labelledby="rCurRepe"
                          name="rCurRepe"
                          value={vCurRepe}
                          size="small"
                          onChange={vCurRepeCambio}
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
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={3}
                      style={{ width: "100%", alignItems: "center" }}
                      sx={{ pd: 2 }}
                    >
                      <FormControl size="small" sx={{ ml: 2 }}>
                        <FormLabel
                          id="lViveCon"
                          sx={{ mt: 1, ml: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Con quién vive
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="rViveCon"
                          name="rViveCon"
                          value={vViveCon}
                          size="small"
                          onChange={vViveConCambio}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio size="small" />}
                            label="Ambos Padres"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio size="small" />}
                            label="Madre"
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio size="small" />}
                            label="Padre"
                          />
                          <FormControlLabel
                            value="4"
                            control={<Radio size="small" />}
                            label="Otros"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>
                  {vViveCon === "4" && (
                    <Grid item xs={6}>
                      <TextField
                        sx={{ mt: 1 }}
                        label="Describa Con quién vive"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={valores.al_descripcionvivecon}
                        onChange={handleChange("al_descripcionvivecon")}
                        onBlur={handleBlur("al_descripcionvivecon")}
                      />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Paper
                      elevation={3}
                      style={{ width: "100%", alignItems: "center" }}
                    >
                      <FormControl size="small" sx={{ ml: 2 }}>
                        <FormLabel
                          id="lEnfermedad"
                          sx={{ mt: 1, ml: 2, pl: 2 }}
                          style={{ fontSize: "12px" }}
                        >
                          Enfermedad Crónica ?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="renfermedad"
                          name="renfermedad"
                          value={vEnfermedad}
                          size="small"
                          onChange={vEnfermedadCambio}
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
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Cuidados especiales"
                      variant="outlined"
                      fullWidth
                      value={valores.al_cuidados}
                      onChange={handleChange("al_cuidados")}
                      onBlur={handleBlur("al_cuidados")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Nº Hermanos"
                      variant="outlined"
                      fullWidth
                      value={valores.al_canthnos}
                      onChange={handleChange("al_canthnos")}
                      onBlur={handleBlur("al_canthnos")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Su Ubicación entre ellos"
                      variant="outlined"
                      fullWidth
                      value={valores.al_nroentrehnos}
                      onChange={handleChange("al_nroentrehnos")}
                      onBlur={handleBlur("al_nroentrehnos")}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="Nº Hermanos Estudian aquí"
                      variant="outlined"
                      fullWidth
                      value={valores.al_hnosaca}
                      onChange={handleChange("al_hnosaca")}
                      onBlur={handleBlur("al_hnosaca")}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="En qué Cursos estudian"
                      variant="outlined"
                      fullWidth
                      value={valores.al_hnoscursos}
                      onChange={handleChange("al_hnoscursos")}
                      onBlur={handleBlur("al_hnoscursos")}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* **********************************************fin**/}

            {!btnBuscaNombres && value === "1" && (
              <Grid item mt={"-6px"}>
                <Button
                  variant="contained"
                  size="small"
                  style={{ fontSize: "11px" }}
                  startIcon={<PersonAddIcon />}
                  onClick={() => {
                    Inicializar();
                  }}
                >
                  Nueva Busqueda
                </Button>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value="2">
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
                    value={valores.ap_rut}
                    onChange={handleChange("ap_rut")}
                    margin="normal"
                    onBlur={handleBlur("ap_rut")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="ap_nombres"
                    size="small"
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_nombres}
                    onChange={handleChange("ap_nombres")}
                    onBlur={handleBlur("ap_nombres")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Paterno"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_apat}
                    onChange={handleChange("ap_apat")}
                    onBlur={handleBlur("ap_apat")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Materno"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_amat}
                    onChange={handleChange("ap_amat")}
                    onBlur={handleBlur("ap_amat")}
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
                        onChange={manejaCambioParentesco}
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
                    value={valores.ap_fono1}
                    onChange={handleChange("ap_fono1")}
                    onBlur={handleBlur("ap_fono1")}
                  />
                  <TextField
                    size="small"
                    label="Teléfono 2"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_fono2}
                    onChange={handleChange("ap_fono2")}
                    onBlur={handleBlur("ap_fono2")}
                  />
                  <TextField
                    size="small"
                    label="Emergencias"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_emergencia}
                    onChange={handleChange("ap_emergencia")}
                    onBlur={handleBlur("ap_emergencia")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    size="small"
                    label="email"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_email}
                    onChange={handleChange("ap_email")}
                    onBlur={handleBlur("ap_email")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Domicilio"
                    variant="outlined"
                    fullWidth
                    value={valores.ap_domicilio}
                    onChange={handleChange("ap_domicilio")}
                    onBlur={handleBlur("ap_domicilio")}
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
                      style={{ fontSize: "12px" }}
                    >
                      Comuna&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </FormLabel>

                    <FormControl>
                      <Select
                        label="Comunas"
                        value={selectedComunaAp}
                        onChange={manejaCambioComunasAp}
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
            {/*******************************Lado derecho  */}
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
                    value={valores.apsu_rut}
                    onChange={handleChange("apsu_rut")}
                    margin="normal"
                    onBlur={handleBlur("apsu_rut")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="apsup_nombres"
                    size="small"
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_nombres}
                    onChange={handleChange("apsu_nombres")}
                    onBlur={handleBlur("apsu_nombres")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Paterno"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_apat}
                    onChange={handleChange("apsu_apat")}
                    onBlur={handleBlur("apsu_apat")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Materno"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_amat}
                    onChange={handleChange("apsu_amat")}
                    onBlur={handleBlur("apsu_amat")}
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
                        value={selectedParentesco}
                        onChange={manejaCambioParentesco}
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
                    value={valores.apsu_fono1}
                    onChange={handleChange("apsu_fono1")}
                    onBlur={handleBlur("apsu_fono1")}
                  />
                  <TextField
                    size="small"
                    label="Teléfono 2"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_fono2}
                    onChange={handleChange("apsu_fono2")}
                    onBlur={handleBlur("apsu_fono2")}
                  />
                  <TextField
                    size="small"
                    label="Emergencia"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_emergencia}
                    onChange={handleChange("apsu_emergencia")}
                    onBlur={handleBlur("apsu_emergencia")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    size="small"
                    label="email"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_email}
                    onChange={handleChange("apsu_email")}
                    onBlur={handleBlur("apsu_email")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Domicilio"
                    variant="outlined"
                    fullWidth
                    value={valores.apsu_domicilio}
                    onChange={handleChange("apsu_domicilio")}
                    onBlur={handleBlur("apsu_domicilio")}
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
                      style={{ fontSize: "12px" }}
                    >
                      Comuna&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </FormLabel>
                    <FormControl>
                      <Select
                        label="Comunas"
                        value={selectedComunaAp}
                        onChange={manejaCambioComunasAp}
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
        </TabPanel>
        <TabPanel value="3">
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
                    value={valores.padre_rut}
                    onChange={handleChange("padre_rut")}
                    margin="normal"
                    onBlur={handleBlur("padre_rut")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    id="ap_nombres"
                    size="small"
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={valores.padre_nombres}
                    onChange={handleChange("padre_nombres")}
                    onBlur={handleBlur("padre_nombres")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Paterno"
                    variant="outlined"
                    fullWidth
                    value={valores.padre_apat}
                    onChange={handleChange("padre_apat")}
                    onBlur={handleBlur("padre_apat")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Materno"
                    variant="outlined"
                    fullWidth
                    value={valores.padre_amat}
                    onChange={handleChange("padre_amat")}
                    onBlur={handleBlur("padre_amat")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    size="small"
                    label="Estudios"
                    variant="outlined"
                    fullWidth
                    value={valores.padre_estudios}
                    onChange={handleChange("padre_estudios")}
                    onBlur={handleBlur("padre_estudios")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ocupación"
                    variant="outlined"
                    fullWidth
                    value={valores.padre_ocupacion}
                    onChange={handleChange("padre_ocupacion")}
                    onBlur={handleBlur("padre_ocupacion")}
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
                    value={valores.madre_rut}
                    onChange={handleChange("madre_rut")}
                    margin="normal"
                    onBlur={handleBlur("madre_rut")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    id="madrenom"
                    size="small"
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={valores.madre_nombres}
                    onChange={handleChange("madre_nombres")}
                    onBlur={handleBlur("madre_nombres")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Paterno"
                    variant="outlined"
                    fullWidth
                    value={valores.madre_apat}
                    onChange={handleChange("madre_apat")}
                    onBlur={handleBlur("madre_apat")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ap. Materno"
                    variant="outlined"
                    fullWidth
                    value={valores.madre_amat}
                    onChange={handleChange("madre_amat")}
                    onBlur={handleBlur("madre_amat")}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    size="small"
                    label="Estudios"
                    variant="outlined"
                    fullWidth
                    value={valores.madre_estudios}
                    onChange={handleChange("madre_estudios")}
                    onBlur={handleBlur("madre_estudios")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    size="small"
                    label="Ocupación"
                    variant="outlined"
                    fullWidth
                    value={valores.madre_ocupacion}
                    onChange={handleChange("madre_ocupacion")}
                    onBlur={handleBlur("madre_ocupacion")}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/*******************Ingreso del grupo Familiar*************************** */}
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
                      value={valores.al_ingresogrupofamiliar}
                      onChange={handleChange("al_ingresogrupofamiliar")}
                      margin="normal"
                      onBlur={handleBlur("al_ingresogrupofamiliar")}
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
                      Autorizo que mi hijo sea evaluado en religión &nbsp;&nbsp;
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
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
}

/*


*/

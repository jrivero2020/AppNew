import React, { useEffect } from "react";
import {
  TextField,
  Typography,
  CardActions,
  Button,
  Grid,
  Card,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
  Alert,
  AlertTitle,
  InputAdornment,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDatosMatricula, getComunas } from "./../docentes/api-docentes";
import Item from "../core/Item";
import { FmtoRut, validarRut, QuitaPuntos } from "../assets/js/FmtoRut";

import CheckIcon from "@mui/icons-material/Check";
import GppBadIcon from "@mui/icons-material/GppBad";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import StarRateIcon from "@mui/icons-material/StarRate";
import WarningIcon from "@mui/icons-material/Warning";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ClearIcon from "@mui/icons-material/Clear";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextBox } from "@react-pdf-viewer/core";
import { CamposFichaAlumno, valDatosAlumno } from "./matriculasCampos";
import BasicEditingGrid from "./TablaGrillaAlumno";
import GridBuscaAlumnos from "./GridBuscaAlumos";
import { Search } from "@mui/icons-material";
export default function FichaDelAlumno() {
  /********************************************************************* */
  const navigate = useNavigate();
  const [valores, setValores] = useState(CamposFichaAlumno());
  const [validations, setValidations] = useState(valDatosAlumno());

  const [fRut, setfRut] = useState("");
  const [comunas, setComunas] = React.useState([]);
  const [selectedComuna, setSelectedComuna] = React.useState("");
  const [alerta, setAlerta] = useState([]);
  const [vSexo, setvSexo] = React.useState("Masculino");
  const [vCurRepe, setvCurRepe] = React.useState("No");
  const [vViveCon, setvViveCon] = React.useState(1);
  const [verBtnBusca, setverBtnBusca] = React.useState(false);
  const [btnBuscaNombres, setbtnBuscaNombres] = useState({
    btnBusca: true,
    btnDialog: false,
  });
  /************************************************************************ */

  const chgBtnBusca = () => {
    setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: false, btnDialog:true });
  };

  function MuestraGrillaAlumnos() {   
    return (<GridBuscaAlumnos btnBuscaNombres={btnBuscaNombres} setbtnBuscaNombres={setbtnBuscaNombres} />);
  }

  const vViveConCambio = (event) => {
    setvViveCon(event.target.value);
  };

  const vCurRepeCambio = (event) => {
    setvCurRepe(event.target.value);
  };

  const vSexoCambio = (event) => {
    setvSexo(event.target.value);
  };

  const handleChange = (name) => (event) => {
    setValores({ ...valores, [name]: event.target.value });
  };

  const handleBlur = (campo) => () => {
    let ret = true;
    console.log("*************************************");
    console.log("*           handleBlur              *");
    console.log("campo==>:", campo);
    console.log("validations==>:", validations);
    // *************************
    // Validar con nuevas propiedades
    if (campo === "al_rut") {
      if (fRut.length >= 8) {
        if (validarRut(fRut)) {
          setValores({
            ...valores,
            al_rut: QuitaPuntos(fRut.slice(0, -1)),
            al_dv: fRut.slice(-1),
          });
          setverBtnBusca(true);
          setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: false, btnDialog: false });
          console.log("Rut ok Validado. valores=", valores);
        } else {
          setverBtnBusca(false);
          setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: true, btnDialog: false });
          console.log("Rut no es válido");
          ret = false;
        }
      } else {
        console.log("Largo de rut debe ser a lo menos de 8 caracteres");
        ret = false;
      }
    }
    if (campo !== "al_rut") {
      ret = validarCampo(campo, valores[campo]);
      if (ret) {
        console.log("Validado", ret);
      } else {
        console.log("no validado", ret);
      }
      //      (ret ? console.log("Validado", ret) : console.log("no validado", ret))
      console.log("ret : ", ret);
    }

    console.log("Se llama a actualizar validations");
    setValidations({
      ...validations,
      [campo]: {
        ...validations[campo],
        value: ret,
      },
    });

    console.log("*                                   *");
    console.log("*************************************");
    return ret;
  };

  const cierreDialog = () => {
    setValores({ ...valores, open: false });
  };

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState("1");

  //***************************************************/
  //* manejoCambiofRut
  const manejoCambiofRut = (name) => (event) => {
    let tvalue = FmtoRut(event.target.value);
    
    if (fRut.length === 1 && tvalue == null) tvalue = "";

    if (tvalue.length <= 13) setfRut(tvalue);

    if (tvalue.length >= 12) {
      setverBtnBusca(true);
      setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: false, btnDialog:false });
    } else {
      setverBtnBusca(false);
      setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: true, btnDialog: false });
    }
    
  };
  //***************************************************/

  //***************************************************/
  //* actualizaRutEnValores
  const actualizaRutEnValores = () => {
    setValores({
      ...valores,
      al_rut: QuitaPuntos(fRut.slice(0, -1)),
      al_dv: fRut.slice(-1),
    });
  };
  //***************************************************/

  //***************************************************/
  //* manejaCambioComunas
  const manejaCambioComunas = (event) => {
    console.log("event.target.value:", event.target.value);
    setSelectedComuna(event.target.value);
  };
  //***************************************************/

  //***************************************************/
  //* cargaDataFichaAlumno
  const cargaDataFichaAlumno = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const event = new Event("blur");
    /*
    if (validations["al_rut"].value === false) {
      console.log("disparo evento ******************* ");
      TextField.dispatchEvent(event);
    }
*/
    getDatosMatricula(valores, signal).then((data) => {
      if (data && data.error) {
        console.log("*** Error ***", data.error);
      } else {
        const [results, metadata] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          alert(
            "**ATENCION** Rut no encontrado en las Matrículas del establecimiento"
          );
        } else {
          const [results, metadata] = data;
          console.log("results", results[0]);
          console.log('metadata"]', metadata);
          setValores(results[0]);
          setSelectedComuna(results[0].al_id_comuna);
          if (results[0].al_genero === "M") {
            setvSexo("Masculino");
          } else {
            setvSexo("Femenino");
          }
        }
        // Usando la función updateValidations
        const updatedValidations = updateValidations(validations);
        //console.log(updatedValidations);
        // setValidations(updatedValidations);
        setvViveCon(results[0].ma_idvivecon);
        setverBtnBusca(false);
        setbtnBuscaNombres({ ...btnBuscaNombres, btnBusca: false, btnDialog:false });

      }
    });
  };
  //***************************************************/

  //***************************************************/
  //* clickSubmit
  const clickSubmit = (event) => {
    event.preventDefault();

    if (!validarRut(fRut)) {
      navigate("/alertas", {
        state: { aMensajes: "Rut ingresado erróneo", aTitulo: "Cuidado!!" },
      });
      return false;
    }

    actualizaRutEnValores();
    cargaDataFichaAlumno();
  };
  //************************************************************** */

  //************************************************************** */
  // validateField
  const validateField = (campo) => {
    let ret = true;
    console.log("En validateField recibo como campo : ", campo);
    // Aquí puedes realizar tus validaciones personalizadas para cada campo
    // Por ejemplo:
    if (
      campo === "nombres" &&
      (valores.al_nombres.trim() === "" || valores.al_nombres.length < 5)
    ) {
      ret = false;
    }
    if (campo === "al_rut" && fRut.length >= 8) {
      if (!validarRut(fRut)) {
        alert("validateField Rut ingresado erróneo");
        ret = false;
      }

      actualizaRutEnValores();
      console.log(
        "llamo a actualizaRutEnValores",
        QuitaPuntos(fRut.slice(0, -1)),
        valores.al_rut
      );
    } else {
      console.log("Largo de rut debe ser a lo menos de 8 caracteres");
      ret = false;
    }

    console.log(
      "Validando campo : ",
      campo,
      "Retorno de validateField:==>",
      ret
    );
    console.log(" validations ===>", validations);
    return ret;
  };
  //************************************************************** */
  function updateValidations(obj) {
    console.log("updateValidations(obj)", obj);
    const newValidations = {};
    Object.keys(obj).forEach((key) => {
      newValidations[key] = {
        ...obj[key],
        value: true,
      };
    });

    console.log("newValidations", newValidations);

    setValidations(newValidations);
  }

  //********************************************************************* */
  //    Validar campo
  const validarCampo = (campo, valorCampo) => {
    if (validations.hasOwnProperty(campo)) {
      const { ty, num, nn, ml } = validations[campo];
      const valor = valorCampo; //validations[campo].valor;
      console.log("Campo en validar campo", campo);
      if (valor !== "") {
        if (
          campo === "ma_promedionota" &&
          (!/^\d+(?:[.,]\d+)?$/.test(valor) || valor < 4 || valor > 7)
        ) {
          console.log(
            "El campo debe ser numérico no mayor que 4 ni mayor que 7"
          );
          return false;
        }
        if (ty === "n" && !/^\d+$/.test(valor)) {
          console.log("El campo debe ser numérico ");
          return false;
        }
        if (ml > 0 && valor.length > ml) {
          console.log(`El campo debe tener máximo ${ml} caracteres`);
          return false;
        }
      } else {
        if (nn && valor === "") {
          console.log("El campo no debe ser nulo");
          return false;
        }
      }
    } else {
      console.log("El campo no existe en la estructura");
      return false;
    }

    console.log("El campo es válido");
    return true;
  };

  //************************************************************** */
  // useEffect
  useEffect(() => {
    getComunas().then((data) => {
      if (data && data.error) {
        console.log("*** Error ***", data.error);
      } else {
        console.log("validations :", validations);

        console.log("validations[al_rut].value :", validations["al_rut"].value);

        setComunas(data);
      }
    });
  }, []);

  return (
    <Grid
      container
      sx={{
        paddingTop: "70px",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        maxWidth: "95%",
      }}
    >
      <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mt: 2.5, color: "blue", textAlign: "center" }}
        >
          Ficha Individual del Alumno
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              typography: "body2",
              marginLeft: 3,
            }}
          >
            <TabList
              onChange={handleChangeTabs}
              aria-label="lab API tabs example"
            >
              <Tab label="I.- Del Alumno" value="1" />
              <Tab label="II.- Del Apoderado" value="2" />
              <Tab label="II.- Familiares" value="3" />
              <Tab label="IV Compromiso" value="4" />
            </TabList>
          </Box>

          <TabPanel value="1">

            <Grid
              container
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} md={12}>
                {btnBuscaNombres.btnBusca && (
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<PersonSearchIcon />}
                    onClick={chgBtnBusca}
                  >
                    Busca por nombres
                  </Button>
                )}

                {btnBuscaNombres.btnDialog && <MuestraGrillaAlumnos />}
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="R.u.n. Alumno"
                  variant="outlined"
                  required
                  fullWidth
                  value={fRut}
                  onChange={manejoCambiofRut("fRrut")}
                  margin="normal"
                  onBlur={handleBlur("al_rut")}
                  helperText={
                    validations["al_rut"].value == false
                      ? "Ingrese rut del alumno (valido)"
                      : ""
                  }
                  error={validations["al_rut"].value == false}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  InputProps={{
                    endAdornment: verBtnBusca ? (
                      <>
                        <Button
                          color="success"
                          onClick={cargaDataFichaAlumno}
                          startIcon={<PersonSearchIcon />}
                        ></Button>
                      </>
                    ) : validations["al_rut"].value == false ? (
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
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Nombres"
                  variant="outlined"
                  fullWidth
                  value={valores.al_nombres}
                  onChange={handleChange("al_nombres")}
                  onBlur={handleBlur("al_nombres")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_nombres"].value}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Ap. Paterno"
                  variant="outlined"
                  fullWidth
                  value={valores.al_apat}
                  onChange={handleChange("al_apat")}
                  onBlur={handleBlur("al_apat")}
                  error={!validations["al_apat"].value}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                /*
                InputProps={{
                  endAdornment: validations["al_apat"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_apat == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Ap. Materno"
                  variant="outlined"
                  fullWidth
                  value={valores.al_amat}
                  onChange={handleChange("al_amat")}
                  onBlur={handleBlur("al_amat")}
                  error={!validations["al_amat"].value}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                /*InputProps={{
                  endAdornment: validations["al_amat"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_amat === "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Grid item xs={12} md={3} sx={{ mt: 1 }}>
                <TextField
                  size="small"
                  label="F.Nacimiento"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={valores.al_f_nac}
                  onChange={handleChange("al_f_nac")}
                  onBlur={handleBlur("al_f_nac")}
                  error={!validations["al_f_nac"].value}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Box sx={{ border: 1 }}>
                  <Item>
                    <FormControl
                      size="small"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "12px",
                        },
                      }}
                    >
                      <FormLabel id="lSexo" style={{ fontSize: "12px" }}>
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
                  </Item>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Domicilio"
                  variant="outlined"
                  fullWidth
                  value={valores.al_domicilio}
                  onChange={handleChange("al_domicilio")}
                  onBlur={handleBlur("al_domicilio")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_domicilio"].value}
                /*InputProps={{
                  endAdornment: validations["al_domicilio"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_domicilio == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Box>
                  <FormControl>
                    <InputLabel id="txtComuna">Comunas</InputLabel>
                    <Select
                      label="Comunas"
                      value={selectedComuna}
                      onChange={manejaCambioComunas}
                      required
                      sx={{
                        minWidth: 230,
                        height: "38px",
                        backgroundColor: "#E8EAF6",
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
                </Box>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center", mt: 1 }}
            >
              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Colegio Origen"
                  variant="outlined"
                  value={valores.ma_cole_origen}
                  fullWidth
                  onChange={handleChange("ma_cole_origen")}
                  onBlur={handleBlur("ma_cole_origen")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["ma_cole_origen"].value}
                /*InputProps={{
                  endAdornment: validations["ma_cole_origen"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_id_comuna == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>

              <Grid item xs={6} md={1.5}>
                <TextField
                  size="small"
                  label="Prom. Notas"
                  variant="outlined"
                  value={valores.ma_promedionota}
                  type="number"
                  min={4}
                  max={7}
                  onChange={handleChange("ma_promedionota")}
                  onBlur={handleBlur("ma_promedionota")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["ma_promedionota"].value}
                /*InputProps={{
                  endAdornment: validations["ma_promedionota"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.ma_promedionota == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>
              <Grid item xs={6} md={1.5}>
                <Item>
                  <Box sx={{ border: 1 }}>
                    <FormControl
                      size="small"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "12px",
                        },
                      }}
                    >
                      <FormLabel id="rCurRepe" style={{ fontSize: "12px" }}>
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
                  </Box>
                </Item>
              </Grid>

              <Grid item xs={3} md={6}>
                <Item>
                  <Box sx={{ border: 1 }}>
                    <FormControl
                      size="small"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "12px",
                        },
                      }}
                    >
                      <FormLabel id="rViveCon" style={{ fontSize: "12px" }}>
                        Con quién vive ?
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
                  </Box>
                  {vViveCon == 4 ? (
                    <TextField
                      sx={{ backgroundColor: "#E8EAF6", mt: 1 }}
                      label="Describa Con quién vive"
                      variant="outlined"
                      fullWidth
                      value={valores.ma_descripcionviveconotros}
                      onChange={handleChange("ma_descripcionviveconotros")}
                      onBlur={handleBlur("ma_descripcionviveconotros")}
                      inputProps={{ style: { fontSize: 12 } }}
                      error={!validations["ma_descripcionviveconotros"].value}
                    /* InputProps={{
                      endAdornment: validations["ma_descripcionviveconotros"]
                        .value ? (
                        <CheckIcon color="success" />
                      ) : valores.ma_descripcionviveconotros == "" ? (
                        <StarRateIcon color="error" />
                      ) : (
                        <GppBadIcon color="error" />
                      ),
                    }}*/
                    />
                  ) : (
                    ""
                  )}

                  {vViveCon == 3 ? (
                    <Card
                      style={{
                        maxWidth: "90%",
                        margin: "auto",
                        height: "1020px",
                      }}
                    >
                      {console.log("Valores a imprimir:", valores)}
                      <BasicEditingGrid data={valores} />
                    </Card>
                  ) : null}
                </Item>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                <Item>
                  <Box sx={{ border: 1 }}>
                    <FormControl
                      size="small"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "12px",
                        },
                      }}
                    >
                      <FormLabel id="rCurRepe" style={{ fontSize: "12px" }}>
                        Enfermedad Crónica ?
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
                  </Box>
                </Item>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Cuidados especiales"
                  variant="outlined"
                  fullWidth
                  value={valores.al_cuidados}
                  onChange={handleChange("al_cuidados")}
                  onBlur={handleBlur("al_cuidados")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_cuidados"].value}
                /*InputProps={{
                  endAdornment: validations["al_cuidados"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_cuidados == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Nº Hermanos"
                  variant="outlined"
                  fullWidth
                  value={valores.al_canthnos}
                  onChange={handleChange("al_canthnos")}
                  onBlur={handleBlur("al_canthnos")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_canthnos"].value}
                /*InputProps={{
                  endAdornment: validations["al_canthnos"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_canthnos == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  size="small"
                  label="Su Ubicación entre ellos"
                  variant="outlined"
                  fullWidth
                  value={valores.al_nroentrehnos}
                  onChange={handleChange("al_nroentrehnos")}
                  onBlur={handleBlur("al_nroentrehnos")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_nroentrehnos"].value}
                /*InputProps={{
                  endAdornment: !validations["al_nroentrehnos"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_nroentrehnos == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                <TextField
                  size="small"
                  label="Nº Hnos.Estudian aquí"
                  variant="outlined"
                  fullWidth
                  value={valores.al_hnosaca}
                  onChange={handleChange("al_hnosaca")}
                  onBlur={handleBlur("al_hnosaca")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_hnosaca"]}
                /*InputProps={{
                  endAdornment: validations["al_hnosaca"] ? (
                    <CheckIcon color="success" />
                  ) : valores.al_hnosaca == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>

              <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                <TextField
                  size="small"
                  label="En qué Cursos estudian"
                  variant="outlined"
                  fullWidth
                  value={valores.al_hnoscursos}
                  onChange={handleChange("al_hnoscursos")}
                  onBlur={handleBlur("al_hnoscursos")}
                  sx={{ backgroundColor: "#E8EAF6" }}
                  inputProps={{ style: { fontSize: 12 } }}
                  error={!validations["al_hnoscursos"].value}
                /* InputProps={{
                  endAdornment: validations["al_hnoscursos"].value ? (
                    <CheckIcon color="success" />
                  ) : valores.al_hnoscursos == "" ? (
                    <StarRateIcon color="error" />
                  ) : (
                    <GppBadIcon color="error" />
                  ),
                }}*/
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box />
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                paddingTop: "2x",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                maxWidth: "65%",
              }}
            >
              {valores.open ? (
                <Grid item xs={12}>
                  <Item>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ color: "blue" }}
                    >
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={cierreDialog}
                      >
                        Buscar otro Rut
                      </Button>
                    </Typography>
                  </Item>
                </Grid>
              ) : null}
            </Grid>

            <Typography
              sx={{
                fontWeight: "bold",
                mx: 0.5,
                fontSize: 14,
                textAlign: "left",
                color: "blue",
                justifyContent: "left",
              }}
            >
              <StarRateIcon color="error" /> = Indica que el campo es
              obligatorio
            </Typography>
          </TabPanel>
          <TabPanel value="2">II.- Antecedentes Del Apoderado</TabPanel>
          <TabPanel value="3">III.- Antecedentes Familiares</TabPanel>
          <TabPanel value="4">IV Compromiso de Responsabilidad</TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
}

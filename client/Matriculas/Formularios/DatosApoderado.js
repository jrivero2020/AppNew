import React, { useCallback, useContext, useState, useRef } from "react";
import { AuthContext } from "../../core/AuthProvider";
import { CargaDataFamiliaAp } from "./../../FichaAlumnos/CargaDataRutAlumno";

import {
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  FormHelperText,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  FValidarOtrosRut,
  RutANumeros,
  FmtoRut,
} from "./../../assets/js/FmtoRut";
import { ValidaFichaAlumno } from "./helpers/ValidaFichaAlumno";
import { CustomGridSubtitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Tooltip from "@mui/material/Tooltip";

export const DatosApoderado = ({ comunas, parentescos }) => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(0);

  const refs = {
    ApRut: useRef(""),
    ApsuRut: useRef(""),
    PadRut: useRef(""),
    MadRut: useRef(""),
  };

  const handleChange = useCallback(
    (name, curso) => (event) => {
      const { value } = event.target;
      const error = ValidaFichaAlumno(name, value, curso);
      setErrors({ ...errors, [name]: error });

      const numValor = Number(value);
      const isParentesco =
        (name === "al_idparentesco" || name === "al_idparentescosupl") &&
        [1, 2].includes(numValor);
      // console.log("Antes de asignar isParentesco:=>", dataBuscaAl);
      if (isParentesco) {
        const isSuplente = name === "al_idparentescosupl";
        const prefix = numValor === 1 ? "padre" : "madre"; // Determina si es padre o madre
        const source = isSuplente
          ? {
              rut: "apsu_rut",
              dv: "apsu_dv",
              nombres: "apsu_nombres",
              apat: "apsu_apat",
              amat: "apsu_amat",
              formatted: "ApsuRut",
            }
          : {
              rut: "ap_rut",
              dv: "ap_dv",
              nombres: "ap_nombres",
              apat: "ap_apat",
              amat: "ap_amat",
              formatted: "ApRut",
            };
        setDataBuscaAl((prev) => ({
          ...prev,
          [name]: value,
          [`${prefix}_rut`]: prev[source.rut],
          [`${prefix}_dv`]: prev[source.dv],
          [`${prefix}_nombres`]: prev[source.nombres],
          [`${prefix}_apat`]: prev[source.apat],
          [`${prefix}_amat`]: prev[source.amat],
          [`${prefix === "padre" ? "PadRut" : "MadRut"}`]:
            prev[source.formatted], // Formateado
        }));
      } else {
        setDataBuscaAl((prev) => ({ ...prev, [name]: value }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChangeRutAp = () => (event) => {
    const { name, value } = event.target;
    let tvalue = FmtoRut(value);

    // console.log(
    //   ` en handleChangeRutAp dataBuscaAl[${name}] tvalue = ${tvalue}`
    // );

    if (tvalue === 1 && tvalue === null) tvalue = "";

    if (tvalue != null) {
      var rut = parseInt(RutANumeros(tvalue), 10);
      var dv = tvalue.slice(-1).toUpperCase();

      const fieldMapping = {
        ApRut: { keyRut: "ap_rut", keyDv: "ap_dv" },
        ApsuRut: { keyRut: "apsu_rut", keyDv: "apsu_dv" },
        PadRut: { keyRut: "padre_rut", keyDv: "padre_dv" },
        MadRut: { keyRut: "madre_rut", keyDv: "madre_dv" },
      };

      if (fieldMapping[name]) {
        const { keyRut, keyDv } = fieldMapping[name];
        setDataBuscaAl((prev) => ({
          ...prev,
          [name]: tvalue,
          [keyRut]: rut,
          [keyDv]: dv,
        }));
      }
      if (refs[name]) {
        refs[name].current = tvalue; // Actualizamos el valor del ref
        // console.log(`Ref actualizado para ${name}: ${refs[name].current}`);
      }
    }
  };

  const validaRutApoderado = (name) => {
    const rutAp = dataBuscaAl[name];
    const indName = name === "ApRut" ? 1 : 2;

    if (rutAp.length <= 1) {
      setErrors({ ...errors, [name]: "Debe ingresar Rut válido" });
      return false;
    }
    // console.log("va a FValidarOtrosRut ");

    if (!FValidarOtrosRut(name, dataBuscaAl)) {
      setErrors({
        ...errors,
        [name]: "Debe ingresar Rut válido, Digito verificador",
      });
      return false;
    } else {
      setErrors({ ...errors, [name]: "" });
    }
    setMode(indName);
  };

  // useEffect(() => {
  //   if ([1, 2, 3, 4].includes(dataBuscaAl.swParentesco)) {
  //     console.log("ir a actualizar padre");
  //     setDataBuscaAl({ ...dataBuscaAl, swParentesco: 0 });
  //     actualizaPadres({
  //       dataBuscaAl,
  //       setDataBuscaAl,
  //       refs,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dataBuscaAl]);

  // console.log(" dataBuscaAl =>:", dataBuscaAl )
  if (!comunas || !parentescos || !dataBuscaAl) {
    return <div>Cargando...</div>;
  }

  return (
    <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}>
      <Grid item xs={12}>
        <Paper elevation={9} sx={{ px: 1, pb: 2, backgroundColor: "#efebe9" }}>
          <Grid container spacing={1.5}>
            <CustomGridSubtitulo texto={"Apoderado Titular"} />
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                id="idfRutAp"
                size="small"
                label="R.u.n. Apoderado Titular"
                variant="outlined"
                required
                fullWidth
                name="ApRut"
                value={dataBuscaAl.ApRut}
                onChange={handleChangeRutAp()}
                error={!!errors.ApRut}
                helperText={errors.ApRut}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Buscar Apoderado por el RUT">
                        <IconButton
                          onClick={() => {
                            validaRutApoderado("ApRut");
                          }}
                        >
                          <PersonSearchIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                id="ap_nombres"
                size="small"
                label="Nombres"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_nombres}
                onChange={handleChange("ap_nombres")}
                error={!!errors.ap_nombres}
                helperText={errors.ap_nombres}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Ap. Paterno"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_apat}
                onChange={handleChange("ap_apat")}
                error={!!errors.ap_apat}
                helperText={errors.ap_apat}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Ap. Materno"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_amat}
                onChange={handleChange("ap_amat")}
                error={!!errors.ap_amat}
                helperText={errors.ap_amat}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper
                elevation={3}
                style={{ width: "100%", alignItems: "center" }}
                sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
              >
                <FormControl
                  size="small"
                  sx={{ ml: 2 }}
                  error={!!errors.al_idparentesco}
                >
                  <FormLabel
                    id="apparentesco"
                    sx={{ mt: 1, ml: 2 }}
                    style={{ fontSize: "12px" }}
                  >
                    Parentesco
                  </FormLabel>

                  <Select
                    label="apparentesco"
                    value={dataBuscaAl.al_idparentesco}
                    onChange={handleChange("al_idparentesco")}
                    required
                    sx={{
                      minWidth: 200,
                      height: "35px",
                      fontSize: "12px",
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
                  <FormHelperText>{errors.al_idparentesco}</FormHelperText>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Teléfono 1"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_fono1}
                onChange={handleChange("ap_fono1")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Teléfono 2"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_fono2}
                onChange={handleChange("ap_fono2")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Emergencias"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_emergencia}
                onChange={handleChange("ap_emergencia")}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="email"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_email}
                onChange={handleChange("ap_email")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Domicilio"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.ap_domicilio}
                onChange={handleChange("ap_domicilio")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper
                elevation={3}
                style={{ width: "100%", alignItems: "center" }}
                sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
              >
                <FormControl
                  size="small"
                  sx={{ ml: 2 }}
                  error={!!errors.ap_id_comuna}
                >
                  <FormLabel
                    id="aptComuna"
                    sx={{ mt: 1, ml: 2 }}
                    style={{ fontSize: "12px" }} // Comuna del apoderado
                  >
                    Comuna
                  </FormLabel>

                  <Select
                    label="ComunasAp"
                    value={dataBuscaAl.ap_id_comuna}
                    onChange={handleChange("ap_id_comuna")}
                    required
                    sx={{
                      minWidth: 200,
                      height: "35px",
                      fontSize: "12px",
                    }}
                  >
                    {comunas.map((comuna) => (
                      <MenuItem key={comuna.id_comuna} value={comuna.id_comuna}>
                        {comuna.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.ap_id_comuna}</FormHelperText>
                </FormControl>
              </Paper>
            </Grid>
            <Divider
              sx={{
                borderBottomWidth: "2px", // Grosor de la línea
                borderColor: "blue", // Color de la línea
                marginY: 2,
              }}
            />
            <CustomGridSubtitulo texto={"Apoderado Suplente"} />
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                id="apSupRut"
                size="small"
                label="R.u.n. Apoderado Suplente"
                variant="outlined"
                required
                fullWidth
                value={dataBuscaAl.ApsuRut}
                name="ApsuRut"
                error={!!errors.ApsuRut}
                helperText={errors.ApsuRut}
                onChange={handleChangeRutAp()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Buscar Apoderado suplente por el RUT">
                        <IconButton
                          onClick={() => {
                            validaRutApoderado("ApsuRut");
                          }}
                        >
                          <PersonSearchIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
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
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Ap. Paterno"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_apat}
                onChange={handleChange("apsu_apat")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Ap. Materno"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_amat}
                onChange={handleChange("apsu_amat")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper
                elevation={3}
                style={{ width: "100%", alignItems: "center" }}
                sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
              >
                <FormControl
                  size="small"
                  sx={{ ml: 2 }}
                  error={!!errors.al_idparentescosupl}
                >
                  <FormLabel
                    id="apsu_parentesco"
                    sx={{ mt: 1, ml: 2 }}
                    style={{ fontSize: "12px" }}
                  >
                    Parentesco
                  </FormLabel>

                  <Select
                    label="apsu_parentesco"
                    value={dataBuscaAl.al_idparentescosupl}
                    onChange={handleChange("al_idparentescosupl")}
                    required
                    sx={{
                      minWidth: 200,
                      height: "35px",
                      fontSize: "12px",
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
                  <FormHelperText>{errors.al_idparentescosupl}</FormHelperText>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Teléfono 1"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_fono1}
                onChange={handleChange("apsu_fono1")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Teléfono 2"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_fono2}
                onChange={handleChange("apsu_fono2")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Emergencia"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_emergencia}
                onChange={handleChange("apsu_emergencia")}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="email"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_email}
                onChange={handleChange("apsu_email")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                size="small"
                label="Domicilio"
                variant="outlined"
                fullWidth
                value={dataBuscaAl.apsu_domicilio}
                onChange={handleChange("apsu_domicilio")}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper
                elevation={3}
                style={{ width: "100%", alignItems: "center" }}
                sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
              >
                <FormControl
                  size="small"
                  sx={{ ml: 2 }}
                  error={!!errors.apsu_id_comuna}
                >
                  <FormLabel
                    id="apsComuna"
                    sx={{ mt: 1, ml: 2 }}
                    style={{ fontSize: "12px" }} // Comuna ap. suplente
                  >
                    Comuna
                  </FormLabel>

                  <Select
                    label="ComunasApsU"
                    value={dataBuscaAl.apsu_id_comuna}
                    onChange={handleChange("apsu_id_comuna")}
                    required
                    sx={{
                      minWidth: 200,
                      height: "35px",
                      fontSize: "12px",
                    }}
                  >
                    {comunas.map((comuna) => (
                      <MenuItem key={comuna.id_comuna} value={comuna.id_comuna}>
                        {comuna.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.apsu_id_comuna}</FormHelperText>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {(mode === 1 || mode === 2) &&
        CargaDataFamiliaAp({
          jwt,
          dataBuscaAl,
          setDataBuscaAl,
          mode,
          setMode,
        })}
    </Grid>
  );
};

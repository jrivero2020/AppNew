import React, { useCallback, useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../../core/AuthProvider";
import { CargaDataFamiliaAp } from "./../../FichaAlumnos/CargaDataRutAlumno";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  FormHelperText,
  Typography,
  Divider,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { manejoCambiofRut, FValidarOtrosRut } from "./../../assets/js/FmtoRut";
// import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";
import { ValidaFichaAlumno } from "./helpers/ValidaFichaAlumno";
// import { MsgMuestraError } from "./../../assets/dialogs/MuestraError";
import { Box } from "@mui/system";
import { CustomGridSubtitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";

import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Tooltip from "@mui/material/Tooltip";

export const DatosApoderado = ({
  resultado,
  setResultado,
  comunas,
  parentescos,
}) => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [mode, setMode] = useState(0);

  const buscarFamiliaActiva = () =>
    ["", "BuscaAp", "BuscaApSup", "BuscaPadre", "BuscaMadre"].some(
      (key) => resultado[key] === 1
    );

  const handleChange = useCallback(
    (name, curso) => (event) => {
      const { value } = event.target;
      // Validar el campo
      const error = ValidaFichaAlumno(name, value, curso);
      setDataBuscaAl((prev) => ({ ...prev, [name]: value }));
      setErrors({ ...errors, [name]: error });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const validaRutApoderado = (name, resultado, setResultado) => {
    const rutAp = resultado[name];
    const indName = name === "ApRut" ? 1 : 2;

    if (rutAp.length <= 1) {
      setErrors({ ...errors, [name]: "Debe ingresar Rut válido" });
      console.log("rutAp :", rutAp);
      return false;
    }
    if (!FValidarOtrosRut(name, resultado, setResultado)) {
      setErrors({ ...errors, [name]: "Debe ingresar Rut válido" });
      return false;
    }
    setMode(indName);
  };

  if (!comunas || !parentescos || !dataBuscaAl || !resultado) {
    return <div>Cargando...</div>;
  }
  // console.log(" dataBuscaAl =>:", dataBuscaAl )
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
                value={resultado.ApRut}
                onChange={manejoCambiofRut("ApRut", resultado, setResultado)}
                error={!!errors.ApRut}
                helperText={errors.ApRut}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Buscar Apoderado por el RUT">
                        <IconButton
                          onClick={() => {
                            validaRutApoderado(
                              "ApRut",
                              resultado,
                              setResultado
                            );
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
                value={resultado.ApsuRut}
                error={!!errors.ApsuRut}
                helperText={errors.ApsuRut}
                onChange={manejoCambiofRut("ApsuRut", resultado, setResultado)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Buscar Apoderado suplente por el RUT">
                        <IconButton
                          onClick={() => {
                            validaRutApoderado(
                              "ApsuRut",
                              resultado,
                              setResultado
                            );
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
          resultado,
          setResultado,
          jwt,
          dataBuscaAl,
          setDataBuscaAl,
          mode,
          setMode,
        })}
    </Grid>
  );
};

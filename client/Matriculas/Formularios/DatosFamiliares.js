import React, { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../core/AuthProvider";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { CargaDataFamiliaAp } from "./../../FichaAlumnos/CargaDataRutAlumno";
import Tooltip from "@mui/material/Tooltip";

import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  FormHelperText,
  Divider,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";

import { ValidaFichaAlumno } from "./helpers/ValidaFichaAlumno";
import { manejoCambiofRut, FValidarOtrosRut } from "./../../assets/js/FmtoRut";

import { CustomGridSubtitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";
export const DatosFamiliares = ({
  resultado,
  setResultado,
  cursos,
  comunas,
  parentescos,
}) => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(0);

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
  const validaRutPadres = (name, resultado, setResultado) => {
    const nameMapping = {
      ApRut: 1,
      ApsuRut: 2,
      PadRut: 3,
      MadRut: 4,
    };

    // Obtenemos el índice correspondiente o un valor predeterminado
    const indName = nameMapping[name] || 0; // 0 si 'name' no está en el mapeo
    const rutName = resultado[name];

    if (rutName.length <= 1) {
      setErrors({ ...errors, [name]: "Debe ingresar Rut válido" });
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

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
      >
        <Grid item xs={12}>
          <Paper
            elevation={9}
            sx={{ px: 1, pb: 2, backgroundColor: "#efebe9" }}
          >
            <Grid container spacing={1.5}>
              <CustomGridSubtitulo texto={"Antecedentes del padre"} />
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id="rutpadre"
                  size="small"
                  label="R.u.n. Padre"
                  variant="outlined"
                  required
                  fullWidth
                  value={resultado.PadRut}
                  onChange={manejoCambiofRut(
                    "PadRut",
                    resultado,
                    setResultado,
                    dataBuscaAl,
                    setDataBuscaAl
                  )}
                  error={!!errors.PadRut}
                  helperText={errors.PadRut}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Buscar Padre por el RUT">
                          <IconButton
                            onClick={() => {
                              validaRutPadres(
                                "PadRut",
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
                  id="pad_nombres"
                  size="small"
                  label="Nombres"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_nombres}
                  onChange={handleChange("padre_nombres")}
                  error={!!errors.padre_nombres}
                  helperText={errors.padre_nombres}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Paterno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_apat}
                  onChange={handleChange("padre_apat")}
                  error={!!errors.padre_apat}
                  helperText={errors.padre_apat}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Materno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_amat}
                  onChange={handleChange("padre_amat")}
                  error={!!errors.padre_amat}
                  helperText={errors.padre_amat}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Estudios"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_estudios}
                  onChange={handleChange("padre_estudios")}
                  error={!!errors.padre_estudios}
                  helperText={errors.padre_estudios}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ocupación"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_ocupacion}
                  onChange={handleChange("padre_ocupacion")}
                  error={!!errors.padre_ocupacion}
                  helperText={errors.padre_ocupacion}
                />
              </Grid>
              <CustomGridSubtitulo texto={"Antecedentes de la Madre"} />
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id="rutmadre"
                  size="small"
                  label="R.u.n. Madre"
                  variant="outlined"
                  required
                  fullWidth
                  value={resultado.MadRut}
                  onChange={manejoCambiofRut(
                    "MadRut",
                    resultado,
                    setResultado,
                    dataBuscaAl,
                    setDataBuscaAl
                  )}
                  error={!!errors.MadRut}
                  helperText={errors.MadRut}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Buscar Madre por el RUT">
                          <IconButton
                            onClick={() => {
                              validaRutPadres(
                                "MadRut",
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
                  id="madrenom"
                  size="small"
                  label="Nombres"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.madre_nombres}
                  onChange={handleChange("madre_nombres")}
                  error={!!errors.madre_nombres}
                  helperText={errors.madre_nombres}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Paterno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.madre_apat}
                  onChange={handleChange("madre_apat")}
                  error={!!errors.madre_apat}
                  helperText={errors.madre_apat}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Materno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.madre_amat}
                  onChange={handleChange("madre_amat")}
                  error={!!errors.madre_amat}
                  helperText={errors.madre_amat}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Estudios"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.madre_estudios}
                  onChange={handleChange("madre_estudios")}
                  error={!!errors.madre_estudios}
                  helperText={errors.madre_estudios}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ocupación"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.madre_ocupacion}
                  onChange={handleChange("madre_ocupacion")}
                  error={!!errors.madre_ocupacion}
                  helperText={errors.madre_ocupacion}
                />
              </Grid>
              <CustomGridSubtitulo texto={"Otros"} />

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id="ingfamiliar"
                  size="small"
                  label="Ingreso del Grupo Familiar: $ "
                  variant="outlined"
                  required
                  fullWidth
                  value={dataBuscaAl.al_ingresogrupofamiliar}
                  onChange={handleChange("al_ingresogrupofamiliar")}
                  error={!!errors.al_ingresogrupofamiliar}
                  helperText={errors.al_ingresogrupofamiliar}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Grid item>
                  <Paper
                    elevation={3}
                    style={{ width: "100%", alignItems: "center" }}
                    sx={{ pd: 2, backgroundColor: "#efebe9" }}
                  >
                    <FormControl
                      size="small"
                      sx={{ ml: 2 }}
                      error={!!errors.al_vivienda}
                    >
                      <FormLabel
                        id="vivienda"
                        sx={{ mt: 1, ml: 2 }}
                        style={{ fontSize: "12px" }}
                      >
                        Vivienda
                      </FormLabel>

                      <RadioGroup
                        row
                        aria-labelledby="CasaProp"
                        name="rbCasa"
                        size="small"
                        value={dataBuscaAl.al_vivienda}
                        onChange={handleChange("al_vivienda")}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio size="small" />}
                          label="Propia"
                        />
                        <FormControlLabel
                          value="2"
                          control={<Radio size="small" />}
                          label="Cedida"
                        />
                        <FormControlLabel
                          value="3"
                          control={<Radio size="small" />}
                          label="Arrendada"
                        />
                        <FormControlLabel
                          value="4"
                          control={<Radio size="small" />}
                          label="Allegados"
                        />
                      </RadioGroup>
                      <FormHelperText>{errors.al_vivienda}</FormHelperText>
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{ width: "100%", alignItems: "center" }}
                  sx={{ pd: 2, backgroundColor: "#efebe9" }}
                >
                  <FormControl
                    size="small"
                    sx={{ ml: 2 }}
                    error={!!errors.al_evaluareligion}
                  >
                    <FormLabel
                      id="religion"
                      sx={{ mt: 1, ml: 2, mb: 3 }}
                      style={{ fontSize: "12px" }}
                    >
                      Autorizo que mi hijo sea evaluado en religión &nbsp;&nbsp;
                    </FormLabel>

                    <RadioGroup
                      row
                      aria-labelledby="autorizo"
                      name="rbAutReligion"
                      size="small"
                      value={dataBuscaAl.al_evaluareligion}
                      onChange={handleChange("al_evaluareligion")}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio size="small" />}
                        label="Sí"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                    <FormHelperText>{errors.al_genero}</FormHelperText>
                  </FormControl>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {(mode === 3 || mode === 4) &&
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
    </>
  );
};

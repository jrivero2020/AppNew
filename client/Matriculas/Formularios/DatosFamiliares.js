import React, { useCallback, useContext, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../../core/AuthProvider";
import { CargaDataApoderado } from "./../../FichaAlumnos/CargaDataRutAlumno";

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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";
import { ValidaFichaAlumno } from "./helpers/ValidaFichaAlumno";
// import { MsgMuestraError } from "./../../assets/dialogs/MuestraError";
import { Box } from "@mui/system";
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
  const [snackbar, setSnackbar] = useState(null);

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
                  value={dataBuscaAl.padre_rut}
                  onChange={handleChange("padre_rut")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
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
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Paterno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.padre_apat}
                  onChange={handleChange("padre_apat")}
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
                />
              </Grid>
              <CustomGridSubtitulo texto={"Antecedentes de la Madre"} />
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  id="idfRutAp"
                  size="small"
                  label="R.u.n. Madre"
                  variant="outlined"
                  required
                  fullWidth
                  value={dataBuscaAl.madre_rut}
                  onChange={handleChange("madre_rut")}
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
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Grid item>
                  <Paper
                    elevation={3}
                    style={{ width: "100%", alignItems: "center" }}
                    sx={{ pd: 2, backgroundColor: "#efebe9" }}
                  >
                    <FormControl size="small" sx={{ ml: 2 }}>
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
                  <FormControl size="small" sx={{ ml: 2 }}>
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
                  </FormControl>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

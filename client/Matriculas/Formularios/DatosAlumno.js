import React, { useCallback, useContext, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../../core/AuthProvider";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import { FmtoRut } from "./../../assets/js/FmtoRut";
import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";
import { ValidaFichaAlumno } from "./helpers/ValidaFichaAlumno";
import { MsgMuestraError } from "./../../assets/dialogs/MuestraError";

export const DatosAlumno = ({ resultado, setResultado, cursos, comunas }) => {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState(null);

  const verRut = FmtoRut(dataBuscaAl.al_rut + dataBuscaAl.al_dv);

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

  const validateFormAlumno = () => {
    const camposExcluidos = [
      "al_rut",
      "al_dv",
      "al_activo",
      "al_agno_matricula",
      "al_cod_ense",
      "al_cod_grado",
      "al_evaluareligion",
      "al_fecharetiro",
      "al_fincorpora",
      "al_id_alumno",
      "al_ingresogrupofamiliar",
      "al_letra",
      "al_motivoretiro",
      "al_nro_matricula",
      "al_nrofamiliar",
    ];

    /*
Object.keys(dataBuscaAl)
  .filter((key) => key.startsWith("al_") && !camposExcluidos.includes(key))
  .forEach((key) => {
    const error = validateField(key, dataBuscaAl[key]);
    console.log(`Campo: ${key}, Error: ${error}`);
  });
*/

    const newErrors = {};
    Object.keys(dataBuscaAl)
      .filter((key) => key.startsWith("al_") && !camposExcluidos.includes(key))
      .forEach((key) => {
        const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
        console.log(
          "Recorriendo databuscaal key",
          key,
          " dataBuscaAl[",
          key,
          "]  =>",
          dataBuscaAl[key]
        );
        if (error) {
          newErrors[key] = error;
        }
      });

    setErrors(newErrors);

    // Retornar verdadero si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  const GrabarAlumno = (resultado, setResultado) => {
    console.log("estoy en grabaralumno");
    if (validateFormAlumno()) {
      api_CreaModificaAlumno(
        { al_rut: dataBuscaAl.al_rut },
        { t: jwt.token },
        dataBuscaAl
      ).then((data) => {
        console.log("api_CreaModificaAlumno, retorno en data ===>", data);
        if (data && data.error) {
          setResultado({ ...resultado, result: 11 });
          return false;
        } else {
          setSnackbar({
            mensaje: "Datos se grabaron",
            severity: "success",
            variant: "filled",
          });
        }
      });
    } else {
      setSnackbar({
        mensaje: "Hay Errores en el formulario",
        severity: "error",
        variant: "filled",
      });
    }
  };

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
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="R.u.n. Alumno"
                  variant="outlined"
                  fullWidth
                  value={verRut}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Nombres"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_nombres}
                  onChange={handleChange("al_nombres")}
                  error={!!errors.al_nombres}
                  helperText={errors.al_nombres}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Paterno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_apat}
                  onChange={handleChange("al_apat")}
                  error={!!errors.al_apat}
                  helperText={errors.al_apat}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Ap. Materno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_amat}
                  onChange={handleChange("al_amat")}
                  error={!!errors.al_amat}
                  helperText={errors.al_amat}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{
                    width: "100%",
                    alignItems: "center",
                    backgroundColor: "#efebe9",
                  }}
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
                      value={dataBuscaAl.al_idcurso}
                      onChange={handleChange("al_idcurso")}
                      required
                      sx={{
                        minWidth: 200,
                        height: "35px",
                        fontSize: "12px",
                      }}
                    >
                      {cursos !== null &&
                        cursos.map((curso, index) => (
                          <MenuItem key={index} value={curso.id_curso}>
                            {curso.nomlargo}
                          </MenuItem>
                        ))}
                    </Select>
                    {/*
                    {errors.al_idcurso && (
                      <FormHelperText>{errors.al_idcurso}</FormHelperText>
                    )}
                    */}
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Fecha Nacimiento"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={dataBuscaAl.al_f_nac}
                  onChange={handleChange("al_f_nac", dataBuscaAl.al_idcurso)}
                  error={!!errors.al_f_nac}
                  helperText={errors.al_f_nac}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper elevation={3} sx={{ px: 2, backgroundColor: "#efebe9" }}>
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
                      value={dataBuscaAl.al_genero}
                      size="small"
                      onChange={handleChange("al_genero")}
                    >
                      <FormControlLabel
                        value="M"
                        control={<Radio size="small" />}
                        label="Masculino"
                      />
                      <FormControlLabel
                        value="F"
                        control={<Radio size="small" />}
                        label="Femenino"
                      />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Domicilio"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_domicilio}
                  onChange={handleChange("al_domicilio")}
                  error={!!errors.al_domicilio}
                  helperText={errors.al_domicilio}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{ width: "100%", alignItems: "center" }}
                  sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
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
                      value={dataBuscaAl.al_id_comuna}
                      onChange={handleChange("al_id_comuna")}
                      required
                      sx={{
                        minWidth: 200,
                        height: "35px",
                        fontSize: "12px",
                      }} // Comunas del alumnos
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

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Colegio Origen"
                  variant="outlined"
                  value={dataBuscaAl.al_procedencia}
                  fullWidth
                  onChange={handleChange("al_procedencia")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Promedio de Notas"
                  variant="outlined"
                  value={dataBuscaAl.al_promedionota}
                  fullWidth
                  onChange={handleChange("al_promedionota")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{ width: "100%", alignItems: "center" }}
                  sx={{ mb: 2, pb: 2, backgroundColor: "#efebe9" }}
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
                      size="small"
                      value={dataBuscaAl.al_cur_repe}
                      onChange={handleChange("al_cur_repe")}
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

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  style={{ width: "100%", alignItems: "center" }}
                  sx={{ pd: 2, backgroundColor: "#efebe9" }}
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
                      size="small"
                      value={dataBuscaAl.al_idvivecon}
                      onChange={handleChange("al_idvivecon")}
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
              {dataBuscaAl.al_idvivecon === "4" && (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    sx={{ mt: 1 }}
                    label="Describa Con quién vive"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={dataBuscaAl.al_descripcionvivecon}
                    onChange={handleChange("al_descripcionvivecon")}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  sx={{ pd: 2, backgroundColor: "#efebe9" }}
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
                      size="small"
                      value={dataBuscaAl.al_enfermo}
                      onChange={handleChange("al_enfermo")}
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

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Cuidados especiales"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_cuidados}
                  onChange={handleChange("al_cuidados")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Nº Hermanos"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_canthnos}
                  onChange={handleChange("al_canthnos")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Su Ubicación entre ellos"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_nroentrehnos}
                  onChange={handleChange("al_nroentrehnos")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="Nº Hermanos Estudian aquí"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_hnosaca}
                  onChange={handleChange("al_hnosaca")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  size="small"
                  label="En qué Cursos estudian"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_hnoscursos}
                  onChange={handleChange("al_hnoscursos")}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* **********************************************fin**/}
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
            onClick={() => GrabarAlumno({ resultado, setResultado })}
          >
            Grabar datos Alumno
          </Button>
        </Grid>
      </Grid>
      {snackbar && MsgMuestraError({ snackbar, setSnackbar })}
    </>
  );
};

/*
  const GrabarAlumno = (resultado, setResultado, dataBuscaAl.al_idcurso) => {

al_rut,
al_dv,
al_activo,
al_agno_matricula,
al_cod_ense,
al_cod_grado,
al_evaluareligion,
al_fecharetiro,
al_fincorpora,
al_id_alumno,
al_ingresogrupofamiliar,
al_letra,
al_motivoretiro,
al_nro_matricula,
al_nrofamiliar,
*/

import React, { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Tooltip from "@mui/material/Tooltip";
import { FmtoRut, RutANumeros, validarRut } from "./../assets/js/FmtoRut";
import { getDataProfe } from "./../docentes/api-docentes";
import { CustomGridTitulo } from "./../assets/componentes/customGridPaper/customVerAlumnos";

const Inscripcion = () => {
  const vProfe = {
    rut: "",
    dv: "",
    nombres: "",
    apat: "",
    amat: "",
    fono: "",
    email: "",
    funcion: "",
    password: "",
    password2: "",
  };

  const [dataProfe, setDataProfe] = useState(vProfe);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [showPassword, setShowPassword] = useState({
    password: false,
    password2: false,
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Manejar el estado de visualización de contraseña
  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  // Registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataProfe }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Usuario registrado exitosamente.");
        setError(false);
        setErrors({});
      } else {
        setMessage(data.message || "Error al registrar el usuario.");
        setError(true);
      }
    } catch (err) {
      setMessage("Error al conectarse con el servidor.");
      setError(true);
    }
  };

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    setDataProfe((prev) => ({ ...prev, [name]: value }));

    // Validación inmediata para el campo contraseña 2
    if (name === "password2" && dataProfe.password) {
      validatePasswords(value);
    }
  };

  const handleChgRut = (event) => {
    let tvalue = FmtoRut(event.target.value);
    if (dataProfe.rut.length === 1 && tvalue === null) tvalue = "";
    console.log("Solito el tvalue:", tvalue);
    if (tvalue != null) {
      var rut = parseInt(RutANumeros(tvalue), 10);
      var dv = tvalue.slice(-1).toUpperCase();
      console.log("Rut:", rut, "  dv:", dv, "    tvalue:", tvalue);

      setDataProfe((prev) => ({ ...prev, rut: tvalue }));
    }
  };

  const traerDataProfe = async () => {
    const lRut = dataProfe.rut;
    const rut = parseInt(RutANumeros(lRut), 10);
    if (!validarRut(lRut)) {
      setSnackbarMessage("Rut ingresado erróneo");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const bloquesData = await getDataProfe({ rut: rut });
      setDataProfe({ ...bloquesData[0], password: "", password2: "" });
      const fmtoRut = FmtoRut(bloquesData[0].rut + bloquesData[0].dv);
      setDataProfe((prev) => ({ ...prev, rut: fmtoRut }));
    } catch (error) {
      setSnackbarMessage("Error cargando  Data profes");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validatePasswords = (password2Value = dataProfe.password2) => {
    if (dataProfe.password && password2Value) {
      if (dataProfe.password !== password2Value) {
        setErrors((prev) => ({
          ...prev,
          password2: "Las contraseñas no coinciden",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password2;
          setIsSubmitDisabled(false);
          return newErrors;
        });
      }
    }
  };
  // Bloquear pegado
  const handlePaste = (e) => {
    e.preventDefault();
    setErrors({ ...errors, password2: "No está permitido pegar texto" });
  };

  useEffect(() => {
    // Validar solo si ambos campos tienen contenido
    if (dataProfe.password && dataProfe.password2) {
      const passwordsMatch = validatePasswords();
      setIsSubmitDisabled(!passwordsMatch);
    } else {
      // Deshabilitar si alguno de los campos está vacío
      setIsSubmitDisabled(true);
    }
  }, [dataProfe.password, dataProfe.password2]);

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ paddingTop: "68px" }}>
        <CustomGridTitulo
          titulo={"INSCRIPCIÓN A INTRANET"}
          color={"#FFFFFF"}
          backGround={"#1976d2"}
        />
        {/* *********************************************************** */}
        <Paper
          elevation={8}
          sx={{
            pb: 3,
            pt: 2,
            backgroundColor: "#efebe9",
            margin: "auto",
            maxWidth: "95%",
            mt: 3,
          }}
        >
          <Grid
            container
            spacing={2}
            rowSpacing={2}
            sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
          >
            <Grid item xs={12} sm={3}>
              <TextField
                id="idfRutAp"
                size="small"
                label="R.u.n. Funcionario"
                variant="outlined"
                required
                fullWidth
                name="Rut"
                value={dataProfe.rut}
                onChange={handleChgRut}
                error={!!errors.Rut}
                helperText={errors.Rut}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Buscar Funcionario por el RUT">
                        <IconButton
                          onClick={() => {
                            traerDataProfe("Rut");
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

            <Grid item xs={12} sm={3}>
              <TextField
                id="ap_nombres"
                size="small"
                label="Nombres"
                variant="outlined"
                fullWidth
                value={dataProfe.nombres}
                onChange={handleChange("nombres")}
                error={!!errors.nombres}
                helperText={errors.nombres}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Ap. Paterno"
                variant="outlined"
                fullWidth
                value={dataProfe.apat}
                onChange={handleChange("apat")}
                error={!!errors.apat}
                helperText={errors.apat}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                size="small"
                label="Ap. Materno"
                variant="outlined"
                fullWidth
                value={dataProfe.amat}
                onChange={handleChange("amat")}
                error={!!errors.amat}
                helperText={errors.amat}
                disabled={true}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            rowSpacing={2}
            sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Teléfono"
                variant="outlined"
                fullWidth
                value={dataProfe.fono}
                onChange={handleChange("fono")}
                error={!!errors.fono}
                helperText={errors.fono}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Email"
                variant="outlined"
                fullWidth
                value={dataProfe.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            rowSpacing={2}
            sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
          >
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Función"
                variant="outlined"
                fullWidth
                value={dataProfe.funcion}
                onChange={handleChange("funcion")}
                error={!!errors.funcion}
                helperText={errors.funcion}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            rowSpacing={2}
            sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Clave"
                variant="outlined"
                fullWidth
                type={showPassword.password ? "text" : "password"}
                value={dataProfe.password}
                onChange={handleChange("password")}
                onPaste={handlePaste}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("password")}
                        edge="end"
                      >
                        {showPassword.password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Confirme Clave"
                variant="outlined"
                type={showPassword.password2 ? "text" : "password"}
                fullWidth
                value={dataProfe.password2}
                onChange={handleChange("password2")}
                onPaste={handlePaste}
                error={!!errors.password2}
                helperText={
                  errors.password2 ||
                  (dataProfe.password2 &&
                  dataProfe.password !== dataProfe.password2
                    ? "Las contraseñas no coinciden"
                    : "")
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("password2")}
                        edge="end"
                      >
                        {showPassword.password2 ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            rowSpacing={2}
            sx={{ margin: "auto", maxWidth: "95%", mt: 3 }}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitDisabled}
                sx={{ mt: 2 }}
              >
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* Snackbar para mensajes */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          slotProps={{
            root: {
              // Solución definitiva para MUI v6
              ownerState: undefined,
              component: "div",
            },
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </form>
  );
};

export default Inscripcion;

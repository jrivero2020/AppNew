import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import { signin } from "./api-auth";
import auth from "./auth-helper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { FormControl, InputLabel, OutlinedInput, Paper } from "@mui/material";
import { Copyright } from "./../assets/js/CopyRight";
import { AuthContext } from "./../core/AuthProvider";

// import Menu from "./../core/menuCLC";
// import Carousel from "react-material-ui-carousel";

const theme = createTheme({
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: 2,
    color: "#3f4771",
  },
  textField: {
    marginLeft: 1,
    marginRight: 1,
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: 2,
  },
});

//const theme = theme();

export default function Signin(props) {
  const {
    isAuthenticated,
    setIsAuthenticated,
    isJwtRol,
    setIsJwtRol,
    jwt,
    setJwt,
  } = useContext(AuthContext);
  //const [isJwtRol, setIsJwtRol] = useContext(AuthContext);

  const navigate = useNavigate();
  let { useParam } = useParams();

  const [valores, setValores] = useState({
    nombre_usuario: "",
    password: "",
    error: "",
    redirige: false,
  });

  const handleChange = (name) => (event) => {
    setValores({ ...valores, [name]: event.target.value });
  };

  const msgErrorNull = () => {
    setValores({ ...valores, error: "" });
  };

  const clickSubmit = (event) => {
    event.preventDefault();

    const user = {
      nombre_usuario: valores.nombre_usuario || undefined,
      password: valores.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValores({ ...valores, error: data.error });
        setIsAuthenticated(false);
        setIsJwtRol(false);
      } else {
        auth.authenticate(data, () => {
          setValores({
            ...valores,
            error: "",
            redirige: true,
            password: false,
          });
        });
        setIsAuthenticated(true);
        setIsJwtRol(data.user);
        // console.log("Reorno de endPoint data:", data, "  data.user:", data.user)
        setJwt(auth.isAuthenticated());
      }
    });
  };
  useEffect(() => {
    if (valores.redirige && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, valores, navigate]);
  return (
    <ThemeProvider theme={theme}>
       <div style={{ paddingTop: "99px" }}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      
      {/* Contenedor principal con Paper */}
      <Paper
        elevation={3}
        sx={{
          marginTop: { xs: 4, sm: 8 },
          padding: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          paddingTop: "88px"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5">
          Ingreso
        </Typography>
  
        {/* Formulario como componente de Paper */}
        <Paper 
          component="form" 
          noValidate 
          sx={{ 
            mt: 3, 
            width: "100%",
            padding: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="usuario"
                required
                fullWidth
                id="nombre_usuario"
                label="Rut de Usuario"
                value={valores.name}
                onChange={handleChange("nombre_usuario")}
                onFocus={msgErrorNull}
                autoFocus
              />
            </Grid>
  
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="password">Clave</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={valores.password}
                  onChange={handleChange("password")}
                  onFocus={msgErrorNull}
                  label="Clave"
                  autoComplete="new-password"
                />
              </FormControl>
            </Grid>
  
            {valores.error && (
              <Grid item xs={12}>
                <Typography component="p" color="error" sx={{ display: "flex", alignItems: "center" }}>
                  <Icon color="error" sx={{ mr: 1 }}>error</Icon>
                  {valores.error}
                </Typography>
              </Grid>
            )}
          </Grid>
  
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, py: 1.5 }}
            onClick={clickSubmit}
          >
            Ingresar
          </Button>
        </Paper>
      </Paper>
      
      <Copyright sx={{ mt: 3, mb: 2 }} />
    </Container>
    </div>
  </ThemeProvider>
  );
}

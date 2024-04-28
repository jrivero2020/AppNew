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
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          style={{ paddingTop: "88px" }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingreso
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="usuario"
                  required
                  fullWidth
                  id="nombre_usuario"
                  label="Nombre de Usuario"
                  value={valores.name}
                  onChange={handleChange("nombre_usuario")}
                  onFocus={msgErrorNull}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: "45ch" }} variant="outlined">
                  <InputLabel htmlFor="password">Clave </InputLabel>
                  <OutlinedInput
                    id="password"
                    type="password"
                    value={valores.password}
                    onChange={handleChange("password")}
                    onFocus={msgErrorNull}
                    label="Clave"
                  />
                </FormControl>
              </Grid>
              {valores.error && (
                <Typography component="p" color="error">
                  <Icon color="error">error</Icon>
                  {valores.error}
                </Typography>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={clickSubmit}
            >
              Ingresar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

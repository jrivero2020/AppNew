import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Icon from '@mui/material/Icon'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { inscribe } from "./api-usuario";
import { useState } from "react";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const theme = createTheme(
  {

    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: 2,
      color: '#3f4771'
    },
    textField: {
      marginLeft: 1,
      marginRight: 1,
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: 2
    }
  }
)

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://losconquistadorescerrillos.com/">
        Los Conquistadores
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//const theme = theme();

export default function Inscripcion() {

  const [valores, setValores] = useState({
    NombreUsuario: '',
    password: '',
    password2: '',
    open: false,
    error: '',
    showPassword: false

  })

  const handleChange = name => event => {
    setValores({ ...valores, [name]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValores({
      ...valores,
      showPassword: !valores.showPassword,
    });
  };

  const msgErrorNull = () => {
    setValores({ ...valores, error: '' })
  }

  const clickSubmit = (event) => {
    event.preventDefault();

    const user = {
      NombreUsuario: valores.NombreUsuario || undefined,
      password: valores.password || undefined,
    }
    const grabarOk = {
      grabar: true
    }
    if (valores.password !== valores.password2) {
      setValores({ ...valores, error: "Claves no coinciden !!" })
      grabarOk.grabar = false
      
    }
    if (!valores.password || !valores.password2 || !valores.NombreUsuario) {
      setValores({ ...valores, error: "Debe llenar todos los datos !!" })
      grabarOk.grabar = false
    }

    if (grabarOk.grabar) {
      inscribe(user).then((data) => {
        if (data.error) {
          setValores({ ...valores, error: data.error })
        } else {
          setValores({ ...valores, error: '', open: true })
        }
      }
      )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs"  >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inscripción
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="usuario"
                  required
                  fullWidth
                  id="nombreusuario"
                  label="Nombre de Usuario"
                  value={valores.name} onChange={handleChange('NombreUsuario')}
                  onFocus={msgErrorNull}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: '45ch' }} variant="outlined">
                  <InputLabel htmlFor="password">Clave </InputLabel>
                  <OutlinedInput
                    id="password"
                    type={valores.showPassword ? 'text' : 'password'}
                    value={valores.password}
                    onChange={handleChange('password')}
                    onFocus={msgErrorNull}

                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Ver la clave"
                          onClick={handleClickShowPassword}

                          edge="end"
                        >
                          {valores.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Clave" 
                  />
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <FormControl sx={{ m: 2, width: '45ch' }} variant="outlined">
                  <InputLabel htmlFor="password2">Reingrese Clave </InputLabel>
                  <OutlinedInput
                    id="password2"
                    type={valores.showPassword ? 'text' : 'password'}
                    value={valores.password2}
                    onChange={handleChange('password2')}
                    onFocus={msgErrorNull}

                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Ver la clave"
                          onClick={handleClickShowPassword}

                          edge="end"
                        >
                          {valores.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Reingrese Clave" 
                  />
                </FormControl>
              </Grid>


              {
                valores.error &&
                (<Typography component="p" color="error">
                  <Icon color="error">error</Icon>
                  {valores.error}</Typography>
                )
              }
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={clickSubmit}
            >
              Inscribirse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Ya tiene una cuenta? Ingrese
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

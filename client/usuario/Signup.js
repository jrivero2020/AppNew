import React, { useEffect } from "react";
import {
    Card, CardContent, Icon, TextField, Typography, CardActions, Button, Dialog,
    DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Box
} from "@mui/material";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { inscribe } from './../usuario/api-usuario';
import Item from "../core/Item";
import { FmtoRut, validarRut, QuitaPuntos } from "../assets/js/FmtoRut";
import CheckIcon from '@mui/icons-material/Check';
import GppBadIcon from '@mui/icons-material/GppBad';

export default function Signup() {
    const [valores, setValores] = useState({
        NombreUsuario: '',
        Correo: '',
        password: '',
        apat: '',
        amat: '',
        nombres: '',
        rut: '',
        dv: '',
        rol: 2,
        open: false,
        error: ''
    })
    const [validations, setValidations] = useState({
        NombreUsuario: false,
        Correo: false,
        password: false,
        apat: false,
        amat: false,
        nombres: false,
        rut: false,
    });

    const [fRut, setfRut] = useState('')

    const handleChange = name => event => {
        setValores({ ...valores, [name]: event.target.value })
    }
    const handleBlur = (campo) => () => {
        setValidations({ ...validations, [campo]: validateField(campo) });
    };

    const manejoCambiofRut = name => event => {
        let tvalue = FmtoRut(event.target.value)
        if (fRut.length == 1 && tvalue == null)
            tvalue = ""

        if (tvalue != null) {
            setfRut(tvalue)
        }
    }

    const validateField = (campo) => {
        // Aquí puedes realizar tus validaciones personalizadas para cada campo
        // Por ejemplo:
        if (campo === 'NombreUsuario' && valores.NombreUsuario.trim() === '' || valores.NombreUsuario.length < 5) {
            return false;
        }
        if (campo === 'password' && valores.password.length < 3) {
            console.log("Password ??: ", valores.password.length)
            return false;
        }
        return true;
    };


    const actualizaValores = () => {
        setValores({ ...valores, rut: QuitaPuntos(fRut.slice(0, -1)), dv: fRut.slice(-1) })

    }

    const clickSubmit = (event) => {
        event.preventDefault();

        if (!validarRut(fRut)) {
            alert('Rut ingresado erróneo')
            return
        }
        actualizaValores()

        const user = {
            NombreUsuario: valores.NombreUsuario || undefined,
            Correo: valores.Correo || undefined,
            password: valores.password || undefined,
            apat: valores.apat || undefined,
            amat: valores.amat || undefined,
            nombres: valores.nombres || undefined,
            rut: QuitaPuntos(fRut.slice(0, -1)) || undefined,
            dv: fRut.slice(-1) || undefined,
            rol: valores.rol || undefined,
        }
        console.log("Const user====>:", user)
        if (
            user.NombreUsuario === undefined ||
            user.Correo === undefined || user.password === undefined ||
            user.apat === undefined || user.amat === undefined ||
            user.nombres === undefined || user.rut === undefined ||
            user.dv === undefined || user.rol === undefined
        ) {
            alert('Por favor, complete todos los campos');
            return
        }

        inscribe(user).then((data) => {

            console.log("Ensignup, inscribe==>", data.error)

            if (data.error) {
                setValores({ ...valores, error: data.error })
            } else {
                setValores({ ...valores, error: '', open: true })
            }
        })
    }
    return (
        <Grid container rowSpacing={1} sx={{
            paddingTop: '100px',
            alignItems: 'center', justifyContent: 'center', margin: 'auto',
            maxWidth: '65%'
        }} >
            <Grid item xs={12}>
                <Item >
                    <Typography variant="h5" gutterBottom sx={{ color: 'blue' }}>
                        Registro de Usuarios al Sistema
                    </Typography>
                </Item>
                <br />
                <br />
            </Grid>


            <Grid item xs={4}>
                <TextField
                    label="Nombre usuario"
                    variant="outlined"
                    fullWidth
                    value={valores.name} onChange={handleChange('NombreUsuario')}
                    onBlur={handleBlur('NombreUsuario')}
                    error={!validations.NombreUsuario}
//                    helperText={ !validations.NombreUsuario ? 'Este valor debe tener al menos 8 caracteres' : ''}
                    InputProps={{
                        endAdornment: validations.NombreUsuario ? <CheckIcon color="success" /> : <GppBadIcon color="error" />,
                    }}

                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Contraseña"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={valores.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={!validations.password}
  //                  helperText={!validations.password ? 'Este valor debe tener al menos 5 caracteres' : ''}
                    InputProps={{
                        endAdornment: validations.password && <CheckIcon color="success" />,
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Repita Contraseña"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={valores.password}
                    onChange={handleChange('password')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Correo electrónico"
                    variant="outlined"
                    fullWidth
                    value={valores.Correo}
                    onChange={handleChange('Correo')}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Nombres"
                    variant="outlined"
                    fullWidth
                    value={valores.nombres}
                    onChange={handleChange('nombres')}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Apellido paterno"
                    variant="outlined"
                    fullWidth
                    value={valores.apat}
                    onChange={handleChange('apat')}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Apellido materno"
                    variant="outlined"
                    fullWidth
                    value={valores.amat}
                    onChange={handleChange('amat')}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField id="rut" label="Rut"
                    value={fRut} onChange={manejoCambiofRut('fRrut')}
                    margin="normal" />
            </Grid>
            <Grid item xs={6}>
                <TextField sx={{ opacity: 0.5, cursor: 'not-allowed', }}
                    disabled
                    label="Rol"
                    variant="outlined"
                    fullWidth
                    value={valores.rol}
                // onChange={handleChange('rol')}
                />
            </Grid>

            <CardActions>
                <Button color="primary" variant="contained" onClick={clickSubmit} >Enviar</Button>
            </CardActions>

            <Dialog open={valores.open}>
                <DialogTitle>Nueva Cuenta</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nueva cuenta creada exitosamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus" variant="contained">
                            Ingresar
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Grid>

    )
};





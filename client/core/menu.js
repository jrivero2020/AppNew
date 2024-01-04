import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import logo from './../assets/images/LogoColegio_p.png'



const Menu = () => (
  <React.Fragment>
    <AppBar>
      <Toolbar>
        <img src={logo} alt="" />
        <Typography variant="h6" color="inherit" sx={{marginleft:"10"}}>
          Colegio Los <br />Conquistadores
        </Typography>

        <NavLink to="/Home" sx={{marginleft:"Auto"}}>
          <Button variant="contained" color="primary" size="small"> Btn Prueba </Button>
        </NavLink>
        <NavLink to="/lstusuario" sx={{marginleft:10}}>
          <Button variant="contained" color="primary" size="small"> Usuarios </Button>
        </NavLink>
        <NavLink to="/Signup">
          <Button variant="contained" color="primary" size="small"> Registro </Button>
        </NavLink>
        <NavLink to="/Inscripcion">
          <Button variant="contained" color="primary" size="small">Inscripcion</Button>
        </NavLink>
        <NavLink to="/Signin">
          <Button variant="contained" color="primary" size="small">Ingresar</Button>
        </NavLink>
        <NavLink to="/menu2">
          <Button variant="contained" color="primary" size="small">Menu_Lateral</Button>
        </NavLink>
        <NavLink to="/Signout">
          <Button variant="contained" color="primary" size="small"> Salir</Button>
        </NavLink>
        <NavLink to="/">
          <IconButton  > <HomeIcon />  </IconButton>
        </NavLink>

      </Toolbar>
    </AppBar>
  </React.Fragment>
)

export default Menu;

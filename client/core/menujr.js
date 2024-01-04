import * as React from 'react';
import AppBar     from '@mui/material/AppBar';
import Box        from '@mui/material/Box';
import Toolbar    from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu       from '@mui/material/Menu';
import MenuIcon   from '@mui/icons-material/Menu';
import Container  from '@mui/material/Container';
import Button     from '@mui/material/Button';
import MenuItem   from '@mui/material/MenuItem';
import logo from './../assets/images/LogoColegio_p.png'
import { NavLink } from 'react-router-dom';


// const pages = ['Inicio', 'Sobre Nosotros', 'Documentos', 'História', 'Contacto'];
const pages = ['Inicio','Lista Usuarios', 'Registro', 'Inscripción', 'Ingresar', 'Ficha Alumno', 'Parent', 'Lab','Salir'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const navegar = ['/Home','/lstusuario', '/Signup', '/Inscripcion', '/Signin', '/FichaDelAlumno2', 'Parent','/LabTabs', '/Signout' ]

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(false);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);

  };

  //       AppBar position="fixed" style={{ backgroundColor: '#fff', color: '#000', position: 'fixed' }}>


  return (
    <AppBar >
      <Container maxWidth="xl">
        <Box sx={{ mt: '1', position: 'absolute', left: 0, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <img src={logo} alt="Logo" style={{ height: '48px', marginRight: '8px', marginTop: '6px' }} />
          <Typography variant="subtitle1" sx={{ ml: 1, lineHeight: '1' }}>
            Colegio Los Conquistadores
          </Typography>
          <Typography variant="subtitle1" sx={{ lineHeight: '1' }}>
            Cerrillos
          </Typography>
        </Box>

        <Toolbar disableGutters position="fixed" style={{ height: '90px' }} sx={{ justifyContent: 'right' }}>



          {/* *** Menú principal **   */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setAnchorElNav(true)}
              color="inherit"
              sx={{ marginLeft: 'auto', fontSize: '32px' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={anchorElNav}
              onClose={() => setAnchorElNav(false)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((pagina, ptr) => (
                <NavLink to={navegar[ptr]} sx={{ marginleft: "Auto" }} key={ptr} >
                  <MenuItem key={ptr} onClick={() => setAnchorElNav(false)}>
                    <Typography textAlign="center"> {pagina}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
          {/* *** Fin Menú principal **   */}

          <Box sx={{ position: 'absolute', right: 0, display: { xs: 'none', md: 'flex' } }}>

            {pages.map((page, ptr) => (
              <NavLink to={navegar[ptr]} sx={{ marginleft: "Auto", textDecoration:'none !important' }} key={page} >
                <Button
                  key={page}
                  onClick={() => setAnchorElNav(false)}
                  sx={{
                    my: 2,
                    color: 'white',                    
                    backgroundColor: '#3F51B5',
                    '&:hover': {
                      backgroundColor: '#757575'
                    },
                    fontSize: { sm: '8px', md: '12px', lg: '16px' },
                    margin: { sm: '4px', md: '6px', lg: '12px' },
                    '@media (min-width: 600)': {
                      fontSize: '18px',
                      margin: '10px'
                    },
                    fontWeight: 'bold',
                    boxShadow: 'inset 0px 1px 0px rgba(255, 255, 255, 0.5), inset 0px -1px 0px rgba(0, 0, 0, 0.25), 0px 2px 2px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {page}
                </Button>
              </NavLink>

            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

  );
}
export default ResponsiveAppBar;


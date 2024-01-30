import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { NavLink } from "react-router-dom";

// import logo from './../assets/images/LogoColegio_p.png'
// const pages = ['Inicio', 'Sobre Nosotros', 'Documentos', 'História', 'Contacto'];

const pages = [
  { menu: "Inicio", urlCall: "/", activo: 1 },
  { menu: "História", urlCall: "/HistoriaDetalle", activo: 1 },
  { menu: "Registro", urlCall: "/Signup", activo: 0 },
  { menu: "Inscripción", urlCall: "/Inscripcion", activo: 0 },
  { menu: "Ingresar", urlCall: "/Signin", activo: 0 },
  { menu: "Ficha Alumno", urlCall: "/FichaDelAlumno2", activo: 0 },
  { menu: "Parent", urlCall: "/Parent", activo: 0 },
  { menu: "Lab", urlCall: "/LabTabs", activo: 0 },
  { menu: "Salir", urlCall: "/Signout", activo: 0 },
];

const logo = "dist/images/links/LogoColegio_p.png";
const activePages = pages.filter((link) => link.activo === 1);
function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  //       AppBar position="fixed" style={{ backgroundColor: '#fff', color: '#000', position: 'fixed' }}>

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Box
          sx={{
            mt: "1",
            position: "absolute",
            left: 0,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "48px",
              marginRight: "8px",
              marginTop: "6px",
              activo: 1,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{ ml: 1, lineHeight: "1", activo: 1 }}
          >
            Colegio Los Conquistadores
          </Typography>
          <Typography variant="subtitle1" sx={{ lineHeight: "1", activo: 1 }}>
            Cerrillos
          </Typography>
        </Box>

        <Toolbar
          disableGutters
          position="fixed"
          style={{ height: "90px", activo: 1 }}
          sx={{ justifyContent: "right", activo: 1 }}
        >
          {/* *** Menú principal **   */}
          <Box
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none", activo: 1 } }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setAnchorElNav(true)}
              color="inherit"
              sx={{ marginLeft: "auto", fontSize: "32px", activo: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={anchorElNav}
              onClose={() => setAnchorElNav(false)}
              sx={{
                display: { xs: "block", md: "none", activo: 1 },
              }}
            >
              {activePages.map((pagina) => (
                <NavLink
                  to={pagina.urlCall}
                  sx={{ marginleft: "Auto", activo: 1 }}
                  key={pagina.menu}
                >
                  <MenuItem onClick={() => setAnchorElNav(false)}>
                    <Typography textAlign="center"> {pagina.menu}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
          {/* *** Fin Menú principal **   */}

          <Box
            sx={{
              position: "absolute",
              right: 0,
              display: { xs: "none", md: "flex", activo: 1 },
            }}
          >
            {activePages.map((page) => (
              <NavLink
                to={page.urlCall}
                sx={{
                  marginleft: "Auto",
                  textDecoration: "none !important",
                  activo: 1,
                }}
                key={page.menu}
              >
                <Button
                  onClick={() => setAnchorElNav(false)}
                  sx={{
                    my: 2,
                    color: "white",
                    backgroundColor: "#3F51B5",
                    "&:hover": {
                      backgroundColor: "#757575",
                    },
                    fontSize: { sm: "8px", md: "12px", lg: "16px", activo: 1 },
                    margin: { sm: "4px", md: "6px", lg: "12px", activo: 1 },
                    "@media (min-width: 600)": {
                      fontSize: "18px",
                      margin: "10px",
                    },
                    fontWeight: "bold",
                    boxShadow:
                      "inset 0px 1px 0px rgba(255, 255, 255, 0.5), inset 0px -1px 0px rgba(0, 0, 0, 0.25), 0px 2px 2px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {page.menu}
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

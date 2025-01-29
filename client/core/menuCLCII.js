import React, { useContext, useState, useEffect } from "react";
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
import { AuthContext } from "./AuthProvider";
import { chkActivoRolAutentica } from "./../assets/js/funciones";
import CargandoPantalla from "./CargandoPantalla";
import { api_GetJsonInitOpcion } from "./../docentes/api-docentes";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // Pantallas pequeñas
      sm: 720, // Ahora sm empieza en 720px
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
const logo = "dist/images/links/LogoColegio_p.png";

function ResponsiveAppBar() {
  const {
    isAuthenticated,
    isJwtRol,
    activeImgLinks,
    setactiveImgLinks,
    setNoticias,
  } = useContext(AuthContext);

  const jwtRol = isJwtRol ? isJwtRol._rol : 0;
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [activePages, setActivePages] = useState([]);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const isSmallScreen = useMediaQuery("(max-width:720px)");
  const isShortScreen = useMediaQuery("(max-height: 720px)");
  const isMovil = isSmallScreen || isShortScreen;
  useEffect(() => {
    if (activeImgLinks.length === 0) {
      api_GetJsonInitOpcion().then((data) => {
        if (data && data.error) {
          return false;
        } else {
          const results = Object.values(data[0]);
          if (
            results === undefined ||
            results === null ||
            Object.keys(results).length === 0
          ) {
            alert("**ATENCION** no encuentro JSON inicial");
          } else {
            setactiveImgLinks(results);

            // Filtrar solo los registros con "tipo" igual a "opccgi"
            const filteredPages = results
              .filter((item) => item.datos.tipo === "menu")
              .sort((a, b) => a.id - b.id); // Ordenar por id en orden ascendente

            setActivePages(filteredPages);

            const NotifilteredPages = results
              .filter((item) => item.datos.tipo === "noticia")
              .sort((a, b) => a.id - b.id); // Ordenar por id en orden ascendente
            setNoticias(NotifilteredPages);
            setLoading(false);
          }
        }
      });
    } else {
      console.log("el obj no es vacio", activeImgLinks);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {activePages.length === 0 && <CargandoPantalla />}
      {!loading && (
        <AppBar position={isMovil ? "static" : "fixed"}>
          <Container maxWidth="xl">
            <Box
              sx={{
                mt: "1",
                position: isMovil ? "static" : "absolute",
                left: isMovil ? "auto" : 0,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "45px",
                  marginRight: "8px",
                  marginTop: "6px",
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  lineHeight: "1",
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.8rem",
                    md: "1.1rem",
                  },
                }}
              >
                Colegio Los Conquistadores
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  lineHeight: "1",
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.8rem",
                    md: "1.1rem",
                  },
                }}
              >
                Cerrillos
              </Typography>
            </Box>

            <Toolbar
              disableGutters
              position={isMovil ? "static" : "fixed"} // Cambia a "static" en pantallas pequeñas
              style={{ height: isMovil ? "1px" : "90px" }}
              sx={{ justifyContent: "right" }}
            >
              {/* *** Menú Móvil **   */}
              <Box
                sx={{
                  right: 0,
                  position: isSmallScreen ? "static" : "absolute", // Cambia a "static" en pantallas pequeñas
                  display: { xs: "flex", sm: "none" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ marginLeft: "auto", fontSize: "32px" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", sm: "none" },
                    mt: 6,
                  }}
                >
                  {activePages.map(
                    (pagina) =>
                      chkActivoRolAutentica(
                        pagina,
                        isAuthenticated,
                        jwtRol
                      ) && (
                        <NavLink
                          to={pagina.datos.urlCall}
                          sx={{ marginleft: "Auto" }}
                          key={pagina.datos.id}
                        >
                          <MenuItem onClick={handleCloseNavMenu}>
                            <Typography textAlign="center">
                              {pagina.datos.opcion}
                            </Typography>
                          </MenuItem>
                        </NavLink>
                      )
                  )}
                </Menu>
              </Box>
              {/* *** Fin Menú Movil **   */}

              <Box
                sx={{
                  position: isMovil ? "static" : "absolute", // Cambia a "static" en pantallas pequeñas
                  right: 0,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {activePages.map(
                  (page) =>
                    chkActivoRolAutentica(page, isAuthenticated, jwtRol) && (
                      <NavLink
                        to={page.datos.urlCall}
                        sx={{
                          marginleft: "Auto",
                          textDecoration: "none !important",
                        }}
                        key={page.datos.id}
                      >
                        <Button
                          onClick={handleCloseNavMenu}
                          sx={{
                            my: 2,
                            color: "white",
                            backgroundColor: "#3F51B5",
                            "&:hover": {
                              backgroundColor: "#757575",
                            },
                            fontSize: {
                              sm: "10px",
                              md: "12px",
                              lg: "16px",
                            },
                            margin: {
                              sm: "4px",
                              md: "6px",
                              lg: "12px",
                            },
                            "@media (min-width: 600)": {
                              fontSize: "18px",
                              margin: "10px",
                            },
                            fontWeight: "bold",
                            boxShadow:
                              "inset 0px 1px 0px rgba(255, 255, 255, 0.5), inset 0px -1px 0px rgba(0, 0, 0, 0.25), 0px 2px 2px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          {page.datos.opcion}
                        </Button>
                      </NavLink>
                    )
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;

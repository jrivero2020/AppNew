/* eslint-disable react-hooks/exhaustive-deps */
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
import activePages from "./../assets/data/json/OpcionesMenuPrincipal.json"
import { chkActivoRolAutentica } from "./../assets/js/funciones"
import CargandoPantalla from "./CargandoPantalla";
import { api_GetJsonInitOpcion } from "./../docentes/api-docentes";


const logo = "dist/images/links/LogoColegio_p.png";

function ResponsiveAppBar() {


  const { isAuthenticated, isJwtRol, activeImgLinks, setactiveImgLinks } = useContext(AuthContext);

  const jwtRol = isJwtRol ? isJwtRol._rol : 0;
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [loading, setLoading] = useState(true);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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
            alert(
              "**ATENCION** no encuentro JSON inicial"
            );
          } else {
            setactiveImgLinks(results);
            setLoading(false);
          }
        }
      });
    } else {
    
      console.log('el obj no es vacio', activeImgLinks)
    
    }

  }, []);


  return (
    <>
      {activeImgLinks.length === 0 && <CargandoPantalla />}
      {!loading && (
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
                  height: "45px",
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
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ marginLeft: "auto", fontSize: "32px", activo: 1 }}
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
                    display: { xs: "block", md: "none", activo: 1 },
                    mt: 6,
                  }}
                >
                  {activePages.map((pagina) => (
                    chkActivoRolAutentica(pagina, isAuthenticated, jwtRol) && (
                      <NavLink
                        to={pagina.urlCall}
                        sx={{ marginleft: "Auto", activo: 1 }}
                        key={pagina.menu}
                      >
                        <MenuItem onClick={handleCloseNavMenu}>
                          <Typography textAlign="center"> {pagina.menu}</Typography>
                        </MenuItem>
                      </NavLink>
                    )
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
                  chkActivoRolAutentica(page, isAuthenticated, jwtRol) && (
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
                        onClick={handleCloseNavMenu}
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
                  )
                ))}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
}
export default ResponsiveAppBar;

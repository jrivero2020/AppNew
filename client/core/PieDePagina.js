import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const SchoolIcon = "/dist/images/links/LogoColegio_p.png";

// Estilos personalizados
const FooterRoot = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  marginTop: "2",
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" }, // Ajuste dinámico
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.common.white, // Color blanco por defecto
  textDecoration: "none", // Quitar subrayado
  display: "block", // Hacer que sea un bloque (ocupa toda la línea)
  fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.5rem" }, // Ajuste de tamaño según el tamaño de pantalla
  marginBottom: theme.spacing(1), // Espaciado inferior
  "&:hover": {
    color: theme.palette.primary.main, // Cambiar color al pasar el mouse
  },
  // Cuando está activo (seleccionado), cambiamos el color
  "&.active": {
    color: theme.palette.primary.main, // Mismo color para el enlace activo
  },
}));

const FooterComponentLink = ({ children, to }) => {
  return (
    <Box sx={{ marginBottom: 1 }}>
      <StyledNavLink to={to}>{children}</StyledNavLink>
    </Box>
  );
};
const FooterLink = styled("a")(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": {
    color: theme.palette.primary.main,
  },
  display: "block",
  fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.5rem" }, // Ajuste de tamaño según el tamaño de pantalla
  marginBottom: theme.spacing(1),
  textDecoration: "none",
}));

const FooterText = styled("span")(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": {
    color: theme.palette.primary.main, // Mantener el comportamiento de hover si es necesario
  },
  display: "block",
  fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.5rem" }, // Ajuste de tamaño según el tamaño de pantalla
  marginBottom: theme.spacing(1),
  textDecoration: "none", // Opcional, ya que no es un enlace
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "left",
  marginBottom: theme.spacing(2),
}));

const SchoolLogo = styled("img")(({ theme }) => ({
  fontSize: "3rem",
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const Footer = () => {
  return (
    <FooterRoot>
      <Container maxWidth="false">
        <Grid
          container
          columnSpacing={8}
          alignItems="left"
          justifyContent="space-around"
        >
          {/* Columna 1: Logo y Nombre del Colegio */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <LogoContainer>
              <SchoolLogo src={SchoolIcon} alt="Logo del Colegio" />
              <Box>
                <Typography
                  fontWeight="bold"
                  sx={{
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.9rem",
                      md: "1.1em",
                      lg: "1.3rem",
                    },
                  }}
                >
                  Colegio Los Conquistadores
                </Typography>
                <Typography
                  color="grey.400"
                  sx={{
                    fontSize: {
                      xs: "0.5rem",
                      sm: "0.7rem",
                      md: "0.9rem",
                      lg: "1.1rem",
                    },
                  }}
                >
                  Educación de Excelencia
                </Typography>
              </Box>
            </LogoContainer>
            <Typography
              color="grey.400"
              sx={{
                mt: 2,
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.7rem",
                  md: "0.9rem",
                  lg: "1.1rem",
                },
              }}
            >
              Formando líderes desde 1976 con valores, excelencia académica y
              compromiso social.
            </Typography>
          </Grid>

          {/* Columna 2: Enlaces útiles */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
            <FooterHeading variant="h6">Enlaces Útiles</FooterHeading>
            <Box>
              <FooterLink
                href="https://www.mineduc.cl/servicios/informacion-sobre-educacion/"
                target="_blank"
                rel="noreferrer"
              >
                Información sobre educación
              </FooterLink>
              <FooterLink
                href="https://admision.mineduc.cl/registro/"
                target="_blank"
                rel="noreferrer"
              >
                Sistema de Admisión Escolar
              </FooterLink>
              <FooterLink
                href="https://www.mineduc.cl/servicios/tramites-subsecretaria-de-educacion/"
                target="_blank"
              >
                Trámites Subsecretaría de Educación
              </FooterLink>
            </Box>
          </Grid>

          {/* Columna 3: Legal */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
            <FooterHeading variant="h6">Nosotros</FooterHeading>
            <Box>
              <FooterComponentLink to="/HistoriaDetalle">
                Ver Historia
              </FooterComponentLink>
              <FooterComponentLink to="/Mision">
                Nuestra Misión
              </FooterComponentLink>
              <FooterComponentLink to="/Vision">
                Nuestra Visión
              </FooterComponentLink>
            </Box>
          </Grid>

          {/* Columna 4: Redes Sociales */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
            <FooterHeading variant="h6">Contactos</FooterHeading>
            <Box>
              <FooterText>Teléfono celular: 225576116 </FooterText>
              <FooterText>
                Correo electrónico: alejandra.echeverria@red-lc.com
              </FooterText>
              <FooterText>Oficina: San José 215, Cerrillos </FooterText>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: "grey.800",
            mt: 1,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            color="grey.400"
            sx={{
              fontSize: {
                xs: "0.4rem",
                sm: "0.6rem",
                md: "0.8rem",
                lg: "1rem",
              },
            }}
          >
            © {new Date().getFullYear()} Colegio Los Conquistadores de
            Cerrillos. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </FooterRoot>
  );
};

export default Footer;

import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import DocumentCard from "./DocumentCard";
import {
  AccountBalance as AccountBalanceIcon,
  MenuBook as MenuBookIcon,
  ShoppingCart as ShoppingCartIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Folder as FolderIcon, // Ícono por defecto
} from "@mui/icons-material";

// Función auxiliar para asignar un ícono según la categoría
const getIconByCategory = (categoria) => {
  const cat = categoria.toLowerCase();
  if (cat.includes("institucional"))
    return <AccountBalanceIcon sx={{ fontSize: 40, color: "#1976d2" }} />;
  if (cat.includes("convivencia"))
    return <MenuBookIcon sx={{ fontSize: 40, color: "#1976d2" }} />;
  if (cat.includes("utiles") || cat.includes("útiles"))
    return <ShoppingCartIcon sx={{ fontSize: 40, color: "#1976d2" }} />;
  if (cat.includes("galería") || cat.includes("galeria"))
    return <PhotoLibraryIcon sx={{ fontSize: 40, color: "#1976d2" }} />;
  return <FolderIcon sx={{ fontSize: 40, color: "#1976d2" }} />; // Por defecto
};

const DocumentSection = ({
  datosJson,
  isAuthenticated,
  jwtRol,
  chkActivoRolAutentica,
  onNavigate,
}) => {
  if (!datosJson || !Array.isArray(datosJson)) return null;

  // 1. Filtrar solo las opccgi, activas y que el usuario tenga permiso de ver
  const opccgiFiltradas = datosJson
    .filter((item) => item.tipo === "opccgi")
    .filter((item) => chkActivoRolAutentica(item, isAuthenticated, jwtRol))
    .sort((a, b) => a.id - b.id); // Ordenar por ID (prioridad)

  if (opccgiFiltradas.length === 0) return null;

  // 2. Agrupar por categoría
  const agrupadas = opccgiFiltradas.reduce((acc, item) => {
    const categoria = item.categoria || "Otros";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {});

  // 3. Función para manejar el click en la tarjeta
  const handleCardClick = (item) => {
    // Aquí llamas a la lógica de tu aplicación para redirigir o abrir el PDF
    // Por ejemplo: onNavigate(item.llamada.componente, item.llamada.param);
    console.log("Navegando a:", item.llamada);

    // Si es un PDF, podrías hacer:
    // if (item.llamada.componente === '/MiddlewarePdf') {
    //   window.open(`/api/pdf?ptr=${item.llamada.param.ptr}&archivo=${item.llamada.param.archivo}`, '_blank');
    // } else {
    //   onNavigate(item.llamada.componente, item.llamada.param);
    // }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Título principal de la sección */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Documentos y Recursos
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 4,
            backgroundColor: "#FFC107",
            mt: 1,
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Iterar sobre las categorías agrupadas */}
      {Object.keys(agrupadas).map((categoria) => (
        <Box key={categoria} sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: "600",
              color: "#555",
              mb: 3,
              borderLeft: "4px solid #1976d2",
              pl: 2,
            }}
          >
            {categoria}
          </Typography>

          <Grid container spacing={3}>
            {agrupadas[categoria].map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <DocumentCard
                  title={item.titulo}
                  description={item.texto} // Usamos el texto del JSON
                  icon={getIconByCategory(categoria)}
                  onClick={() => handleCardClick(item)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default DocumentSection;

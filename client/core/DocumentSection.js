import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  Dialog,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import DocumentCard from "./DocumentCard";

// Importamos los íconos
import {
  AccountBalance as AccountBalanceIcon,
  MenuBook as MenuBookIcon,
  ShoppingCart as ShoppingCartIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Folder as FolderIcon,
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

const DocumentSection = ({ datosJson }) => {
  // Estado para el modal del PDF
  const [pdfUrl, setPdfUrl] = useState(null);
  
  if (!Array.isArray(datosJson) || datosJson.length === 0) return null;

  const listaPlana = datosJson.map(item => item.datos ? item.datos : item);
 
  // 1. Filtrar solo las tarjetas, activas y autorizadas
  const opccgiFiltradas = listaPlana;

  if (opccgiFiltradas.length === 0) return null;

  console.log("opccgiFiltradas====>>>>>", opccgiFiltradas);

  // 2. Agrupar por categoría
  const agrupadas = opccgiFiltradas.reduce((acc, item) => {
    const categoria = item.categoria || "Otros";
    console.log("categoria==>", categoria, '  acc=>:', acc, '  item:', item)
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {});

  // 3. Función para manejar el click en la tarjeta
  const handleCardClick = (item) => {
    // Si la tarjeta apunta a un PDF, abrimos el modal
    if (item.llamada?.componente === "/MiddlewarePdf") {
      // Asumiendo que tu backend sirve los PDFs en una ruta como /api/pdf/...
      // Ajusta esta URL según cómo esté configurado tu MiddlewarePdf en Express
      const url = `/api/pdf?ptr=${item.llamada.param.ptr}&archivo=${item.llamada.param.archivo}`;
      setPdfUrl(url);
    } else {
      // Para otras rutas (ej: Galería de fotos), podrías usar history.push o window.location
      console.log("Navegando a:", item.llamada.componente);
      // window.location.href = item.llamada.componente;
    }
  };

  const handleCloseModal = () => setPdfUrl(null);

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
      {Object.keys(agrupadas).map((categoria, index) => (
        <Box key={`${categoria}-${index}`} sx={{ mb: 8 }}>
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

          <Grid container spacing={3} justifyContent="center">
            {agrupadas[categoria].map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`${item.id}-${index}`}
              >
                <DocumentCard
                  title={item.titulo}
                  description={item.texto}
                  icon={getIconByCategory(categoria)}
                  onClick={() => handleCardClick(item)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
{ /* https://res.cloudinary.com/spfxq8uo/image/upload/v1793034143/yuvy64oovzkrzzrsudrr.png */}
      {/* MODAL PARA VISUALIZAR PDFS */}
      <Dialog
        open={!!pdfUrl}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: "90vh", position: "relative" },
        }}
      >
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 10,
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Documento PDF"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default DocumentSection;

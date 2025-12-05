import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  CardActionArea,
  IconButton,
  useMediaQuery,
  useTheme,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";

// Categorías disponibles
const categories = [
  { id: "colegio", name: "Colegio" },
  { id: "aniversario", name: "Aniversario" },
  { id: "fiestaprimavera", name: "Fiesta Primavera" },
  { id: "clasesmagistrales", name: "Clases Magistrales" },
  { id: "fiestaspatrias", name: "Fiestas Patrias" },
  { id: "mesdellibro", name: "Mes del Libro" },
  { id: "mesdelmar", name: "Mes del Mar" },
];

// Años disponibles
const availableYears = ["2024", "2025", "2026"];


const useStyles = makeStyles({
  // ... (mantener todos los estilos existentes)
  yearSelector: {
    minWidth: 120,
    marginLeft: "16px",
    backgroundColor: "white",
    borderRadius: "4px",
    "& .MuiSelect-select": {
      padding: "8px 12px",
    },
  },
});

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("colegio");
  const [selectedYear, setSelectedYear] = useState("2025"); // Año por defecto
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const classes = useStyles();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Obtener imágenes de la categoría y año seleccionados
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/images?category=${selectedCategory}&year=${selectedYear}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar las imágenes");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        setError("No se pudieron cargar las imágenes. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedCategory, selectedYear]); // ← Agregar selectedYear como dependencia

  // Cambiar de categoría
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedImage(null);
    setIsFullscreen(false);
    setZoomLevel(1);
  };

  // Cambiar de año
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedImage(null);
    setIsFullscreen(false);
    setZoomLevel(1);
  };

  // Cerrar el mensaje de error
  const handleCloseError = () => {
    setError(null);
  };

  // Manejar el clic en una imagen
  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
    setIsFullscreen(true);
    if (isMediumScreen) {
      setZoomLevel(1.5);
    } else {
      setZoomLevel(1);
    }
  };

  // Cerrar la vista de pantalla completa
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
    setZoomLevel(1);
  };

  // Aumentar el zoom
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 5));
  };

  // Disminuir el zoom
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 0.25));
  };

  // Manejar el zoom con la rueda del ratón
  const handleWheelZoom = (event) => {
    event.stopPropagation();
    if (event.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const agregarEspacios = (cantidad) => {
    return "\u00A0".repeat(cantidad);
  };

  const isSmallScreen = useMediaQuery("(max-width:720px)");
  const isShortScreen = useMediaQuery("(max-height: 720px)");
  const isMovil = isSmallScreen || isShortScreen;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (categoryId) => {
    handleCategoryChange(null, categoryId);
    handleMenuClose();
  };

  return (
    <div
      style={{
        paddingTop: isMovil ? 0.5 : 80,
      }}
    >
      {/* Barra de navegación */}
      <AppBar
        position={isMovil ? "static" : "fixed"}
        sx={{ top: isMovil ? 8 : 90, left: 0, right: 0, overflowX: "auto" }}
      >
        {isSmallScreen ? (
          // Pantalla pequeña: Mostrar botón de menú hamburguesa
          <Toolbar>
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    width: '100%',
    gap: 1 // Poca separación entre elementos
  }}>
    <Typography
      variant="body1"
      sx={{
        lineHeight: "1",
        fontSize: {
          xs: "0.6rem",
          sm: "0.8rem",
          md: "1.1rem",
        },
        whiteSpace: 'nowrap'
      }}
    >
      Menú Galería
    </Typography>

    {/* Selector de año en móvil */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'white',
          fontSize: {
            xs: "0.5rem",
            sm: "0.6rem",
          },
          whiteSpace: 'nowrap'
        }}
      >
        Seleccione año:
      </Typography>
      <FormControl size="small" className={classes.yearSelector}>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          displayEmpty
        >
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      onClick={handleMenuOpen}
      sx={{ marginLeft: "auto" }}
    >
      <MenuIcon />
    </IconButton>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {categories.map((category) => (
        <MenuItem
          key={category.id}
          onClick={() => handleMenuItemClick(category.id)}
          selected={selectedCategory === category.id}
        >
          {category.name}
        </MenuItem>
      ))}
    </Menu>
  </Box>
</Toolbar>
        ) : (
          <>
            <Toolbar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  gap: 2, // Menor separación entre elementos
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    lineHeight: "1",
                    fontSize: {
                      xs: "0.6rem",
                      sm: "0.8rem",
                      md: "1.1rem",
                    },
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  Galería Fotos
                </Typography>

                {/* Selector de año en desktop */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: "0.6rem",
                        sm: "0.7rem",
                        md: "0.8rem",
                      },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Seleccione año:
                  </Typography>
                  <FormControl size="small" className={classes.yearSelector}>
                    <Select
                      value={selectedYear}
                      onChange={handleYearChange}
                      displayEmpty
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Toolbar>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                backgroundColor: "primary.dark",
                "& .MuiTab-root": {
                  color: "white",
                  opacity: 0.5,
                  "&.Mui-selected": {
                    color: "white",
                    opacity: 1,
                    fontWeight: "bold",
                  },
                  "&:hover": {
                    opacity: 1,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "secondary.main",
                },
                "& .MuiTabs-flexContainer": {
                  flexWrap: "nowrap",
                },
              }}
            >
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  label={category.name}
                  value={category.id}
                  sx={{
                    color: "white",
                    backgroundColor: "#3F51B5",
                    "&:hover": {
                      backgroundColor: "#757575",
                    },
                    fontSize: {
                      xs: "7px",
                      sm: "10px",
                      md: "12px",
                      lg: "16px",
                    },
                  }}
                />
              ))}
            </Tabs>
          </>
        )}
      </AppBar>

      {/* El resto del componente se mantiene igual */}
      <Box sx={{ marginTop: isMovil ? "1rem" : "6.2rem" }}>
        {!isFullscreen && (
          <Grid container spacing={2} sx={{ padding: isMovil ? 0 : 2 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  mt: 2,
                }}
              >
                <CircularProgress />
              </Box>
            ) : images.length > 0 ? (
              images.map((image) => (
                <Grid item key={image.id} xs={6} sm={4} md={3}>
                  <Card
                    elevation={8}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <CardActionArea>
                      <CardMedia sx={{ mt: isMovil ? 0 : 1 }}>
                        <LazyLoadImage
                          src={image.url}
                          effect="blur"
                          style={{
                            height: "115",
                            display: "block",
                            margin: "0 auto",
                            width: "100%",
                          }}
                          className={classes.imgBtn}
                        />
                      </CardMedia>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ padding: 2 }}>
                No hay imágenes disponibles en esta categoría y año.
              </Typography>
            )}
          </Grid>
        )}

        {/* Pantalla completa (mantener igual) */}
        {isFullscreen && (
          <Box
            className={classes.fullscreenContainer}
            onWheel={handleWheelZoom}
            tabIndex={0}
          >
            <img
              src={selectedImage}
              alt="Seleccionada"
              className={classes.fullscreenImage}
              style={{ transform: `scale(${zoomLevel})` }}
              onClick={handleCloseFullscreen}
            />
            <Box className={classes.controlsContainer}>
              <IconButton
                onClick={handleZoomOut}
                className={classes.controlButton}
                aria-label="Zoom Out"
              >
                <ZoomOutIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={handleZoomIn}
                className={classes.controlButton}
                aria-label="Zoom In"
              >
                <ZoomInIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={handleCloseFullscreen}
                className={classes.controlButton}
                aria-label="Cerrar"
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Gallery;

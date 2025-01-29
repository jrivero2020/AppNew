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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

const useStyles = makeStyles({
  imgBtn: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fullscreenContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "auto",
  },
  fullscreenImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "8px",
    transition: "transform 0.2s ease",
  },
  controlsContainer: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "20px", // Más separación entre los botones
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "12px 24px", // Más padding para mayor tamaño
    borderRadius: "8px",
    zIndex: 10000,
  },
  controlButton: {
    color: "white",
    fontSize: "32px", // Iconos más grandes
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
});

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("colegio");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const classes = useStyles();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md")); // Detectar pantallas medianas en adelante

  // Obtener imágenes de la categoría seleccionada
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/images?category=${selectedCategory}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar las imágenes");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error al cargar las imágenes:", error);
        setError("No se pudieron cargar las imágenes. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedCategory]);

  // Cambiar de categoría
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
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
    // Aplicar un zoom de 1.5 en pantallas medianas en adelante
    if (isMediumScreen) {
      setZoomLevel(1.5); // Siempre 1.5 en pantallas medianas o más grandes
    } else {
      setZoomLevel(1); // Sin zoom adicional en pantallas pequeñas
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
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 5)); // Zoom máximo de 5x
  };

  // Disminuir el zoom
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 0.25)); // Zoom mínimo de 0.25x
  };

  // Manejar el zoom con la rueda del ratón
  const handleWheelZoom = (event) => {
    console.log("Evento wheel detectado", event); // Depuración
    // event.preventDefault();
    event.stopPropagation();

    if (event.deltaY < 0) {
      // Rueda hacia arriba (zoom in)
      handleZoomIn();
    } else {
      // Rueda hacia abajo (zoom out)
      handleZoomOut();
    }
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
    handleCategoryChange(null, categoryId); // Llama al manejador de cambio de categoría
    handleMenuClose();
  };
  return (
    <div
      style={{
        paddingTop: isMovil ? 0.5 : 80,
      }}
      // sx={{ overflowX: "auto" }}
    >
      {/* Barra de navegación */}
      <AppBar
        position={isMovil ? "static" : "fixed"}
        sx={{ top: isMovil ? 8 : 81, left: 0, right: 0, overflowX: "auto" }}
      >
        {isSmallScreen ? (
          // Pantalla pequeña: Mostrar botón de menú hamburguesa
          <Toolbar>
            <Typography
              variant="body1"
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
              Menú Galería ={">  "}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
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
          </Toolbar>
        ) : (
          <>
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  width: "100%",
                  lineHeight: "1",
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.8rem",
                    md: "1.1rem",
                  },
                  fontWeight: "bold", // Negrita para parecerse al título del CardHeader, }}
                }}
              >
                Galería Fotos
              </Typography>
            </Toolbar>

            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                backgroundColor: "primary.dark", // Fondo más oscuro para las pestañas
                "& .MuiTab-root": {
                  color: "white", // Color del texto de las pestañas no seleccionadas
                  opacity: 0.5, // Opacidad para las pestañas no seleccionadas
                  "&.Mui-selected": {
                    color: "white", // Color del texto de la pestaña seleccionada
                    opacity: 1, // Opacidad completa para la pestaña seleccionada
                    fontWeight: "bold", // Texto en negrita para la pestaña seleccionada
                  },
                  "&:hover": {
                    opacity: 1, // Opacidad completa al hacer hover
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "secondary.main", // Color del indicador de la pestaña seleccionada
                },

                "& .MuiTabs-flexContainer": {
                  flexWrap: "nowrap", // Evita el wrapping de las pestañas
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

      {/* Contenido de la galería (oculto en pantalla completa) */}
      <Box sx={{ marginTop: isMovil ? "1rem" : "6.2rem" }}>
        {/* Ajustar el margen superior (128px ≈ 8rem) */}
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
                No hay imágenes disponibles en esta categoría.
              </Typography>
            )}
          </Grid>
        )}
        {/* Pantalla completa con la imagen seleccionada */}
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
            {/* Controles de zoom y cerrar */}
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
      {/* Mensaje de error */}
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

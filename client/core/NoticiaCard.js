import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Button, CardActionArea, 
  Dialog, IconButton, Fade 
} from '@mui/material';
import { 
  WarningAmber as WarningIcon, 
  Visibility as VisibilityIcon,
  Close as CloseIcon 
} from '@mui/icons-material';

// Definimos la ruta base de tus imágenes (ajústala si es necesario)
const pathImg = ''; 

const NoticiaCard = ({ noticia }) => {
  // Estados para manejar el modal
  const [openImg, setOpenImg] = useState(false);

  const { modo, src, titulo, contenido, prioridad } = noticia.datos; 
  const esUrgente = prioridad === 'alta';

  // Funciones para abrir y cerrar el modal
  const handleOpenImg = () => setOpenImg(true);
  const handleCloseImg = () => setOpenImg(false);

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: esUrgente ? '2px solid #D32F2F' : '1px solid #E0E0E0',
          boxShadow: esUrgente ? '0 4px 12px rgba(211, 47, 47, 0.2)' : 1,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        {esUrgente && (
          <Box sx={{ backgroundColor: '#D32F2F', color: 'white', p: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <WarningIcon fontSize="small" />
            <Typography variant="button" fontWeight="bold">AVISO URGENTE</Typography>
          </Box>
        )}

        {/* Al hacer clic en la tarjeta, abrimos el modal */}
        <CardActionArea onClick={handleOpenImg} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          
          {modo === 'img' && (
            <Box
              component="img"
              src={src} // Aquí va la URL de Cloudinary guardada en la BD
              alt="Aviso del Colegio"
              sx={{ 
                width: '100%', 
                height: 220, 
                objectFit: 'cover', 
                objectPosition: 'top', 
              }}
            />
          )}

          <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {modo === 'txt' ? (
              <>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  {titulo || 'Comunicado'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                  {contenido || 'Sin contenido.'}
                </Typography>
              </>
            ) : (
               <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Haga clic para ver el comunicado completo.
               </Typography>
            )}
{ /*
            <Button 
              variant={esUrgente ? "contained" : "outlined"} 
              color={esUrgente ? "error" : "primary"}
              size="small"
              startIcon={<VisibilityIcon />}
              sx={{ mt: 'auto', borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Ver Detalle
            </Button>
*/}
 <Box 
            sx={{ 
              mt: 'auto', 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1,
              px: 2,
              // Estilos que imitan al Button de MUI
              border: esUrgente ? 'none' : '1px solid #1976d2',
              backgroundColor: esUrgente ? '#D32F2F' : 'transparent',
              color: esUrgente ? 'white' : '#1976d2',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: esUrgente ? '#b71c1c' : 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <VisibilityIcon fontSize="small" />
            <Typography variant="button" sx={{ fontWeight: 'bold' }}>
              Ver Detalle
            </Typography>
          </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* MODAL (DIALOG) PARA MOSTRAR LA IMAGEN EN GRANDE */}
      <Dialog
        open={openImg}
        onClose={handleCloseImg}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            position: "relative",
            backgroundColor: "black",
            boxShadow: 'none',
            overflow: 'hidden'
          },
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          onClick={handleCloseImg}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Contenido del Modal */}
        {modo === 'img' ? (
          <Box
            component="img"
            src={src} 
            alt={titulo || "Aviso"}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh", // Para que no se salga de la pantalla en móviles
              objectFit: "contain", // 'contain' para que se vea la imagen completa sin recortes
              display: 'block',
            }}
          />
        ) : (
          // Si es modo texto, mostramos el texto en grande en el modal
          <Box sx={{ p: 4, backgroundColor: 'white' }}>
            <Typography variant="h4" gutterBottom>{titulo}</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{contenido}</Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default NoticiaCard;
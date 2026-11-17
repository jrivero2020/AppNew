import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

const HeroCarousel = () => {

const [loading, setLoading] = useState(true);
const [slides, setSlides] = useState([]);
    const archivosCarrusel = [
      'formacion1',
      'actos2',
      'edfisica1',
      'edfisica2',
      'edfisica3',
      'ColegioEntrada',
      'ComedorPatio1',
      'arte4',
      'yuvy64oovzkrzzrsudrr',
      'salacompuprueba',
      'SalaCompu1',
      'IMG-20240524-WA0004_resultado',
      'IMG_20240912_153909237_AE_resultado',
      'IMG_20240726_124641_resultado.webp',
      'IMG_20240726_104526_resultado.webp',
      'DSC_8032.webp',
      'DSC_7981.webp',
      'DSC_7994.webp',
    ];

       const textosCarrusel = [
          {
            title: '50 Años Formando Líderes',
            subtitle: 'Celebramos medio siglo de excelencia académica y compromiso con nuestra comunidad.',
            buttonText: 'Ver Historia',
            buttonStatus: true
          },
          {
            title: 'Matrículas 2027, Pronto en Diciembre',
            subtitle: 'Asegura el futuro de tu hijo en un ambiente de innovación y valores.',
            buttonText: 'Pronto',
            buttonStatus: false,
          },
          {
            title: 'Horario de Atención',
            subtitle: 'Estimados apoderados, revise el horario de atención de profesores para este período.',
            buttonText: 'Ver Horarios',
            buttonStatus: true,
          },
          {
            title: 'Reglamento Interno de Convivencia',
            subtitle: 'Estimados apoderados, conozca el reglamento de convivencia de nuestro colegio .',
            buttonText: 'Ver Reglamento',
            buttonStatus: true,
          },
          {
            title: 'Reglamento Interno de Convivencia de Pre Básica',
            subtitle: 'Estimados apoderados, revise el reglamento de convivencia de Educación Parvularia.',
            buttonText: 'Ver Manual',
            buttonStatus: true,
          }
        ];    

  useEffect(() => {
    // 1. Definimos los archivos que queremos en el carrusel
    // *************************************************************

    const carpeta= '' // Antes direccionaba a =>'images/fotos/portada' // Opcional, por si la quieres cambiar

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/obtenerFotosCarrusel?archivosP=${archivosCarrusel}&carpeta=${carpeta}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar el carrusel");
          // return response.json();
        }
        const data = await response.json();

          // Armamos los slides finales
        const slidesFinales = data.map((item, index) => ({
          id: index + 1,
          imageUrl: item.url,
          ...textosCarrusel[index % textosCarrusel.length], // Rota los textos si hay más fotos
        }));

        setSlides(slidesFinales);
        setLoading(false);

      } catch (error) {
        // setError("No se pudieron cargar las imágenes. Inténtalo de nuevo.");
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
     fetchImages();
  },
  []);

  if (loading || slides.length === 0) {
    return <Box sx={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0' }} />;
  }

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2000} // 1 segundo de transición
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        loop={true}
        className="hero-swiper"
        style={{ height: '600px' }} // Altura aumentada para escritorio
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Imagen de Fondo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 50%', // Enfoca la parte centro de la foto
                  zIndex: 0,
                }}
              />

              {/* Capa Oscura (Overlay) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(13, 71, 161, 0.7)', 
                  zIndex: 1, 
                }}
              />

              {/* Contenido del Texto */}
              <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', pt: 4 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 800, 
                    mb: 2,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                    fontSize: { xs: '2rem', md: '3.5rem' } 
                  }}
                >
                  {slide.title}
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#FFFFFF', 
                    mb: 5, 
                    fontWeight: 400,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                    fontSize: { xs: '1rem', md: '1.4rem' }
                  }}
                >
                  {slide.subtitle}
                </Typography>

                <Button 
                  variant="contained" 
                  size="large" 
                  disabled={slide.buttonStatus === false}
                  sx={{
                    backgroundColor: '#FFC107',
                    color: '#000000',
                    fontWeight: 'bold',
                    borderRadius: 8,
                    px: 5, 
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px 0 rgba(255, 193, 7, 0.4)',
                    '&:hover': {
                      backgroundColor: '#FFB300',
                      boxShadow: '0 6px 20px 0 rgba(255, 193, 7, 0.6)',
                    }
                  }}
                >
                  {slide.buttonText}
                </Button>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroCarousel;
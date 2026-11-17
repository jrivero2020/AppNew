import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import NoticiaCard from "./NoticiaCard";
import { AuthContext } from "./AuthProvider";

const NoticiasV2 = () => {
  const { Noticias } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [datosJson, setDatosJson] = useState([]);

  useEffect(() => {
    if (Noticias.length > 0) {
      setDatosJson(Noticias);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Noticias]);

  if (loading) return <p></p>;

  if (!datosJson || !Array.isArray(datosJson)) return null;
  // 🛡️ ESCUDO 2: Si no hay datos o no es un array, no renderizamos nada.
  // Esto evita el error de "Cannot read properties of undefined"
  if (!datosJson || !Array.isArray(datosJson) || datosJson.length === 0) {
    return null;
  }

  // 1. Filtrar solo las noticias, activas y autorizadas
  const noticiasFiltradas = datosJson
    .filter((item) => item.datos?.tipo === "noticia")
    .filter((noticia) => {
      // Si está activa, la mostramos
      return noticia.datos.activo === 1;
    })
    // 2. Ordenar por "nro" (prioridad). El más bajo (ej: 10) sale primero.
    .sort((a, b) => a.nro - b.nro)
    // 3. Cortar a las 3 más importantes
    .slice(0, 3);

  if (noticiasFiltradas.length === 0) return null;
console.log("Noticias Filtradas****=>", noticiasFiltradas)
  return (
    <Box sx={{ py: 4, mb: 4 }}>
      {/* Título de la sección */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Comunicados Importantes
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: 2,
            backgroundColor: "#E0E0E0",
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Grilla de 3 columnas en PC, 1 en móvil */}
      <Grid container spacing={4} justifyContent="center">
        {noticiasFiltradas.map((noticia,index) => (
          <Grid item xs={12} md={4} key={`${noticia.nro}-${index}`}>
            <NoticiaCard noticia={noticia} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NoticiasV2;

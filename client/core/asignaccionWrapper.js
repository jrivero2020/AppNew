import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
  useMediaQuery,
  Box,
} from "@mui/material";
import { AuthContext } from "./AuthProvider";
import { getDataTodosProfe } from "../docentes/api-docentes";
import AsignacionCompleta from "./../core/HorariosCursosProfe";

const AsignacionWrapper = () => {
  const location = useLocation();
  const { jwt } = useContext(AuthContext);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width:720px)");
  const usrRol = jwt.user._rol;
  const esAdmin = usrRol === 1 || usrRol === 2;
  // Resetear estado cuando la ubicación cambia
  useEffect(() => {
    setSelectedFuncionario(null);
  }, [location.key]); // Se ejecuta cada vez que la ruta cambia

  useEffect(() => {
    if (esAdmin) {
      const fetchFuncionarios = async () => {
        try {
          const data = await getDataTodosProfe();
          setFuncionarios(Object.values(data));
          setLoading(false);
        } catch (error) {
          console.error("Error cargando funcionarios:", error);
          setLoading(false);
        }
      };

      fetchFuncionarios();
    } else {
      setLoading(false);
    }
  }, [usrRol]);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Si es admin y no ha seleccionado funcionario

  if (esAdmin && !selectedFuncionario) {
    return (
      <>
        <Grid
          container
          justifyContent="center"
          spacing={2}
          sx={{
            margin: "auto",
            width: { xs: "100%", sm: "95%", md: "80%" }, // Más gradual
            mt: isSmallScreen ? 1 : 12, // Implementación directa
            px: { xs: 1, sm: 2 }, // Padding horizontal menor en móviles
            boxSizing: "border-box",
            pb: 4, // Padding bottom para evitar que quede pegado al final
          }}
        >
          <Paper
            elevation={9}
            sx={{
              px: 1,
              pb: 2,
              backgroundColor: "#efebe9",
              width: { xs: "100%", md: "80%" }, // Aquí aplicamos los anchos específicos
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "primary.dark",
                textAlign: "center", // Centra el texto horizontalmente
                width: "100%", // Asegura que ocupe todo el ancho disponible
                mt: 1,
              }}
            >
              Seleccionar Funcionario
            </Typography>

            <Grid
              container
              rowSpacing={0.25}
              columnSpacing={2}
              sx={{
                justifyContent: "center", // Centra horizontalmente
                alignItems: "center", // Centra verticalmente (si es necesario)
              }}
            >
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Selecciones un Funcionario"
                  value=""
                  onChange={(e) => {
                    const func = funcionarios.find(
                      (f) => f.rut === e.target.value
                    );
                    setSelectedFuncionario(func);
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 800, // Altura máxima del menú
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#888",
                            borderRadius: "3px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      // Estilo para el label
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      minHeight: "1.4375em",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                >
                  <MenuItem value="">
                    <Typography
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      Seleccione un funcionario
                    </Typography>
                  </MenuItem>
                  {funcionarios.slice(0, 100).map((funcionario) => (
                    <MenuItem
                      key={funcionario.rut}
                      value={funcionario.rut}
                      sx={{
                        py: { xs: 1, sm: 0.5 }, // Ajusta padding vertical
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isSmallScreen ? "column" : "row",
                          width: "100%",
                        }}
                      >
                        <Typography
                          component="span"
                          noWrap
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {funcionario.nombres}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </>
    );
  }

  // Si no es admin o ya seleccionó funcionario
  return (
    <AsignacionCompleta
      rutFuncionario={selectedFuncionario?.rut || jwt.user._id}
      nombreProfesor={selectedFuncionario?.nombres || jwt.user._name}
    />
  );
};

export default AsignacionWrapper;

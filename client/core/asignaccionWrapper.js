import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { AuthContext } from "./AuthProvider";
import { getAllFuncionarios } from "../api"; // Asegúrate de tener esta función en tu API

const AsignacionWrapper = () => {
  const { jwt } = useContext(AuthContext);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const usrRol = jwt.user._rol;

  useEffect(() => {
    if (usrRol === 1 || usrRol === 2) {
      const fetchFuncionarios = async () => {
        try {
          const data = await getAllFuncionarios();
          setFuncionarios(data);
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
  if ((usrRol === 1 || usrRol === 2) && !selectedFuncionario) {
    return (
      <Container maxWidth="md" sx={{ mt: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Seleccionar Funcionario
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Funcionario"
                  value=""
                  onChange={(e) => {
                    const func = funcionarios.find(
                      (f) => f.rut === e.target.value
                    );
                    setSelectedFuncionario(func);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione un funcionario</em>
                  </MenuItem>
                  {funcionarios.map((funcionario) => (
                    <MenuItem key={funcionario.rut} value={funcionario.rut}>
                      {funcionario.nombre} ({funcionario.rut})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Si no es admin o ya seleccionó funcionario
  return (
    <AsignacionCompleta
      rutFuncionario={selectedFuncionario?.rut || jwt.user._id}
      nombreProfesor={selectedFuncionario?.nombre || jwt.user._name}
    />
  );
};

export default AsignacionWrapper;
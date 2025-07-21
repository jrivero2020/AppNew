import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Save, Add, Delete } from "@mui/icons-material";

import {
  getPagosConfigMontos,
  UpsertPagosConfigMontos,
  DeletePagosConfigMontos,
} from "./../../docentes/api-docentes";

import { AuthContext } from "./../../core/AuthProvider";
// confirmationmodal.js
const abortController = new AbortController();
const signal = abortController.signal;

const PagosConfigMontoBox = () => {
  const [montos, setMontos] = useState([]);
  const [nuevo, setNuevo] = useState({ agno: "", monto: "" });
  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const { jwt } = useContext(AuthContext);
  const usrId = jwt.user._id;

  //    const results = await getPagosConfigMontos({ t: jwt.token }, signal);

  const fetchData = async () => {
    const data = await getPagosConfigMontos({ t: jwt.token }, signal);
    //console.log("Datos recibidos:", Object.values(data)); // Agrega esto para depurar
    // const dataArray = data ? [{ ...data, monto: parseFloat(data.monto) }] : [];
    const dataArray = Object.values(data);

    // console.log("dataArray=>", dataArray);
    setMontos(dataArray); // Asegúrate de que sea un array
    //    setMontos(data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (index, key, value) => {
    const updated = [...montos];
    updated[index][key] = value;
    setMontos(updated);
  };

  const handleSave = async (index) => {
    const item = montos[index];
    try {
      await UpsertPagosConfigMontos(
        {
          agno: item.agno,
          monto: item.monto,
        },
        { t: jwt.token }
      );
      setAlert({
        open: true,
        msg: "Actualizado correctamente.",
        severity: "success",
      });
      fetchData();
    } catch {
      setAlert({ open: true, msg: "Error al actualizar.", severity: "error" });
    }
  };

  const handleAdd = async () => {
    if (!nuevo.agno || !nuevo.monto) {
      setAlert({
        open: true,
        msg: "Rellena todos los campos.",
        severity: "warning",
      });
      return;
    }
    // console.log("handleAdd nuevo==>", nuevo);
    try {
      await UpsertPagosConfigMontos(
        { agno: nuevo.agno, monto: nuevo.monto },
        { t: jwt.token }
      );
      // console.log("results==>", results);
      setNuevo({ agno: "", monto: "" });
      setAlert({ open: true, msg: "Monto agregado.", severity: "success" });
      fetchData();
    } catch {
      setAlert({ open: true, msg: "Error al agregar.", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    console.log("delete id:", id);
    if (!window.confirm("¿Estás seguro de eliminar este monto?", id)) return;
    try {
      await DeletePagosConfigMontos(id, { t: jwt.token });
      setAlert({
        open: true,
        msg: "Eliminado correctamente.",
        severity: "info",
      });
      fetchData();
    } catch {
      setAlert({ open: true, msg: "Error al eliminar.", severity: "error" });
    }
  };
  // if (montos.length === 0) return <></>;

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        width: "100%",
        maxWidth: 400,
        mt: 10,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Montos por Año
      </Typography>

      {montos.map((item, index) => (
        <Box
          key={item.id}
          sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}
        >
          <TextField
            label="Año"
            type="number"
            value={item.agno}
            onChange={(e) => handleChange(index, "agno", e.target.value)}
            size="small"
          />
          <TextField
            label="Monto"
            type="number"
            value={item.monto}
            onChange={(e) => handleChange(index, "monto", e.target.value)}
            size="small"
          />
          <IconButton onClick={() => handleSave(index)} color="primary">
            <Save />
          </IconButton>
          <IconButton onClick={() => handleDelete(item.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Agregar nuevo año
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Año nvo"
            type="number"
            value={nuevo.agno}
            onChange={(e) => setNuevo({ ...nuevo, agno: e.target.value })}
            size="small"
          />
          <TextField
            label="Monto nvo"
            type="number"
            value={nuevo.monto}
            onChange={(e) => setNuevo({ ...nuevo, monto: e.target.value })}
            size="small"
          />
          <IconButton onClick={handleAdd} color="success">
            <Add />
          </IconButton>
        </Box>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PagosConfigMontoBox;

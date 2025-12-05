import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import ConfigMonto from "./ConfigMonto";
import { AuthContext } from "./../../core/AuthProvider";

const DashBoardBecas = () => {
  const { jwt } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleSelectYear = (year) => {
    console.log("Año seleccionado:", year); // Para depuración
    setSelectedYear(year);
    // Aquí puedes agregar lógica adicional, por ejemplo, filtrar datos en otros componentes
  };

  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 8 }}
    >
      <ConfigMonto
        credentials={{ t: jwt.token }}
        onSelectYear={handleSelectYear}
      />
      {/* Aquí irá el componente de pagos_tipo_beca (próximo paso) */}
    </Box>
  );
};

export default DashBoardBecas;

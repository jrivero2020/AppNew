import React, { useContext } from "react";
import BuscarAlumno from "./../../FichaAlumnos/BuscarAlumno"
import { AuthContext } from "./../../core/AuthProvider"

function PagoDataAlumno() {
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const handleDatosListos = (datos) => {
    console.log("Datos recibidos en AppExterna:", datos);
    console.log("databuscaAl", dataBuscaAl)
    // Aquí puedes redirigir, actualizar estado, etc.
  };
 if (!dataBuscaAl) {
    return <div>Cargando datos del alumno...</div>;
  }

  return (
    <div>
      <h1>App Externa</h1>
      <BuscarAlumno 
        ModoLLamada="Externo" 
        onDatosListos={handleDatosListos} 
      />
    </div>
  );
}

export default PagoDataAlumno;
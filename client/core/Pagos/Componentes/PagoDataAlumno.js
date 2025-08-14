import React, { useContext, useState } from "react";
import BuscarAlumno from "../../../FichaAlumnos/BuscarAlumno";
import { AuthContext } from "../../AuthProvider";
import { getDataPagoAlumno } from "../../../docentes/api-docentes";
import FichaPagosAlumno from "./FichaPagosAlumno"

const abortController = new AbortController();
const signal = abortController.signal;

function PagoDataAlumno() {
  const { jwt } = useContext(AuthContext);
  const [pagoData, setPagoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDatosListos = async ({ datosAlumno }) => {
    try {
      setLoading(true);
      const agnoActual = new Date().getFullYear();

      const results = await getDataPagoAlumno(
        { rut: datosAlumno.al_rut, agno: agnoActual },
        { t: jwt.token },
        signal
      );
//      console.log("Respuesta completa=>:", results);
      const mesesArray = Object.values(results.meses);
//      console.log("Meses =>", mesesArray);
      const mesesFormateados = mesesArray.map((mes, index) => ({
        id: index,
        ...mes,
        saldo_pendiente: mes.monto_base - mes.monto_pagado,
        estado:
          mes.monto_pagado >= mes.monto_base
            ? "pagado"
            : mes.monto_pagado > 0
            ? "parcial"
            : "pendiente",
      }));

      setPagoData({
        alumno: Object.values(results.alumno),
        meses: mesesFormateados,
        totales: Object.values(results.totales),
      });
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mostrar BuscarAlumno solo si aún no hay datos */}
      {!pagoData && (
        <BuscarAlumno ModoLLamada="Externo" onDatosListos={handleDatosListos} />
      )}
      {pagoData && (
        <FichaPagosAlumno
          alumno={pagoData.alumno[0]}
          meses={pagoData.meses}
          totales={pagoData.totales[0]}
          pagoData={pagoData}
          setPagoData={setPagoData}
        />
      )}
    </div>
  );
}

export default PagoDataAlumno;

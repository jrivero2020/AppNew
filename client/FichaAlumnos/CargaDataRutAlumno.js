import { getDatosMatricula } from "./../docentes/api-docentes";


// import { useContext } from "react";
// import { AuthContext } from "./../core/AuthProvider"



export const CargaDataFichaAlumno = ({ 
  resultado,
  setResultado,
  jwt,
  setDataBuscaAl,
  }) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  console.log("resultado.fRut ==>", resultado.fRut)
  getDatosMatricula(resultado.fRut, { t: jwt.token }, signal).then((data) => {
    if (data && data.error) {
      setResultado({ ...resultado, fRut: "",dv:"", result: 0 });
      return false;
    } else {
      console.log("getDatosMatricula===>data :", data)
      const [results] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        setResultado({ ...resultado, result: 9 }); // No está en base de datos
      } else {
        setResultado({ ...resultado, result: 10 }); // Ficha Cargada
        setDataBuscaAl(results[0]);
      }
    }
  });
  return;
};

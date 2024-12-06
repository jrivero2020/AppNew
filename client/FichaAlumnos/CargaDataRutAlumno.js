import {
  api_getDatosFamiliaAP,
  getDatosMatricula,
} from "./../docentes/api-docentes";

// import { useContext } from "react";
// import { AuthContext } from "./../core/AuthProvider"

export const CargaDataFichaAlumno = ({
  resultado,
  setResultado,
  jwt,
  dataBuscaAl,
  setDataBuscaAl,
}) => {
  const abortController = new AbortController();
  const signal = abortController.signal;

  getDatosMatricula(resultado.RutBuscar, { t: jwt.token }, signal).then(
    (data) => {
      // console.log("getDatosMatricula resultado.RutBuscar ===>", resultado.RutBuscar );
      if (data && data.error) {
        setResultado({ ...resultado, result: 11 });
        return false;
      } else {
        const [results] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          setResultado({ ...resultado, result: 9 }); // No está en base de datos
          setDataBuscaAl({
            ...dataBuscaAl,
            al_rut: resultado.RutBuscar,
            al_dv: resultado.dv,
          });
          console.log("getDatosMatricula resultado) :", resultado);
        } else {
          console.log("(results[0] :", results[0]);

          setResultado({ ...resultado, result: 10 }); // Ficha Cargada
          setDataBuscaAl(results[0]); // Datos de la vista cargados
        }
      }
    }
  );
  return;
};

export const CargaDataFamiliaAp = ({
  resultado,
  setResultado,
  jwt,
  dataBuscaAl,
  setDataBuscaAl,
  mode,
  setMode,
}) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const indFamilia = ["", "BuscaAp", "BuscaApSup", "BuscaPadre", "BuscaMadre"];
  const rutFamilia = ["", "ApRut", "ApsuRut", "PadRut", "MadRut"];

  /*
modo =1; apoderado
modo =2; apoderado suplente
modo =3; Padre
modo =4; Madres
*/
  console.log(
    " El valor que paso a api_getDatosFamiliaAp = >",
    resultado[rutFamilia[mode]],
    "resultado = ",
    resultado
  );

  api_getDatosFamiliaAP(
    resultado[rutFamilia[mode]],
    { t: jwt.token },
    signal
  ).then((data) => {
    // console.log("getDatosMatricula resultado.RutBuscar ===>", resultado.RutBuscar );
    if (data && data.error) {
      setResultado({ ...resultado, [indFamilia[mode]]: 2 }); // error en conexion
      setMode(0);
      return false;
    } else {
      const [results] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        setResultado({ ...resultado, [indFamilia[mode]]: 3 }); // No está en base de datos
        console.log("getDatosFamiliaAP resultado, no está en bd) :", resultado);
        setMode(0);
      } else {
        console.log(
          "(results[0] :",
          results[0],
          " Cargar datos para modo =",
          mode
        );
        setResultado({ ...resultado, [indFamilia[mode]]: 1 }); // Ficha Cargada
        console.log(
          "Cargar Data del ",
          [indFamilia[mode]],
          " Con resultado ==>",
          results[0]
        );
        setMode(0);

        // setDataBuscaAl(results[0]); // Datos de la vista cargados
      }
    }
  });
  return;
};

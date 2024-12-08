import {
  api_getDatosFamiliaAP,
  getDatosMatricula,
} from "./../docentes/api-docentes";

import { RutANumeros } from "./../assets/js/FmtoRut";
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
  const modeInterno = mode;
  setMode(0);

  const updateDataBuscaAl = (results) => {
    const prefixMap = {
      1: "ap",
      2: "apsu",
      3: "padre",
      4: "madre",
    };

    const prefix = prefixMap[modeInterno];

    if (!prefix) return;

    const updatedFields = {
      [`${prefix}_nombres`]: results[0].fam_nombres,
      [`${prefix}_apat`]: results[0].fam_apat,
      [`${prefix}_amat`]: results[0].fam_amat,
      [`${prefix}_fono1`]: results[0].fam_fono1,
      [`${prefix}_fono2`]: results[0].fam_fono2,
      [`${prefix}_emergencia`]: results[0].fam_emergencia,
      [`${prefix}_email`]: results[0].fam_email,
      [`${prefix}_domicilio`]: results[0].fam_domicilio,
      [`${prefix}_id_comuna`]: results[0].fam_id_comuna,
      [`${prefix}_rut`]: results[0].fam_rut,
      [`${prefix}_dv`]: results[0].fam_dv,
    };

    setDataBuscaAl((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    /*
    actualizarRut("ap_rut", "ap_dv", resultado.ApRut);
    actualizarRut("apsu_rut", "apsu_dv", resultado.ApsuRut);
    actualizarRut("madre_rut", "madre_dv", resultado.MadRut);
    actualizarRut("padre_rut", "padre_dv", resultado.PadRut);
*/

    setMode(10); // Data Cargada en todo momento;
  };

  /*
modo =1; apoderado
modo =2; apoderado suplente
modo =3; Padre
modo =4; Madres
*/
  const rutLimpio = RutANumeros(resultado[rutFamilia[modeInterno]]);

  api_getDatosFamiliaAP(rutLimpio, { t: jwt.token }, signal).then((data) => {
    // console.log("getDatosMatricula resultado.RutBuscar ===>", resultado.RutBuscar );
    if (data && data.error) {
      setResultado({ ...resultado, [indFamilia[modeInterno]]: 2 }); // error en conexion
      return false;
    } else {
      const [results] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        setResultado({ ...resultado, [indFamilia[modeInterno]]: 3 }); // No está en base de datos
        console.log("getDatosFamiliaAP resultado, no está en bd) :", resultado);
      } else {
        console.log(
          "(results[0] :",
          results[0],
          " Cargar datos para modo =",
          modeInterno
        );
        setResultado({ ...resultado, [indFamilia[modeInterno]]: 1 }); // Ficha Cargada
        console.log(
          "Cargar Data del ",
          [indFamilia[modeInterno]],
          " Con resultado ==>",
          results[0].fam_nombres
        );

        if (modeInterno >= 1 && modeInterno <= 4) {
          updateDataBuscaAl(results);
        }

        setMode(0);

        // setDataBuscaAl(results[0]); // Datos de la vista cargados
      }
    }
  });
  return;
};

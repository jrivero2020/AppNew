import {
  api_getDatosFamiliaAP,
  getDatosMatricula,
} from "./../docentes/api-docentes";

import { RutANumeros, FmtoRut } from "./../assets/js/FmtoRut";
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
          // console.log("getDatosMatricula resultado) :", resultado);
        } else {
          // console.log("(results[0] :", results[0]);

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

  const generateUpdatedFields = (mode, prefix, results) => {
    const baseFieldsInit = {
      [`${prefix}_rut`]: results[0].fam_rut,
      [`${prefix}_dv`]: results[0].fam_dv,
      [`${prefix}_nombres`]: results[0].fam_nombres,
      [`${prefix}_apat`]: results[0].fam_apat,
      [`${prefix}_amat`]: results[0].fam_amat,
    };

    const modeFields = {
      1: { al_idapoderado: results[0].fam_id },
      2: { al_idapoderadosupl: results[0].fam_id },
      3: { al_idmadre: results[0].fam_id },
      4: { al_idpadre: results[0].fam_id },
    };

    const additionalFields = {
      common: {
        [`${prefix}_fono1`]: results[0].fam_fono1,
        [`${prefix}_fono2`]: results[0].fam_fono2,
        [`${prefix}_emergencia`]: results[0].fam_emergencia,
        [`${prefix}_email`]: results[0].fam_email,
        [`${prefix}_domicilio`]: results[0].fam_domicilio,
        [`${prefix}_id_comuna`]: results[0].fam_id_comuna,
      },
      madrePadre: {
        [`${prefix}_estudios`]: results[0].fam_apat, // Revisa si este mapeo es correcto
        [`${prefix}_ocupacion`]: results[0].fam_amat, // Revisa si este mapeo es correcto
        al_ingresogrupofamiliar: results[0].fam_ingresogrupofamiliar,
        al_vivienda: results[0].fam_vivienda,
        al_evaluareligion: results[0].fam_evaluareligion,
      },
    };

    let baseFields = {
      ...baseFieldsInit,
      ...(modeFields[mode] || {}),
    };

    if (mode === 1 || mode === 2) {
      return { ...baseFields, ...additionalFields.common };
    }

    if (mode === 3 || mode === 4) {
      return { ...baseFields, ...additionalFields.madrePadre };
    }

    return baseFields; // Caso por defecto
  };

  const updateDataBuscaAl = (results) => {
    const prefixMap = {
      1: "ap",
      2: "apsu",
      3: "padre",
      4: "madre",
    };

    const prefix = prefixMap[modeInterno];

    if (!prefix) return;

    if ([1, 2, 3, 4].includes(modeInterno)) {
      const updatedFields = generateUpdatedFields(modeInterno, prefix, results);
      setDataBuscaAl((prev) => ({
        ...prev,
        ...updatedFields,
      }));
    }

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
      } else {
        setResultado({ ...resultado, [indFamilia[modeInterno]]: 1 }); // Ficha Cargada

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

export const actualizaPadres = ({
  resultado,
  setResultado,
  dataBuscaAl,
  setDataBuscaAl,
}) => {
  // Mapear el parentesco con los campos correspondientes
  const swValue = resultado.swParentesco;
  const parentFields = {
    madre: [
      "madre_rut",
      "madre_dv",
      "madre_nombres",
      "madre_apat",
      "madre_amat",
    ],
    padre: [
      "padre_rut",
      "padre_dv",
      "padre_nombres",
      "padre_apat",
      "padre_amat",
    ],
  };
  const dataKey = swValue >= 1 && swValue <= 2 ? "ap" : "apsu";
  const parentType = swValue === 2 || swValue === 4 ? "madre" : "padre";

  if (parentType) {
    const [rut, dv, nombres, apat, amat] = parentFields[parentType];
    const rutDinamico =
      dataBuscaAl[`${dataKey}_rut`] + "-" + dataBuscaAl[`${dataKey}_dv`];
    const rutDinamicoFmto = FmtoRut(rutDinamico);
    setDataBuscaAl({
      ...dataBuscaAl,
      [rut]: dataBuscaAl[`${dataKey}_rut`],
      [dv]: dataBuscaAl[`${dataKey}_dv`],
      [nombres]: dataBuscaAl[`${dataKey}_nombres`],
      [apat]: dataBuscaAl[`${dataKey}_apat`],
      [amat]: dataBuscaAl[`${dataKey}_amat`],
    });

    setResultado({
      ...resultado,
      [`${dataKey === "ap" ? "ApRut" : "ApsuRut"}`]: rutDinamicoFmto,
      [`${dataKey === "ap" ? "ApDv" : "ApsuDv"}`]: dataBuscaAl[`${dataKey}_dv`],
      [parentType === "madre" ? "MadRut" : "PadRut"]: rutDinamicoFmto,
      swParentesco: 0, // Reiniciar swParentesco para evitar actualizaciones repetidas
    });
  }
};

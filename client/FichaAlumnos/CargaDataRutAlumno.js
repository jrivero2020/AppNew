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
        setResultado((prev) => ({ ...prev, result: 11 }));
        return false;
      } else {
        const [results] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          setResultado((prev) => ({ ...prev, result: 9 })); // No está en base de datos
          setDataBuscaAl((prev) => ({
            ...prev,
            al_rut: resultado.RutBuscar,
            al_dv: resultado.dv,
          }));
          // console.log("getDatosMatricula resultado) :", resultado);
        } else {
          setResultado((prev) => ({ ...prev, result: 12 })); // No hace nada, mantener tabs
          //console.log("(results[0] :", results[0]);
          //console.log("Resultado:", resultado);

          const ApRut = results[0].ap_rut + "-" + results[0].ap_dv;
          const ApsuRut = results[0].apsu_rut + "-" + results[0].apsu_dv;
          const MadRut = results[0].madre_rut + "-" + results[0].madre_dv;
          const PadRut = results[0].padre_rut + "-" + results[0].padre_dv;

          // console.log("Los rut =>", ApRut, ApsuRut, MadRut, PadRut);

          setResultado((prev) => ({
            ...prev,
            result: 10,
            ApRut: ApRut,
            ApDv: results[0].ap_dv,
            ApsuRut: ApsuRut,
            ApsuDv: results[0].apsu_dv,
            MadRut: MadRut,
            MadDv: results[0].madre_dv,
            PadRut: PadRut,
            PadDv: results[0].padre_dv,
          }));

          setDataBuscaAl((prev) => {
            // Fusiona todos los datos de results[0] con los campos adicionales si no están definidos en el estado previo
            const updatedData = {
              ...prev, // Mantén los valores existentes en el estado
              ...results[0], // Carga todos los campos de results[0]
              // Agrega los campos adicionales si no existen en prev
              ApRut: prev?.ApRut ?? ApRut,
              ApDv: prev?.ApDv ?? results[0]?.ap_dv,
              ApsuRut: prev?.ApsuRut ?? ApsuRut,
              ApsuDv: prev?.ApsuDv ?? results[0]?.apsu_dv,
              MadRut: prev?.MadRut ?? MadRut,
              MadDv: prev?.MadDv ?? results[0]?.madre_dv,
              PadRut: prev?.PadRut ?? PadRut,
              PadDv: prev?.PadDv ?? results[0]?.padre_dv,
            };

            return updatedData; // Retorna el estado actualizado
          });
          setDataBuscaAl((prev) => ({
            ...prev,
            ApRut: ApRut,
            ApDv: results[0].ap_dv,
            ApsuRut: ApsuRut,
            ApsuDv: results[0].apsu_dv,
            MadRut: MadRut,
            MadDv: results[0].madre_dv,
            PadRut: PadRut,
            PadDv: results[0].padre_dv,
          }));
        }
      }
    }
  );
  return;
};

export const CargaDataFamiliaAp = ({
  jwt,
  dataBuscaAl,
  setDataBuscaAl,
  mode,
  setMode,
}) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
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
        [`${prefix}_estudios`]: results[0].fam_estudios, // Revisa si este mapeo es correcto
        [`${prefix}_ocupacion`]: results[0].fam_ocupacion, // Revisa si este mapeo es correcto
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

  const rutLimpio = RutANumeros(dataBuscaAl[rutFamilia[modeInterno]]);

  api_getDatosFamiliaAP(rutLimpio, { t: jwt.token }, signal).then((data) => {
    // console.log("getDatosMatricula resultado.RutBuscar ===>", resultado.RutBuscar );
    if (data && data.error) {
      // setResultado({ ...resultado, [indFamilia[modeInterno]]: 2 }); // error en conexion
      return false;
    } else {
      const [results] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        // setResultado({ ...resultado, [indFamilia[modeInterno]]: 3 }); // No está en base de datos
      } else {
        //        setResultado({ ...resultado, [indFamilia[modeInterno]]: 1 }); // Ficha Cargada

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
  dataBuscaAl,
  setDataBuscaAl,
  refs,
  swValue,
}) => {
  // Mapear el parentesco con los campos correspondientes
  // const swValue = dataBuscaAl.swParentesco;
  const commonFields = ["rut", "dv", "nombres", "apat", "amat"];
  const parentFields = {
    madre: commonFields.map((field) => `madre_${field}`),
    padre: commonFields.map((field) => `padre_${field}`),
  };

  const dataKeyMap = {
    1: "ap",
    2: "ap",
    3: "apsu",
    4: "apsu",
  };

  const parentTypeMap = {
    1: "padre",
    2: "madre",
    3: "padre",
    4: "madre",
  };

  const dataKey = dataKeyMap[swValue] || null; // Manejo de caso por defecto
  const parentType = parentTypeMap[swValue] || null;
  const rutFamilia = parentType === "madre" ? "MadRut" : "PadRut";
  const rutApoderado = dataKey === "ap" ? "ApRut" : "ApsuRut";
  const rutDinamico =
    dataBuscaAl[`${dataKey}_rut`] + "-" + dataBuscaAl[`${dataKey}_dv`];
  const rutDinamicoFmto = FmtoRut(rutDinamico);
  const refsRut = refs[rutFamilia].current;
  // setDataBuscaAl({ ...dataBuscaAl.swParentesco, swParentesco: 0 });
  //console.log("El valor de dataBuscaAl:=>", dataBuscaAl);
  const EsVacio = (valor) => {
    return valor === 0 || valor === "" || valor === null || valor === undefined;
  };

  if (EsVacio(refsRut) && !EsVacio(rutDinamicoFmto)) {
    // console.log(
    //   "****refsRut venia en blanco rutFamilia =>",
    //   rutFamilia,
    //   " rutApoderado : =>",
    //   rutApoderado
    // );
    refs[rutFamilia].current = rutDinamicoFmto;
    refs[rutApoderado].current = rutDinamicoFmto;
  }
  //console.log(
  //  " dataBuscaAl:=>",
  //  dataBuscaAl,
  //  " refs[rutFamilia].current =>",
  //  refs[rutFamilia].current,
  //  "refs =>",
  //  refs,
  //  " parentType:=>",
  //  parentType
  //);

  if (parentType) {
    const [rut, dv, nombres, apat, amat] = parentFields[parentType];

    //console.log(
    //  "dataKey =>",
    //  dataKey,
    //  " dataBuscaAl[{dataKey}_rut]",
    //  dataBuscaAl[`${dataKey}_rut`],
    //  "[rut] =>",
    //  [rut]
    //);

    setDataBuscaAl((prev) => ({
      ...prev,
      [rut]: dataBuscaAl[`${dataKey}_rut`],
      [dv]: dataBuscaAl[`${dataKey}_dv`],
      [nombres]: dataBuscaAl[`${dataKey}_nombres`],
      [apat]: dataBuscaAl[`${dataKey}_apat`],
      [amat]: dataBuscaAl[`${dataKey}_amat`],
    }));

    //     setDataBuscaAl({
    //       ...dataBuscaAl,
    //       [rut]: dataBuscaAl[`${dataKey}_rut`],
    //       [dv]: dataBuscaAl[`${dataKey}_dv`],
    //       [nombres]: dataBuscaAl[`${dataKey}_nombres`],
    //       [apat]: dataBuscaAl[`${dataKey}_apat`],
    //       [amat]: dataBuscaAl[`${dataKey}_amat`],
    //     });
  }
};

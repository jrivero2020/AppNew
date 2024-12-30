// import { useState } from "react";
import { api_getApoderadoNombres } from "./../../docentes/api-docentes";

export const ConsultaApoderadoNombres = (padres, apDup, setApDup) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  let retorno = false;
  console.log("ConsultaApoderadoNombres padres=>", padres);
  api_getApoderadoNombres(padres, signal).then((data) => {
    if (data && data.error) {
      return false;
    } else {
      // eslint-disable-next-line no-unused-vars
      const [results, metadata] = data;
      if (
        results[0] === undefined ||
        results[0] === null ||
        Object.keys(results[0]).length === 0
      ) {
        return false;
      } else {
        const dataApo = results[0];
        setApDup((prev) => ({ ...prev, dataApo }));
        alert(
          "Apoderado ya existe " +
            dataApo.rut +
            dataApo.dv +
            dataApo.nombres +
            dataApo.apat +
            dataApo.amat +
            dataApo.email +
            dataApo.domicilio +
            dataApo.comuna
        );
        console.log("results[0] =>", results[0]);
        console.log("dataApo =>", dataApo);

        retorno = true;
      }
    }
  });
  if (apDup) {
    console.log("apDup despues de cargar =>", apDup);
  }
  return retorno;
};

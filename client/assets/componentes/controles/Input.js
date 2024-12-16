import { TextField } from "@mui/material";
import React from "react";

export default function Input(props) {
  const { name, label, value, onChange } = props;

  return (
    <TextField
      inputProps={{ style: { fontSize: "10px", color: "blue" } }}
      variant="outlined"
      label={label}
      value={value}
      name={name}
      onChange={onChange}
    />
  );
}

/*
cconst handleChange = useCallback(
  (name) => (event) => {
    const { value } = event.target;

    // Primero, actualizamos el campo específico que disparó el cambio
    setDataBuscaAl((prev) => {
      const updatedData = { ...prev, [name]: value }; // Preservar y actualizar el campo específico

      // Verificar si el cambio proviene del select de parentesco
      const numValor = Number(value);
      const isParentesco =
        (name === "al_idparentesco" || name === "al_idparentescosupl") &&
        [1, 2].includes(numValor);

      if (isParentesco) {
        if (name === "al_idparentesco") {
          // Actualizar datos para apoderado principal
          if (numValor === 1) {
            // Padre
            updatedData.padre_rut = prev.Ap_Rut;
            updatedData.padre_dv = prev.ap_dv;
            updatedData.padre_nombres = prev.ap_nombres;
            updatedData.padre_apat = prev.ap_apat;
            updatedData.padre_amat = prev.ap_amat;
            updatedData.PadRut = prev.ApRut; // Formateado
          } else {
            // Madre
            updatedData.madre_rut = prev.Ap_Rut;
            updatedData.madre_dv = prev.ap_dv;
            updatedData.madre_nombres = prev.ap_nombres;
            updatedData.madre_apat = prev.ap_apat;
            updatedData.madre_amat = prev.ap_amat;
            updatedData.madRut = prev.ApRut; // Formateado
          }
        } else {
          // Actualizar datos para apoderado suplente
          if (numValor === 1) {
            // Padre
            updatedData.padre_rut = prev.Apsu_Rut;
            updatedData.padre_dv = prev.apsu_dv;
            updatedData.padre_nombres = prev.apsu_nombres;
            updatedData.padre_apat = prev.apsu_apat;
            updatedData.padre_amat = prev.apsu_amat;
            updatedData.PadRut = prev.ApsuRut; // Formateado
          } else {
            // Madre
            updatedData.madre_rut = prev.Apsu_Rut;
            updatedData.madre_dv = prev.apsu_dv;
            updatedData.madre_nombres = prev.apsu_nombres;
            updatedData.madre_apat = prev.apsu_apat;
            updatedData.madre_amat = prev.apsu_amat;
            updatedData.madRut = prev.ApsuRut; // Formateado
          }
        }
      }

      return updatedData; // Retornar el estado actualizado
    });
  },
  []
);
*/

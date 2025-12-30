import React from "react";
import { Typography } from "@mui/material";
import { FmtoRut } from "../assets/js/FmtoRut";

function DatosDinamicosCertificado({ datoAlumno, agno }) {
  const valumno = datoAlumno.genero === "M" ? "El alumno " : "La alumna ";
  const vmatri = datoAlumno.genero === "M" ? "matriculado " : "matriculada ";
  const vinscrito = datoAlumno.genero === "M" ? "inscrito " : "inscrita ";

  return (
    <Typography align="justify" sx={{ mx: 0.5, fontSize: 14 }}>
      {valumno}{" "}
      <b>
        {datoAlumno.nombres} {datoAlumno.apat} {datoAlumno.amat}
      </b>
      , cédula de identidad Nº{" "}
      <b>{FmtoRut(datoAlumno.rut + datoAlumno.dv)}</b>, {vinscrito} con el Nº{" "}
      <b>{datoAlumno.idmatricula}</b> del Registro, año {agno}, se encuentra{" "}
      {vmatri} y asistiendo regularmente a nuestro establecimiento, cursando 
      actualmente: <b>{datoAlumno.desc_grado} {datoAlumno.letra}</b>.
    </Typography>
  );
}

export default DatosDinamicosCertificado;
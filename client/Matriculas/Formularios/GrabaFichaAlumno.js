// import { useContext } from "react";
import { validateFormAlumno } from "./helpers/ValidaFichaAlumno";
// import { AuthContext } from "./../../core/AuthProvider";
import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";
import {RutANumeros} from './../../assets/js/FmtoRut'

export const GrabarAlumno = ({
  resultado,
  setResultado,
  setSnackbar,
  dataBuscaAl,
  setDataBuscaAl,
  jwt,
}) => {

  const actualizarRut = (campoRut, campoDv, nuevoRut) => {
    const rutLimpio = RutANumeros(nuevoRut);
    const dvLimpio = nuevoRut.slice(-1).toUpperCase();
    // const numeroExtraido = parseInt(rutLimpio.match(/\d+/)[0], 10);
    console.log( "*Rut limpio", rutLimpio, " y de dvLimpio :", 
      dvLimpio, " nuevoRut ", nuevoRut, ' el rut en dataBuscaAl : ', dataBuscaAl[campoRut] )


    if (dataBuscaAl[campoRut] !== nuevoRut) { 
      console.log("*******LOS RUT son distintos y hago el setDataBuscaAl")
      setDataBuscaAl((prev) => ({
        ...prev,
        [campoRut]:  parseInt(rutLimpio.match(/\d+/)[0], 10),
        [campoDv]: dvLimpio,
      }));
    }
  };
  

  actualizarRut('ap_rut', 'ap_dv', resultado.ApRut);
  actualizarRut('apsu_rut', 'apsu_dv', resultado.ApsuRut);
  actualizarRut('madre_rut', 'madre_dv', resultado.MadRut);
  actualizarRut('padre_rut', 'padre_dv', resultado.PadRut);

  
  console.log( "*Valor de GrabarAlumno resultado", resultado, " y de dataBuscaAl :", dataBuscaAl)
  console.log("Voy a validar formulario****************");


let validaForm = validateFormAlumno(dataBuscaAl);

  if ( validaForm.length === 0) {
    api_CreaModificaAlumno(
      { al_rut: dataBuscaAl.al_rut, resul: resultado.resul },
      { t: jwt.token },
      dataBuscaAl
    )
      .then((data) => {
        console.log("api_CreaModificaAlumno, retorno en data ===>", data);
        if (data && data.error) {
          if (data.error === 409) {
            setSnackbar({
              mensaje:
                "El alumno ya existe con el RUT proporcionado." || data.message,
              severity: "error",
              variant: "filled",
            });
          } else {
            setResultado({ ...resultado, result: 11 });
          }
          console.log("data.error :", data);

          return false;
        } else {
          setSnackbar({
            mensaje: "Datos se grabaron",
            severity: "success",
            variant: "filled",
          });
        }
      })
      .catch((error) => {
        // Manejo de errores aquí
        console.error("Error al grabar alumno:", error);
        if (error.response) {
          // Si el servidor respondió con un código de estado fuera del rango 2xx
          setSnackbar({
            mensaje: error.response.data.message || "Error al grabar alumno.",
            severity: "error",
            variant: "filled",
          });
        } else {
          // Si hubo un error en la configuración de la solicitud
          setSnackbar({
            mensaje: "Error en la conexión con el servidor.",
            severity: "error",
            variant: "filled",
          });
        }
      });
  } else {

    // let msg = "";
    // if (dataBuscaAl.ap_rut === 0 || dataBuscaAl.apsu_rut === 0) {
    //   msg = "Hay Errores en el formulario II.- Del Apoderado";
    // } else if (dataBuscaAl.madre_rut === 0 || dataBuscaAl.padre_rut === 0) {
    //   msg = "Hay Errores en el formulario III.- Familiares";
    // } else {
    //   msg = "Hay Errores en el formulario I.- Del Alumno";
    // }

    setSnackbar({
      mensaje: validaForm,
      severity: "error",
      variant: "filled",
    });
  }
};

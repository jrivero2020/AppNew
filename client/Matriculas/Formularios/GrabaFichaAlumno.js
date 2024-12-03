// import { useContext } from "react";
import { ValidaFichaAlumno, validateFormAlumno } from "./helpers/ValidaFichaAlumno";
// import { AuthContext } from "./../../core/AuthProvider";
import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";

export const GrabarAlumno = ({
  resultado,
  setResultado,
  setSnackbar,
  dataBuscaAl,
  jwt,
}) => {
  // const { dataBuscaAl } = useContext(AuthContext);
  // const { jwt } = useContext(AuthContext);
let validaForm = validateFormAlumno(dataBuscaAl);
  console.log( "**********Valor de validaForm********** ", validaForm)
  console.log("estoy en grabaralumno valor de resultado : ", resultado);

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

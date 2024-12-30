import { validateFormAlumno } from "./helpers/ValidaFichaAlumno";
import { api_CreaModificaAlumno } from "./../../docentes/api-docentes";
import { cFichaAlumnoOrdenada } from "./../../Matriculas/matriculasCampos";

export const GrabarAlumno = ({
  resultado,
  setResultado,
  setSnackbar,
  dataBuscaAl,
  setDataBuscaAl,
  jwt,
}) => {
  const validateAndCleanData = () => {
    setDataBuscaAl((prev) => {
      // Recorremos el array con los nombres de los campos
      const updatedData = { ...prev }; // Creamos una copia del estado actual
      cFichaAlumnoOrdenada.forEach((field) => {
        // Si el campo en prev es null, lo actualizamos a ""
        if (updatedData[field] === null || updatedData[field] === undefined) {
          updatedData[field] = "";
        }
      });
      return updatedData; // Devolvemos el objeto actualizado
    });
  };

  // console.log("antes de validate ", dataBuscaAl);
  validateAndCleanData();

  //console.log("dataBuscaAl sin nulos =>", dataBuscaAl);

  const validaForm = validateFormAlumno(dataBuscaAl);

  if (validaForm.length === 0) {
    api_CreaModificaAlumno(
      { al_rut: dataBuscaAl.al_rut, resul: resultado.result },
      { t: jwt.token },
      dataBuscaAl
    )
      .then((data) => {
        // console.log("api_CreaModificaAlumno, retorno en data ===>", data);
        if (data && data.error) {
          setResultado((prev) => ({ ...prev, result: 11 }));
          if (data.error === 409) {
            setSnackbar({
              mensaje:
                "El alumno ya existe con el RUT proporcionado." || data.message,
              severity: "error",
              variant: "filled",
            });
          }
          setSnackbar({
            mensaje: "El Servidor no grabó los datos y responde con error",
            severity: "success",
            variant: "filled",
          });
          // console.log("data.error :", data);
          return false;
        } else {
          setSnackbar({
            mensaje: "Datos se grabaron",
            severity: "success",
            variant: "filled",
          });
          // setResultado((prev) => ({ ...prev, result: 13 }));
        }
      })
      .catch((error) => {
        //  setResultado((prev) => ({ ...prev, result: 11 }));

        // Manejo de errores aquí
        // console.error("Error al grabar alumno:", error);
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
    // setResultado((prev) => ({ ...prev, result: 14 }));
    console.log("Error en validacion: ", validaForm);
    setSnackbar({
      mensaje: validaForm,
      severity: "error",
      variant: "filled",
    });
  }
  return;
};

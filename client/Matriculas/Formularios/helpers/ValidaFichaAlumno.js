import DOMPurify from "dompurify";
import { validarRut } from "./../../../assets/js/FmtoRut";
import { cFichaAlumnoOrdenada } from "./../../../Matriculas/matriculasCampos";

const validarNroFono = (numero) => {
  // Expresión regular para celular chileno
  const regexCelular = /^(?:\+56|56|0)?9\d{8}$/;

  // Expresión regular para teléfono fijo chileno
  const regexFijo =
    /^(?:\+56|56|0)?(2|3[2-5]|4[1-5]|5[1-8]|6[1-3]|7[1-2]|9[5-7])\d{6,7}$/;

  // Limpiamos el número de espacios y guiones
  const numeroLimpio = numero.replace(/[-\s]/g, "");

  // Validamos contra ambos formatos
  if (regexCelular.test(numeroLimpio)) {
    return true;
  } else if (regexFijo.test(numeroLimpio)) {
    return true;
  } else {
    return false;
  }
};

const validarEmail = (email) => {
  // Expresión regular para validar correos electrónicos
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

  // Validamos el email con la expresión regular
  if (!regexEmail.test(email)) {
    return false;
  }

  // Extra validación opcional: asegúrate de que el dominio sea válido si lo necesitas
  const dominio = email.split("@")[1];
  const tld = dominio.split(".").pop(); // Obtiene la última parte después del punto
  return tld.length >= 2 && tld.length <= 63; // Verifica que el TLD sea válido
};

export const ValidaFichaAlumno = (name, value, curso) => {
  const camposExcluidosDeSanitizacion = [
    "al_idcurso",
    "al_id_comuna",
    "al_canthnos",
    "al_cur_repe",
  ];

  let error = "";

  if (!camposExcluidosDeSanitizacion.includes(name)) {
    const strValue = String(value);
    const sanitizedInput = DOMPurify.sanitize(strValue, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    if (strValue !== sanitizedInput) {
      return (
        "Intento de contenido malicioso detectado!!, name = " +
        name +
        "  value =" +
        value +
        ""
      );
    }
  }

  switch (name) {
    case "al_nombres":
      if (!value.trim()) {
        error = "El nombre alumno es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre alumno debe tener al menos 3 caracteres.";
      }
      break;

    case "al_apat":
      if (!value.trim()) {
        error = "El apellido paterno alumno es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido paterno alumno debe tener al menos 3 caracteres.";
      }
      break;
    case "al_amat":
      if (!value.trim()) {
        error = "El apellido materno alumno es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido materno alumno debe tener al menos 3 caracteres.";
      }
      break;

    case "al_rut":
      if (!/^\d{7,8}-[\dkK]$/.test(value)) {
        error = "El RUT del alumno debe tener un formato válido.";
      }
      break;

    case "al_idcurso":
      if (value === "" || value === 0) {
        error = "Debe seleccionar un curso de la lista para el alumno";
      }
      break;
    case "al_id_comuna":
      if (value === "" || value === 0) {
        error = "Debe seleccionar una comuna de la lista para el alumno";
      }
      break;
    case "al_cur_repe":
      if (value === "" || value === 0) {
        error = "Debe seleccionar cursos repetidos (Sí o No) del alumno";
      }
      break;

    case "al_idvivecon":
      if (value === "" || value === 0) {
        error = "Debe seleccionar con quien vive el alumno";
      }
      break;
    case "al_enfermo":
      if (value === "" || value === 0) {
        error = "Debe seleccionar si tiene o no enfermedad el alumno";
      }
      break;

    case "al_genero":
      if (value === "" || value === 0) {
        error = "Debe seleccionar sexo de alumno";
      }
      break;

    case "al_f_nac":
      error = validaFechaAlumno(value, curso);
      if (!error) error = "";
      break;

    case "al_domicilio":
      if (!value.trim()) {
        error = "El domicilio de alumno es obligatorio.";
      } else if (value.length < 3) {
        error = "El domicilio alumno debe tener al menos 3 caracteres.";
      }
      break;

    // ***********************************************
    // Datos del apoderado
    case "ap_rut":
      if (!/^\d{7,8}-[\dkK]$/.test(value)) {
        error = "El RUT del apoderado debe tener un formato válido.";
      }
      break;

    case "ap_nombres":
      if (!value.trim()) {
        error = "Nombre apoderado es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre apoderado debe tener al menos 3 caracteres.";
      }
      break;

    case "ap_apat":
      if (!value.trim()) {
        error = "Apellido paterno apoderado es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido apoderado debe tener al menos 3 caracteres.";
      }
      break;
    case "ap_amat":
      if (!value.trim()) {
        error = "Apellido materno apoderado es obligatorio.";
      } else if (value.length < 3) {
        error = "Apellido materno apoderado debe tener al menos 3 caracteres.";
      }
      break;
    case "al_idparentesco":
      if (value === "" || value === 0) {
        error = "Debe seleccionar Parentesco del apoderado";
      }
      break;
    case "ap_fono1":
      if (!value.trim()) {
        error = "Teléfono 1 de apoderado es obligatorio.";
      } else if (!validarNroFono(value)) {
        error = "Nro de teléfono 1 de apoderado es inválido";
      }
      break;
    case "ap_fono2":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono 2 de apoderado es inválido";
      }
      break;
    case "ap_emergencia":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono emergencia de apoderado es inválido";
      }
      break;

    case "ap_email":
      if (value.trim() && !validarEmail(value)) {
        error = "Correo apoderado no es válido";
      }
      break;
    case "ap_domicilio":
      if (!value.trim()) {
        error = "El domicilio apoderado es obligatorio.";
      } else if (value.length < 3) {
        error = "El domicilio apoderado debe tener al menos 3 caracteres.";
      }
      break;
    case "ap_id_comuna":
      if (value === "" || value === 0) {
        error = "Debe seleccionar una comuna de la lista para el apoderado";
      }
      break;
    // ***********************************************
    // Datos del apoderado Suplente

    case "apsu_nombres":
      if (!value.trim()) {
        error = "Nombre Apod.Suplente es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre Apod.Suplente debe tener al menos 3 caracteres.";
      }
      break;

    case "apsu_apat":
      if (!value.trim()) {
        error = "Apellido paterno Apod.Suplente es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido Apod.Suplente debe tener al menos 3 caracteres.";
      }
      break;
    case "apsu_amat":
      if (!value.trim()) {
        error = "Apellido materno Apod.Suplente es obligatorio.";
      } else if (value.length < 3) {
        error =
          "Apellido materno Apod.Suplente debe tener al menos 3 caracteres.";
      }
      break;
    case "al_idparentescosupl":
      if (value === "" || value === 0) {
        error = "Debe seleccionar Parentesco del Apod.Suplente";
      }
      break;
    case "apsu_fono1":
      if (!value.trim()) {
        error = "Teléfono 1 Apod.Suplente es obligatorio.";
      } else if (!validarNroFono(value)) {
        error = "Nro de teléfono 1 Apod.Suplente es inválido";
      }
      break;
    case "apsu_fono2":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono 2 Apod.Suplente es inválido";
      }
      break;
    case "apsu_emergencia":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono emergencia Apod.Suplente es inválido";
      }
      break;

    case "apsu_email":
      if (value.trim() && !validarEmail(value)) {
        error = "Correo Apod.Suplente no es válido";
      }
      break;
    case "apsu_domicilio":
      if (!value.trim()) {
        error = "El domicilio Apod.Suplente es obligatorio.";
      } else if (value.length < 3) {
        error = "El domicilio Apod.Suplente debe tener al menos 3 caracteres.";
      }
      break;
    case "apsu_id_comuna":
      if (value === "" || value === 0) {
        error = "Debe seleccionar una comuna de la lista para el Apod.Suplente";
      }
      break;
    //*************************************************************** */
    // atecedentes de padre y madre

    case "madre_nombres":
      if (!value.trim()) {
        error = "Nombre madre es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre madre debe tener al menos 3 caracteres.";
      }
      break;

    case "madre_apat":
      if (!value.trim()) {
        error = "Apellido paterno madre es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido madre debe tener al menos 3 caracteres.";
      }
      break;
    case "madre_amat":
      if (!value.trim()) {
        error = "Apellido materno madre es obligatorio.";
      } else if (value.length < 3) {
        error = "Apellido materno madre debe tener al menos 3 caracteres.";
      }
      break;

    case "padre_nombres":
      if (!value.trim()) {
        error = "Nombre padre es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre padre debe tener al menos 3 caracteres.";
      }
      break;

    case "padre_apat":
      if (!value.trim()) {
        error = "Apellido paterno padre es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido padre debe tener al menos 3 caracteres.";
      }
      break;
    case "mpadre_amat":
      if (!value.trim()) {
        error = "Apellido materno padre es obligatorio.";
      } else if (value.length < 3) {
        error = "Apellido materno padre debe tener al menos 3 caracteres.";
      }
      break;
    case "al_ingresogrupofamiliar":
      if (!value.trim()) {
        error = "Ingreso del grupo familiar es necesario.";
      } else if (value.length < 3) {
        error = "Apellido materno padre debe tener al menos 3 caracteres.";
      }
      break;

    case "al_vivienda":
      if (value === "" || value === 0) {
        error = "Debe seleccionar tipo de vivienda";
      }
      break;
    case "al_evaluareligion":
      console.log("Rvalua religion ", value);
      if (value === "" || value === 0) {
        error = "Debe seleccionar sie evalúa religión";
      }
      break;

    /**************************************************************** */
    default:
      break;
  }

  return error;
};

export const validaFechaAlumno = (fecha, curso, anioMatricula = 2025) => {
  let error = "";

  try {
    // Detectar el formato de la fecha automáticamente
    const convertirFecha = (fecha) => {
      if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
        // Formato dd-mm-aaaa
        const [dia, mes, anio] = fecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        // Formato aaaa-mm-dd
        const [anio, mes, dia] = fecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia);
      }
      throw new Error("Formato de fecha no válido");
    };

    const fechaNacimiento = convertirFecha(fecha);

    /*************************************************** */
    /*   Falta Implementar                               */
    /*
    
    // Fecha de referencia: 31 de marzo del año de matrícula
    const referencia = new Date(anioMatricula, 2, 31);

    // Calcular la diferencia de años
    const calcularEdad = (nacimiento, referencia) => {
      let edad = referencia.getFullYear() - nacimiento.getFullYear();
      if (
        referencia.getMonth() < nacimiento.getMonth() ||
        (referencia.getMonth() === nacimiento.getMonth() &&
          referencia.getDate() < nacimiento.getDate())
      ) {
        edad--;
      }
      return edad;
    };

    const edad = calcularEdad(fechaNacimiento, referencia);

    // Aplicar reglas de validación según el curso
    if (( curso === 1 || curso === 2 ) && edad < 4) {
      error = `La fecha no es válida: la edad no puede ser menor a 4 años al 31 de marzo de ${anioMatricula}.`;
    } else if (curso === 3 && edad > 5) {
      error = `La fecha no es válida: la edad no puede ser mayor a 5 años al 31 de marzo de ${anioMatricula}.`;
    } else if (curso > 9 && edad > 18) {
      error = `La fecha no es válida: la edad no puede ser mayor a 18 años al 31 de marzo de ${anioMatricula}.`;
    }
      */
  } catch (e) {
    error = e.message;
  }
  // console.log("Validando fecha error = ", error);
  return error; // Si no hay error, retorna una cadena vacía
};

export const validateFormAlumno = (dataBuscaAl) => {
  const camposExcluidos = [
    "al_rut",
    "al_dv",
    "al_activo",
    "al_agno_matricula",
    "al_cod_ense",
    "al_cod_grado",
    "al_evaluareligion",
    "al_fecharetiro",
    "al_fincorpora",
    "al_id_alumno",
    "al_ingresogrupofamiliar",
    "al_letra",
    "al_motivoretiro",
    "al_nro_matricula",
    "al_nrofamiliar",
    "ap_rut",
    "ap_dv",
    "ap_parentesco",
    "ap_sexo",
    "apsu_rut",
    "apsu_dv",
    "apsu_parentesco",
    "al_idmadre",
    "al_idpadre",
    "al_idapoderado",
    "al_idapoderadosupl",
    "madre_rut",
    "madre_dv",
    "padre_rut",
    "padre_dv",
  ];
  const prefijos = ["al_", "ap_", "apsu_", "padre_", "madre_"]; // Primero "al_", luego "ap_", después "apsu_"

  const campos = [
    { rut: "ap_rut", dv: "ap_dv", nombre: "Apoderado" },
    { rut: "apsu_rut", dv: "apsu_dv", nombre: "Apoderado suplente" },
  ];

  const clavesFiltradas = cFichaAlumnoOrdenada.filter(
    (key) => !camposExcluidos.includes(key)
  );

  function esFalsyDefinida(value) {
    return value === 0 || value === "" || value === null;
  }

  const validarFormatoRut = (campoRut, campoDv, nombreCampo) => {
    const rut = `${dataBuscaAl[campoRut]}-${dataBuscaAl[campoDv]}`;
    if (!validarRut(rut)) {
      return `El RUT de ${nombreCampo} no es válido.`;
    }
    return null;
  };

  const validarCampos = (prefijo) => {
    console.log(
      "Claves filtradas :",
      clavesFiltradas,
      "  dataBuscaAl =>",
      dataBuscaAl
    );

    // *****************************************************
    // validar los ruts de los formularios
    for (let { rut, dv, nombre } of campos) {
      const error = validarFormatoRut(rut, dv, nombre);
      if (error) return error;
    }
    // fin ruts de formulario
    // *******************************************************

    // ********************************************************
    // se permite rut de madre o padre sin datos, pero no los 2
    if (
      esFalsyDefinida(dataBuscaAl["padre_rut"]) &&
      esFalsyDefinida(dataBuscaAl["padre_rut"])
    ) {
      return "Debe ingresar Rut de la Madre o el Padre, No se permite ambos padres sin Rut!";
    }
    if (!esFalsyDefinida(dataBuscaAl["padre_rut"])) {
      const error = validarFormatoRut("padre_rut", "padre_dv", "Padre");
      if (error) return error;
    }
    if (!esFalsyDefinida(dataBuscaAl["madre_rut"])) {
      const error = validarFormatoRut("madre_rut", "madre_dv", "Madre");
      if (error) return error;
    }
    // fin permite rut de madre o padre sin datos, pero no los 2
    // **********************************************************

    // *******************************************************
    // Validar todo el Formulario

    // Filtra las claves que coincidan con el prefijo y no estén excluidas
    //     const clavesFiltradas = cFichaAlumnoOrdenada.filter(
    //       (key) => key.startsWith(prefijo) && !camposExcluidos.includes(key)
    //     );

    /*
    for (const key of Object.keys(dataBuscaAl).filter(
      (key) => key.startsWith(prefijo) && !camposExcluidos.includes(key)
    )) {
      const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
      if (error) {
        return error; // Retorna el error y detiene la validación para este prefijo
      }
    }
*/

    for (const key of clavesFiltradas) {
      if (dataBuscaAl.hasOwnProperty(key)) {
        const valor = dataBuscaAl[key];

        console.log("Se valida ", key, " con valor :", valor);
        const error = ValidaFichaAlumno(key, valor);
        if (error) {
          return error; // Retorna el error y detiene la validación
        }
      }
    }
    return null; // No hay errores en este prefijo
  };
  /*
  for (const prefijo of prefijos) {
    // console.log("validarCampo con prefijo :,", prefijo);
    // console.log("Valor de dataBuscaAl : ", dataBuscaAl);
    const error = validarCampos(prefijo);
    if (error) {
      // console.log(`Error encontrado para el prefijo "${prefijo}":`, error);
      return error; // Detener el proceso si se encuentra un error
    }
  }
*/

  const error = validarCampos();
  if (error) {
    return error; // Detener el proceso si se encuentra un error
  }

  /*
  // Validar campos específicos en la etapa de "madre_" y "padre_"
  const prefijosValidacionAdicional = ["madre_", "padre_"];
  const camposAdicionales = [
    "al_ingresogrupofamiliar",
    "al_vivienda",
    "al_evaluareligion",
  ];
  for (const prefijo of prefijosValidacionAdicional) {
    if (prefijos.includes(prefijo)) {
      for (const key of camposAdicionales) {
        if (dataBuscaAl[key] !== undefined) {
          // Solo validar si el campo existe en el objeto
          const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
          if (error) {
            // console.log(`Error encontrado en campo adicional "${key}":`, error);
            return error; // Detener si hay error en campos adicionales
          }
        }
      }
    }
  }
*/

  return "";
};

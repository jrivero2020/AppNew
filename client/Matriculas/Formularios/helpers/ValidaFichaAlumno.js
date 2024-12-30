import DOMPurify from "dompurify";
import { validarRut } from "./../../../assets/js/FmtoRut";
import { cFichaAlumnoOrdenada } from "./../../../Matriculas/matriculasCampos";
// import { ConsultaApoderadoNombres } from "../ConsultaApoderadoNombres";

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
  const fichas = [
    "(I.- Del Alumno)",
    "(II.- Del Apoderado)",
    "(III.- Familiares)",
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
        error = "El nombre alumno es obligatorio." + fichas[0];
      } else if (value.length < 3) {
        error =
          "El nombre alumno debe tener al menos 3 caracteres." + fichas[0];
      }
      break;

    case "al_apat":
      if (!value.trim()) {
        error = "El apellido paterno alumno es obligatorio." + fichas[0];
      } else if (value.length < 3) {
        error =
          "El apellido paterno alumno debe tener al menos 3 caracteres." +
          fichas[0];
      }
      break;
    case "al_amat":
      if (!value.trim()) {
        error = "El apellido materno alumno es obligatorio." + fichas[0];
      } else if (value.length < 3) {
        error =
          "El apellido materno alumno debe tener al menos 3 caracteres." +
          fichas[0];
      }
      break;

    case "al_idcurso":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar un curso de la lista para el alumno" + fichas[0];
      }
      break;
    case "al_id_comuna":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar una comuna de la lista para el alumno" + fichas[0];
      }
      break;
    case "al_cur_repe":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar cursos repetidos (Sí o No) del alumno" + fichas[0];
      }
      break;

    case "al_idvivecon":
      if (value === "" || value === 0) {
        error = "Debe seleccionar con quien vive el alumno" + fichas[0];
      }
      break;
    case "al_enfermo":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar si tiene o no enfermedad el alumno" + fichas[0];
      }
      break;

    case "al_genero":
      if (value === "" || value === 0) {
        error = "Debe seleccionar sexo de alumno" + fichas[0];
      }
      break;

    case "al_f_nac":
      error = validaFechaAlumno(value, curso);
      if (!error) error = "";
      break;

    case "al_domicilio":
      if (!value.trim()) {
        error = "El domicilio de alumno es obligatorio." + fichas[0];
      } else if (value.length < 3) {
        error =
          "El domicilio alumno debe tener al menos 3 caracteres." + fichas[0];
      }
      break;

    // ***********************************************
    // Datos del apoderado
    //    case "ap_rut":
    //      if (!/^\d{7,8}-[\dkK]$/.test(value)) {
    //        error = "El RUT del apoderado debe tener un formato válido.";
    //      }
    //      break;

    case "ap_nombres":
      if (!value.trim()) {
        error = "Nombre apoderado es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El nombre apoderado debe tener al menos 3 caracteres." + fichas[1];
      }
      break;

    case "ap_apat":
      if (!value.trim()) {
        error = "Apellido paterno apoderado es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El apellido apoderado debe tener al menos 3 caracteres." + fichas[1];
      }
      break;
    case "ap_amat":
      if (!value.trim()) {
        error = "Apellido materno apoderado es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "Apellido materno apoderado debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;
    case "al_idparentesco":
      if (value === "" || value === 0) {
        error = "Debe seleccionar Parentesco del apoderado" + fichas[1];
      }
      break;
    case "ap_fono1":
      if (!value.trim()) {
        error = "Teléfono 1 de apoderado es obligatorio." + fichas[1];
      } else if (!validarNroFono(value)) {
        error = "Nro de teléfono 1 de apoderado es inválido" + fichas[1];
      }
      break;
    case "ap_fono2":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono 2 de apoderado es inválido" + fichas[1];
      }
      break;
    case "ap_emergencia":
      if (value.trim() && !validarNroFono(value)) {
        error =
          "Nro de teléfono emergencia de apoderado es inválido" + fichas[1];
      }
      break;

    case "ap_email":
      if (value.trim() && !validarEmail(value)) {
        error = "Correo apoderado no es válido" + fichas[1];
      }
      break;
    case "ap_domicilio":
      if (!value.trim()) {
        error = "El domicilio apoderado es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El domicilio apoderado debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;
    case "ap_id_comuna":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar una comuna de la lista para el apoderado" +
          fichas[1];
      }
      break;
    // ***********************************************
    // Datos del apoderado Suplente

    case "apsu_nombres":
      if (!value.trim()) {
        error = "Nombre Apod.Suplente es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El nombre Apod.Suplente debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;

    case "apsu_apat":
      if (!value.trim()) {
        error = "Apellido paterno Apod.Suplente es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El apellido Apod.Suplente debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;
    case "apsu_amat":
      if (!value.trim()) {
        error = "Apellido materno Apod.Suplente es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "Apellido materno Apod.Suplente debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;
    case "al_idparentescosupl":
      if (value === "" || value === 0) {
        error = "Debe seleccionar Parentesco del Apod.Suplente" + fichas[1];
      }
      break;
    case "apsu_fono1":
      if (!value.trim()) {
        error = "Teléfono 1 Apod.Suplente es obligatorio." + fichas[1];
      } else if (!validarNroFono(value)) {
        error = "Nro de teléfono 1 Apod.Suplente es inválido" + fichas[1];
      }
      break;
    case "apsu_fono2":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono 2 Apod.Suplente es inválido" + fichas[1];
      }
      break;
    case "apsu_emergencia":
      if (value.trim() && !validarNroFono(value)) {
        error =
          "Nro de teléfono emergencia Apod.Suplente es inválido" + fichas[1];
      }
      break;

    case "apsu_email":
      if (value.trim() && !validarEmail(value)) {
        error = "Correo Apod.Suplente no es válido" + fichas[1];
      }
      break;
    case "apsu_domicilio":
      if (!value.trim()) {
        error = "El domicilio Apod.Suplente es obligatorio." + fichas[1];
      } else if (value.length < 3) {
        error =
          "El domicilio Apod.Suplente debe tener al menos 3 caracteres." +
          fichas[1];
      }
      break;
    case "apsu_id_comuna":
      if (value === "" || value === 0) {
        error =
          "Debe seleccionar una comuna de la lista para el Apod.Suplente" +
          fichas[1];
      }
      break;
    //*************************************************************** */
    // atecedentes de padre y madre

    case "madre_nombres":
      if (!value.trim()) {
        error = "Nombre madre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error = "El nombre madre debe tener al menos 3 caracteres." + fichas[2];
      }
      break;

    case "madre_apat":
      if (!value.trim()) {
        error = "Apellido paterno madre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error =
          "El apellido madre debe tener al menos 3 caracteres." + fichas[2];
      }
      break;
    case "madre_amat":
      if (!value.trim()) {
        error = "Apellido materno madre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error =
          "Apellido materno madre debe tener al menos 3 caracteres." +
          fichas[2];
      }
      break;

    case "padre_nombres":
      if (!value.trim()) {
        error = "Nombre padre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error = "El nombre padre debe tener al menos 3 caracteres." + fichas[2];
      }
      break;

    case "padre_apat":
      if (!value.trim()) {
        error = "Apellido paterno padre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error =
          "El apellido padre debe tener al menos 3 caracteres." + fichas[2];
      }
      break;
    case "mpadre_amat":
      if (!value.trim()) {
        error = "Apellido materno padre es obligatorio." + fichas[2];
      } else if (value.length < 3) {
        error =
          "Apellido materno padre debe tener al menos 3 caracteres." +
          fichas[2];
      }
      break;
    case "al_ingresogrupofamiliar":
      if (value === "" || value === 0) {
        error = "Ingreso del grupo familiar es necesario." + fichas[2];
      }
      break;

    case "al_vivienda":
      if (value === "" || value === 0) {
        error = "Debe seleccionar tipo de vivienda" + fichas[2];
      }
      break;
    case "al_evaluareligion":
      if (value === "" || value === 0) {
        error = "Debe seleccionar sie evalúa religión" + fichas[2];
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
    "al_activo",
    "al_agno_matricula",
    "al_cod_ense",
    "al_cod_grado",
    "al_fecharetiro",
    "al_fincorpora",
    "al_id_alumno",
    "al_letra",
    "al_motivoretiro",
    "al_nro_matricula",
    "ap_parentesco",
    "ap_sexo",
    "apsu_parentesco",
    "al_idmadre",
    "al_idpadre",
    "al_idapoderado",
    "al_idapoderadosupl",
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
      return `El RUT de ${nombreCampo} no es válido. Rut : ${rut}`;
    }
    return null;
  };

  const parentescoMap = {
    1: { role: "padre", message: "El Padre" },
    2: { role: "madre", message: "La Madre" },
  };

  const validateParentesco = (idParentesco, apFields, roleName) => {
    //   "al_idparentesco","ap","Apoderado"

    console.log(
      "dataBuscaAl[idParentesco]=",
      idParentesco,
      "valor:",
      dataBuscaAl[idParentesco],
      "apFields:",
      apFields,
      "roleName:",
      roleName
    );

    if (dataBuscaAl[idParentesco] in parentescoMap) {
      const { role, message } = parentescoMap[dataBuscaAl[idParentesco]];
      console.log("role:", role, "message;", message);
      console.log(
        "cmp rut =>",
        dataBuscaAl[`${apFields}_rut`],
        "!==",
        dataBuscaAl[`${role}_rut`]
      );

      if (dataBuscaAl[`${apFields}_rut`] !== dataBuscaAl[`${role}_rut`]) {
        return `${message} debe tener el mismo rut que el ${roleName} cuando parentesco="${message.substring(
          3
        )}"!`;
      }

      if (
        dataBuscaAl[`${apFields}_nombres`] !== dataBuscaAl[`${role}_nombres`] ||
        dataBuscaAl[`${apFields}_apat`] !== dataBuscaAl[`${role}_apat`] ||
        dataBuscaAl[`${apFields}_amat`] !== dataBuscaAl[`${role}_amat`]
      ) {
        return `${message} se debe llamar igual que ${roleName} cuando parentesco="${message.substring(
          3
        )}"!`;
      }
    }
  };

  const sonNombresIguales = (person1, person2) =>
    dataBuscaAl[`${person1}_nombres`] === dataBuscaAl[`${person2}_nombres`] &&
    dataBuscaAl[`${person1}_apat`] === dataBuscaAl[`${person2}_apat`] &&
    dataBuscaAl[`${person1}_amat`] === dataBuscaAl[`${person2}_amat`];

  const validarCampos = () => {
    // *****************************************************
    // validar los ruts de los formularios excepto de padres
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
      esFalsyDefinida(dataBuscaAl["madre_rut"])
    ) {
      return "Debe ingresar Rut de la Madre o el Padre, No se permite ambos padres sin Rut!";
    }
    if (dataBuscaAl["ap_rut"] === dataBuscaAl["apsu_rut"])
      return 'El apoderado "Suplente" no puede tener el mismo Rut del Apoderado "Titular"!';

    if (!esFalsyDefinida(dataBuscaAl["padre_rut"])) {
      const error = validarFormatoRut("padre_rut", "padre_dv", "Padre");
      if (error) return error;
    }
    if (!esFalsyDefinida(dataBuscaAl["madre_rut"])) {
      const error = validarFormatoRut("madre_rut", "madre_dv", "Madre");
      if (error) return error;
    }
    if (
      !esFalsyDefinida(dataBuscaAl["padre_rut"]) &&
      !esFalsyDefinida(dataBuscaAl["madre_rut"])
    ) {
      if (dataBuscaAl["madre_rut"] === dataBuscaAl["padre_rut"])
        return 'La "Madre" no puede tener el mismo Rut que el "Padre"!';
    }

    if (
      !esFalsyDefinida(dataBuscaAl["al_idparentesco"]) &&
      !esFalsyDefinida(dataBuscaAl["al_idparentescosupl"]) &&
      dataBuscaAl["ap_rut"] !== dataBuscaAl["apsu_rut"]
    ) {
      if (dataBuscaAl["al_idparentescosupl"] === dataBuscaAl["al_idparentesco"])
        return "El Apoderado y el suplente, no pueden tener el mismo parentesco!";
    }
    // fin permite rut de madre o padre sin datos, pero no los 2
    // **********************************************************

    // *******************************************************
    // Validar todo el Formulario

    for (const key of clavesFiltradas) {
      if (dataBuscaAl.hasOwnProperty(key)) {
        const valor = dataBuscaAl[key];
        const error = ValidaFichaAlumno(key, valor);
        if (error) {
          return error; // Retorna el error y detiene la validación
        }
      }
    }
    // Validaciones
    if (sonNombresIguales("ap", "apsu")) {
      return "El Apoderado y el suplente, no se pueden llamar iguales!";
    }

    if (sonNombresIguales("madre", "padre")) {
      return "Los padres no se pueden llamar iguales!";
    }

    // Validar Apoderado
    const apoderadoError = validateParentesco(
      "al_idparentesco",
      "ap",
      "Apoderado"
    );
    if (apoderadoError) return apoderadoError;

    // Validar Apoderado Suplente
    const suplenteError = validateParentesco(
      "al_idparentescosupl",
      "apsu",
      "Apoderado Suplente"
    );
    if (suplenteError) return suplenteError;

    if (dataBuscaAl["al_idparentesco"] === 1) {
      if (dataBuscaAl["ap_rut"] !== dataBuscaAl["padre_rut"])
        return 'El Padre debe tener el mismo rut que el Apoderado cuando parentesco="Padre"!';
    }
    if (dataBuscaAl["al_idparentesco"] === 2) {
      if (dataBuscaAl["ap_rut"] !== dataBuscaAl["madre_rut"])
        return 'La Madre debe tener el mismo rut que el Apoderado cuando parentesco="Madre"!';
    }

    if (dataBuscaAl["al_idparentescosupl"] === 1) {
      if (dataBuscaAl["apsu_rut"] !== dataBuscaAl["padre_rut"])
        return 'El Padre debe tener el mismo rut que el Apoderado Suplente cuando parentesco="Padre"!';
    }
    if (dataBuscaAl["al_idparentescosupl"] === 2) {
      if (dataBuscaAl["apsu_rut"] !== dataBuscaAl["madre_rut"])
        return 'La Madre debe tener el mismo rut que el Apoderado Suplente cuando parentesco="Madre"!';
    }

    return null; // No hay errores en este prefijo
  };

  const error = validarCampos();
  if (error) {
    return error; // Detener el proceso si se encuentra un error
  }
  // validación si los campos de padre o madre están vacíos y se ingresa nombres que ya existen en la b.datos
  /*
  const {
    padre_rut,
    padre_apat,
    padre_amat,
    padre_nombres,
    madre_rut,
    madre_apat,
    madre_amat,
    madre_nombres,
  } = dataBuscaAl;
  const cpadre = {
    aprut: padre_rut,
    apat: padre_apat,
    amat: padre_amat,
    nombres: padre_nombres,
  };
  const cmadre = {
    aprut: madre_rut,
    apat: madre_apat,
    amat: madre_amat,
    nombres: madre_nombres,
  };
  console.log(
    "Voy a validar si exite ap con los mismos nombres cpadre=>",
    cpadre,
    " cmadre=>",
    cmadre
  );
  const ResultPadre = await ConsultaApoderadoNombres(cpadre, apDup, setApDup);

  // const ResultMadre = ConsultaApoderadoNombres(cmadre, apDup, setApDup);
  console.log("ResultPadre:", ResultPadre);
  console.log("ResultPadre apDup:", apDup);
*/

  return "";
};

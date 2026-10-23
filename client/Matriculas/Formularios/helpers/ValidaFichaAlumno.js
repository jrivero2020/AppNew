import DOMPurify from "dompurify";
import { validarRut } from "./../../../assets/js/FmtoRut";
import { cFichaAlumnoOrdenada } from "./../../../Matriculas/matriculasCampos";
// import { ConsultaApoderadoNombres } from "../ConsultaApoderadoNombres";

const validarNroFono = (numero) => {
  // Expresión regular para celular chileno
  // const regexCelular = /^(?:\+56|56|0)?9\d{8}$/;
// 222553655
  // Expresión regular para teléfono fijo chileno
  // const regexFijo =  /^(?:\+?56|0)?(?:2\d{8}|(?:3[2-5]|4[1-5]|5[1-8]|6[1-5]|7[1-5])\d{7})$/ ;
  // Limpiamos el número de espacios y guiones
  const nroFono = /^(?:\+?56)?(?:9\d{8}|2\d{8}|(?:3[2-5]|4[1-5]|5[1-8]|6[1-5]|7[1-5])\d{7})$/ ;
  // const numeroLimpio = numero.replace(/[-\s]/g, "");
  const numeroLimpio =numero.replace(/[^\d+]/g, "");
  return( nroFono.test(numeroLimpio))


  /* 

 * Valida un número telefónico de Chile (Fijo o Móvil)
 * @param {string} telefono - Cadena a validar (ej: "+56 9 1234-5678", "(032) 212.3456")
 * @returns {object} Objeto con el resultado de la validación y el número limpio
 
function validarTelefonoChileno(telefono) {
  if (typeof telefono !== 'string') {
    return { valido: false, numeroLimpio: '', mensaje: 'El parámetro debe ser un texto' };
  }

  // 1. Limpieza: Mantiene solo dígitos (\d) y el signo '+' al inicio si existe
  // Remueve puntos, guiones, espacios, paréntesis, etc.
  const numeroLimpio = telefono.trim().replace(/(?!^\+)[^\d]/g, '');

  // 2. Regex Unificada (Fijos RM, Fijos Regiones y Móviles)
  const regexChile = /^(?:\+?56)?(?:9\d{8}|2\d{8}|(?:3[2-5]|4[1-5]|5[1-8]|6[1-5]|7[1-5])\d{7})$/;

  // 3. Validación
  const esValido = regexChile.test(numeroLimpio);

  return {
    valido: esValido,
    numeroLimpio: esValido ? numeroLimpio : null,
    mensaje: esValido ? 'Número chileno válido' : 'Número chileno inválido'
  };
}

// ==========================================
// Ejemplos de uso:
// ==========================================

console.log(validarTelefonoChileno("+56 9 1234-5678"));
// { valido: true, numeroLimpio: "+56912345678", mensaje: "Número chileno válido" }

console.log(validarTelefonoChileno("(02) 2 123 4567")); 
// Nota: Elimina el '0' previo si está mal formateado y valida los 9 dígitos
console.log(validarTelefonoChileno("+56 (32) 212-3456"));
// { valido: true, numeroLimpio: "+56322123456", mensaje: "Número chileno válido" }

console.log(validarTelefonoChileno("9 8765 4321"));
// { valido: true, numeroLimpio: "987654321", mensaje: "Número chileno válido" }

console.log(validarTelefonoChileno("+56 9 1234 567")); // Le falta 1 dígito
// { valido: false, numeroLimpio: null, mensaje: "Número chileno inválido" }

  */

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

    // console.log(
    //   "dataBuscaAl[idParentesco]=",
    //   idParentesco,
    //   "valor:",
    //   dataBuscaAl[idParentesco],
    //   "apFields:",
    //   apFields,
    //   "roleName:",
    //   roleName
    // );

    if (dataBuscaAl[idParentesco] in parentescoMap) {
      const { role, message } = parentescoMap[dataBuscaAl[idParentesco]];
      // console.log("role:", role, "message;", message);
      // console.log("cmp rut =>",dataBuscaAl[`${apFields}_rut`],"!==",dataBuscaAl[`${role}_rut`]      );

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

  return "";
};

/* Pensar en implementar

import DOMPurify from "dompurify";
import { validarRut } from "./../../../assets/js/FmtoRut";
import { cFichaAlumnoOrdenada } from "./../../../Matriculas/matriculasCampos";

// ==========================================
// 1. FUNCIONES AUXILIARES Y VALIDACIONES BASE
// ==========================================

export const validarNroFono = (numero) => {
  if (!numero || typeof numero !== "string") return false;
  // Mantiene solo dígitos y el '+'
  const numeroLimpio = numero.replace(/[^\d+]/g, "");
  // Regex oficial teléfonos Chile (Móviles, Fijos Santiago y Fijos Regiones)
  const regexFonoChile = /^(?:\+?56)?(?:9\d{8}|2\d{8}|(?:3[2-5]|4[1-5]|5[1-8]|6[1-5]|7[1-5])\d{7})$/;
  return regexFonoChile.test(numeroLimpio);
};

export const validarEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  if (!regexEmail.test(email)) return false;

  const dominio = email.split("@")[1];
  const tld = dominio?.split(".").pop();
  return tld && tld.length >= 2 && tld.length <= 63;
};

const esFalsyDefinida = (value) => value === 0 || value === "" || value === null || value === undefined;

// ==========================================
// 2. CONFIGURACIÓN DECLARATIVA DE REGLAS
// ==========================================

const FICHAS = [
  "(I.- Del Alumno)",
  "(II.- Del Apoderado)",
  "(III.- Familiares)"
];

/**
 * Diccionario de reglas por campo.
 * Tipos admitidos: 'texto' (req + min 3), 'select' (req !== 0/vacio), 'fono', 'email', 'custom'
 
const REGLAS_CAMPOS = {
  // --- SECCIÓN I: ALUMNO ---
  al_nombres:   { tipo: "texto",  label: "El nombre alumno", ficha: 0 },
  al_apat:      { tipo: "texto",  label: "El apellido paterno alumno", ficha: 0 },
  al_amat:      { tipo: "texto",  label: "El apellido materno alumno", ficha: 0 },
  al_domicilio: { tipo: "texto",  label: "El domicilio alumno", ficha: 0 },
  al_idcurso:   { tipo: "select", msj: "Debe seleccionar un curso de la lista para el alumno", ficha: 0 },
  al_id_comuna: { tipo: "select", msj: "Debe seleccionar una comuna de la lista para el alumno", ficha: 0 },
  al_cur_repe:  { tipo: "select", msj: "Debe seleccionar cursos repetidos (Sí o No) del alumno", ficha: 0 },
  al_idvivecon: { tipo: "select", msj: "Debe seleccionar con quien vive el alumno", ficha: 0 },
  al_enfermo:   { tipo: "select", msj: "Debe seleccionar si tiene o no enfermedad el alumno", ficha: 0 },
  al_genero:    { tipo: "select", msj: "Debe seleccionar sexo de alumno", ficha: 0 },
  al_f_nac:     { tipo: "custom", fn: (val, curso) => validaFechaAlumno(val, curso) },

  // --- SECCIÓN II: APODERADO TITULAR ---
  ap_nombres:   { tipo: "texto",  label: "Nombre apoderado", ficha: 1 },
  ap_apat:      { tipo: "texto",  label: "Apellido paterno apoderado", ficha: 1 },
  ap_amat:      { tipo: "texto",  label: "Apellido materno apoderado", ficha: 1 },
  ap_domicilio: { tipo: "texto",  label: "El domicilio apoderado", ficha: 1 },
  ap_id_comuna: { tipo: "select", msj: "Debe seleccionar una comuna de la lista para el apoderado", ficha: 1 },
  al_idparentesco: { tipo: "select", msj: "Debe seleccionar Parentesco del apoderado", ficha: 1 },
  ap_fono1:      { tipo: "fono",   label: "Teléfono 1 de apoderado", requerido: true, ficha: 1 },
  ap_fono2:      { tipo: "fono",   label: "Nro de teléfono 2 de apoderado", requerido: false, ficha: 1 },
  ap_emergencia: { tipo: "fono",   label: "Nro de teléfono emergencia de apoderado", requerido: false, ficha: 1 },
  ap_email:      { tipo: "email",  label: "Correo apoderado", ficha: 1 },

  // --- SECCIÓN II: APODERADO SUPLENTE ---
  apsu_nombres:   { tipo: "texto",  label: "Nombre Apod.Suplente", ficha: 1 },
  apsu_apat:      { tipo: "texto",  label: "Apellido paterno Apod.Suplente", ficha: 1 },
  apsu_amat:      { tipo: "texto",  label: "Apellido materno Apod.Suplente", ficha: 1 },
  apsu_domicilio: { tipo: "texto",  label: "El domicilio Apod.Suplente", ficha: 1 },
  apsu_id_comuna: { tipo: "select", msj: "Debe seleccionar una comuna de la lista para el Apod.Suplente", ficha: 1 },
  al_idparentescosupl: { tipo: "select", msj: "Debe seleccionar Parentesco del Apod.Suplente", ficha: 1 },
  apsu_fono1:      { tipo: "fono",   label: "Teléfono 1 Apod.Suplente", requerido: true, ficha: 1 },
  apsu_fono2:      { tipo: "fono",   label: "Nro de teléfono 2 Apod.Suplente", requerido: false, ficha: 1 },
  apsu_emergencia: { tipo: "fono",   label: "Nro de teléfono emergencia Apod.Suplente", requerido: false, ficha: 1 },
  apsu_email:      { tipo: "email",  label: "Correo Apod.Suplente", ficha: 1 },

  // --- SECCIÓN III: PADRES Y FAMILIA ---
  madre_nombres: { tipo: "texto",  label: "Nombre madre", ficha: 2 },
  madre_apat:    { tipo: "texto",  label: "Apellido paterno madre", ficha: 2 },
  madre_amat:    { tipo: "texto",  label: "Apellido materno madre", ficha: 2 },
  padre_nombres: { tipo: "texto",  label: "Nombre padre", ficha: 2 },
  padre_apat:    { tipo: "texto",  label: "Apellido paterno padre", ficha: 2 },
  mpadre_amat:   { tipo: "texto",  label: "Apellido materno padre", ficha: 2 },
  al_ingresogrupofamiliar: { tipo: "select", msj: "Ingreso del grupo familiar es necesario.", ficha: 2 },
  al_vivienda:        { tipo: "select", msj: "Debe seleccionar tipo de vivienda", ficha: 2 },
  al_evaluareligion:  { tipo: "select", msj: "Debe seleccionar si evalúa religión", ficha: 2 },
};

// ==========================================
// 3. VALIDADOR DE UN SOLO CAMPO
// ==========================================

export const ValidaFichaAlumno = (name, value, curso) => {
  const camposExcluidosDeSanitizacion = [
    "al_idcurso", "al_id_comuna", "al_canthnos", "al_cur_repe"
  ];

  // Sanitización XSS
  if (!camposExcluidosDeSanitizacion.includes(name)) {
    const strValue = String(value ?? "");
    const sanitizedInput = DOMPurify.sanitize(strValue, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    if (strValue !== sanitizedInput) {
      return `Intento de contenido malicioso detectado!!, name = ${name} value = ${value}`;
    }
  }

  const regla = REGLAS_CAMPOS[name];
  if (!regla) return ""; // Si el campo no tiene regla definida, pasa sin error

  const sufijoFicha = FICHAS[regla.ficha] || "";
  const valStr = String(value ?? "").trim();

  // Evaluador genérico según el tipo de regla
  switch (regla.tipo) {
    case "texto":
      if (!valStr) return `${regla.label} es obligatorio.${sufijoFicha}`;
      if (valStr.length < 3) return `${regla.label} debe tener al menos 3 caracteres.${sufijoFicha}`;
      break;

    case "select":
      if (value === "" || value === 0 || value === null || value === undefined) {
        return `${regla.msj}${sufijoFicha}`;
      }
      break;

    case "fono":
      if (regla.requerido && !valStr) {
        return `${regla.label} es obligatorio.${sufijoFicha}`;
      }
      if (valStr && !validarNroFono(valStr)) {
        return `${regla.label} es inválido${sufijoFicha}`;
      }
      break;

    case "email":
      if (valStr && !validarEmail(valStr)) {
        return `${regla.label} no es válido${sufijoFicha}`;
      }
      break;

    case "custom":
      if (typeof regla.fn === "function") {
        return regla.fn(value, curso) || "";
      }
      break;
  }

  return "";
};

// ==========================================
// 4. VALIDADOR DE FECHAS
// ==========================================

export const validaFechaAlumno = (fecha, curso, anioMatricula = 2025) => {
  try {
    if (!fecha) return "La fecha de nacimiento es requerida";

    const convertirFecha = (strFecha) => {
      if (/^\d{2}-\d{2}-\d{4}$/.test(strFecha)) {
        const [dia, mes, anio] = strFecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(strFecha)) {
        const [anio, mes, dia] = strFecha.split("-").map(Number);
        return new Date(anio, mes - 1, dia);
      }
      throw new Error("Formato de fecha no válido");
    };

    convertirFecha(fecha);
    return "";
  } catch (e) {
    return e.message;
  }
};

// ==========================================
// 5. VALIDADOR GENERAL DEL FORMULARIO
// ==========================================

export const validateFormAlumno = (dataBuscaAl) => {
  const camposExcluidos = [
    "al_activo", "al_agno_matricula", "al_cod_ense", "al_cod_grado",
    "al_fecharetiro", "al_fincorpora", "al_id_alumno", "al_letra",
    "al_motivoretiro", "al_nro_matricula", "ap_parentesco", "ap_sexo",
    "apsu_parentesco", "al_idmadre", "al_idpadre", "al_idapoderado", "al_idapoderadosupl"
  ];

  const parentescoMap = {
    1: { role: "padre", message: "El Padre" },
    2: { role: "madre", message: "La Madre" }
  };

  const validarFormatoRut = (campoRut, campoDv, nombreCampo) => {
    const rut = `${dataBuscaAl[campoRut]}-${dataBuscaAl[campoDv]}`;
    if (!validarRut(rut)) {
      return `El RUT de ${nombreCampo} no es válido. Rut : ${rut}`;
    }
    return null;
  };

  const validateParentesco = (idParentesco, apFields, roleName) => {
    const parentescoVal = dataBuscaAl[idParentesco];
    if (parentescoVal in parentescoMap) {
      const { role, message } = parentescoMap[parentescoVal];

      if (dataBuscaAl[`${apFields}_rut`] !== dataBuscaAl[`${role}_rut`]) {
        return `${message} debe tener el mismo rut que el ${roleName} cuando parentesco="${message.substring(3)}"!`;
      }

      if (
        dataBuscaAl[`${apFields}_nombres`] !== dataBuscaAl[`${role}_nombres`] ||
        dataBuscaAl[`${apFields}_apat`] !== dataBuscaAl[`${role}_apat`] ||
        dataBuscaAl[`${apFields}_amat`] !== dataBuscaAl[`${role}_amat`]
      ) {
        return `${message} se debe llamar igual que ${roleName} cuando parentesco="${message.substring(3)}"!`;
      }
    }
    return null;
  };

  const sonNombresIguales = (person1, person2) =>
    dataBuscaAl[`${person1}_nombres`] === dataBuscaAl[`${person2}_nombres`] &&
    dataBuscaAl[`${person1}_apat`] === dataBuscaAl[`${person2}_apat`] &&
    dataBuscaAl[`${person1}_amat`] === dataBuscaAl[`${person2}_amat`];

  // 1. Validar RUTs obligatorios de apoderados
  const errorRutAp = validarFormatoRut("ap_rut", "ap_dv", "Apoderado");
  if (errorRutAp) return errorRutAp;

  const errorRutApsu = validarFormatoRut("apsu_rut", "apsu_dv", "Apoderado suplente");
  if (errorRutApsu) return errorRutApsu;

  // 2. Reglas de coexistencia de Padres
  if (esFalsyDefinida(dataBuscaAl["padre_rut"]) && esFalsyDefinida(dataBuscaAl["madre_rut"])) {
    return "Debe ingresar Rut de la Madre o el Padre, No se permite ambos padres sin Rut!";
  }

  if (dataBuscaAl["ap_rut"] === dataBuscaAl["apsu_rut"]) {
    return 'El apoderado "Suplente" no puede tener el mismo Rut del Apoderado "Titular"!';
  }

  if (!esFalsyDefinida(dataBuscaAl["padre_rut"])) {
    const error = validarFormatoRut("padre_rut", "padre_dv", "Padre");
    if (error) return error;
  }

  if (!esFalsyDefinida(dataBuscaAl["madre_rut"])) {
    const error = validarFormatoRut("madre_rut", "madre_dv", "Madre");
    if (error) return error;
  }

  if (!esFalsyDefinida(dataBuscaAl["padre_rut"]) && !esFalsyDefinida(dataBuscaAl["madre_rut"])) {
    if (dataBuscaAl["madre_rut"] === dataBuscaAl["padre_rut"]) {
      return 'La "Madre" no puede tener el mismo Rut que el "Padre"!';
    }
  }

  if (
    !esFalsyDefinida(dataBuscaAl["al_idparentesco"]) &&
    !esFalsyDefinida(dataBuscaAl["al_idparentescosupl"]) &&
    dataBuscaAl["ap_rut"] !== dataBuscaAl["apsu_rut"]
  ) {
    if (dataBuscaAl["al_idparentescosupl"] === dataBuscaAl["al_idparentesco"]) {
      return "El Apoderado y el suplente, no pueden tener el mismo parentesco!";
    }
  }

  // 3. Validar todo el formulario según el orden del array de campos
  const clavesFiltradas = cFichaAlumnoOrdenada.filter((key) => !camposExcluidos.includes(key));

  for (const key of clavesFiltradas) {
    if (Object.prototype.hasOwnProperty.call(dataBuscaAl, key)) {
      const valor = dataBuscaAl[key];
      const error = ValidaFichaAlumno(key, valor, dataBuscaAl.al_idcurso);
      if (error) return error; // Se detiene al encontrar el primer error
    }
  }

  // 4. Validaciones cruzadas de nombres y coincidencia de RUTs con parentesco
  if (sonNombresIguales("ap", "apsu")) {
    return "El Apoderado y el suplente, no se pueden llamar iguales!";
  }

  if (sonNombresIguales("madre", "padre")) {
    return "Los padres no se pueden llamar iguales!";
  }

  const apoderadoError = validateParentesco("al_idparentesco", "ap", "Apoderado");
  if (apoderadoError) return apoderadoError;

  const suplenteError = validateParentesco("al_idparentescosupl", "apsu", "Apoderado Suplente");
  if (suplenteError) return suplenteError;

  return "";
};

*/

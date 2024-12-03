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
  let error = "";

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
      if (!error)
         error = ""
      // if (error) {
      //   console.log(error); // Mensaje de error en caso de no pasar la validación
      // } else {
      //   console.log("Fecha válida");
      // }
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
        error = "Teléfono 1 es obligatorio.";
      } else if (!validarNroFono(value)) {
        error = "Nro de teléfono 1 es inválido";
      }
      break;
    case "ap_fono2":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono 2 es inválido";
      }
      break;
    case "ap_emergencia":
      if (value.trim() && !validarNroFono(value)) {
        error = "Nro de teléfono emergencia es inválido";
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
    /*
    apsu_amat

    apsu_domicilio
    apsu_email
    apsu_emergencia
    apsu_fono1
    apsu_fono2
    apsu_id_comuna
    
    apsu_parentesco
    
    apsu_sexo
*/

    case "apsu_rut":
      if (!/^\d{7,8}-[\dkK]$/.test(value)) {
        error = "El RUT Apoderado Supl, debe tener un formato válido.";
      }
      break;

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
        error = "Apellido materno Apod.Suplente debe tener al menos 3 caracteres.";
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


    default:
      break;
  }

  // console.log("validando :", name, " Valor: ", value, " error: ", error);
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
console.log( "Validando fecha error = ", error)
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
    "ap_dv",
    "ap_parentesco",
    "ap_sexo",
    "apsu_dv",
    "apsu_parentesco"
  ];

  console.log("Entre a rutina validateFormAlumno ")
  // const newErrors = {};
  /*
  Object.keys(dataBuscaAl)
    .filter((key) => key.startsWith("al_") && !camposExcluidos.includes(key))
    .forEach((key) => {
      console.log("Recorriendo databuscal key", key," dataBuscaAl[", key, "]  =>",
        dataBuscaAl[key]
      );

      const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
      if (error) {
        newErrors[key] = error;
        console.log("newErrors[key] ====>:", newErrors[key] , "Key = ", key)
      }        
    });
*/
for (const key of Object.keys(dataBuscaAl).filter((key) => key.startsWith("al_") && !camposExcluidos.includes(key))) {
  // console.log("Recorriendo databuscal key", key, " dataBuscaAl[", key, "]  =>", dataBuscaAl[key]);

  const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
  if (error) {
    // console.log("Error encontrado en key:", key, "=>", error);
    return error; // Retorna el error y detiene el bucle
  }
}
for (const key of Object.keys(dataBuscaAl).filter((key) => key.startsWith("ap_") && !camposExcluidos.includes(key))) {
 //  console.log("Recorriendo databuscal key", key, " dataBuscaAl[", key, "]  =>", dataBuscaAl[key]);

  const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
  if (error) {
    // console.log("Error encontrado en key:", key, "=>", error);
    return error; // Retorna el error y detiene el bucle
  }
}

for (const key of Object.keys(dataBuscaAl).filter((key) => key.startsWith("apsu_") && !camposExcluidos.includes(key))) {
  //  console.log("Recorriendo databuscal key", key, " dataBuscaAl[", key, "]  =>", dataBuscaAl[key]);
 
   const error = ValidaFichaAlumno(key, dataBuscaAl[key]);
   if (error) {
     // console.log("Error encontrado en key:", key, "=>", error);
     return error; // Retorna el error y detiene el bucle
   }
 }
 
 


  return "";
};

/*
ap_amat
ap_apat
ap_domicilio
ap_email
ap_emergencia
ap_fono1
ap_fono2
ap_id_comuna
ap_nombres
ap_parentesco
ap_rut
ap_sexo

apsu_amat
apsu_apat
apsu_domicilio
apsu_email
apsu_emergencia
apsu_fono1
apsu_fono2
apsu_id_comuna
apsu_nombres
apsu_parentesco
apsu_rut
apsu_sexo

*/

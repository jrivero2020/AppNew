export const ValidaFichaAlumno = (name, value, curso) => {
  let error = "";

  switch (name) {
    case "al_nombres":
      if (!value.trim()) {
        error = "El nombre es obligatorio.";
      } else if (value.length < 3) {
        error = "El nombre debe tener al menos 3 caracteres.";
      }
      break;

    case "al_apat":
      if (!value.trim()) {
        error = "El apellido paterno es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido debe tener al menos 3 caracteres.";
      }
      break;
    case "al_amat":
      if (!value.trim()) {
        error = "El apellido materno es obligatorio.";
      } else if (value.length < 3) {
        error = "El apellido debe tener al menos 3 caracteres.";
      }
      break;

    case "al_rut":
      if (!/^\d{7,8}-[\dkK]$/.test(value)) {
        error = "El RUT debe tener un formato válido.";
      }
      break;
    case "al_idcurso":
      if (value === "" || value === 0) {
        error = "Debe seleccionar un curso de la lista";
      }
      break;
    case "al_f_nac":
      error = validaFechaAlumno(value, curso);
      if (error) {
        console.log(error); // Mensaje de error en caso de no pasar la validación
      } else {
        console.log("Fecha válida");
      }
      break;

    default:
      break;
  }
  console.log("validando :", name, " Valor: ", value);
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
    if (curso === 1 && edad > 4) {
      error = `La fecha no es válida: la edad no puede ser mayor a 4 años al 31 de marzo de ${anioMatricula}.`;
    } else if (curso === 2 && edad > 5) {
      error = `La fecha no es válida: la edad no puede ser mayor a 5 años al 31 de marzo de ${anioMatricula}.`;
    } else if (curso > 9 && edad > 18) {
      error = `La fecha no es válida: la edad no puede ser mayor a 18 años al 31 de marzo de ${anioMatricula}.`;
    }
  } catch (e) {
    error = e.message;
  }

  return error; // Si no hay error, retorna una cadena vacía
};

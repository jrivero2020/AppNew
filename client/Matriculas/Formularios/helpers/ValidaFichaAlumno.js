export const ValidaFichaAlumno = (name, value) => {
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
      error = validaFechaAlumno(value);
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

export const validaFechaAlumno = (value) => {
  let error = "";

  // Validar formato dd-mm-aaaa
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(value)) {
    return "El formato debe ser dd-mm-aaaa.";
  }

  // Separar componentes de la fecha
  const [day, month, year] = value.split("-").map(Number);

  // Crear objeto Date
  const fechaIngresada = new Date(year, month - 1, day);
  if (
    fechaIngresada.getDate() !== day ||
    fechaIngresada.getMonth() !== month - 1 ||
    fechaIngresada.getFullYear() !== year
  ) {
    return "La fecha no es válida.";
  }

  // Obtener fechas límite
  const fechaHoy = new Date();

  // Calcular hace 4 años considerando marzo
  const marzoReferencia =
    fechaHoy.getMonth() >= 10 // Noviembre (10) o Diciembre (11)
      ? new Date(fechaHoy.getFullYear() + 1, 2, 1) // Marzo del año siguiente
      : new Date(fechaHoy.getFullYear(), 2, 1); // Marzo del año actual
  const hace4Anios = new Date(marzoReferencia);
  hace4Anios.setFullYear(hace4Anios.getFullYear() - 4);

  // Calcular diciembre para 18 años
  const diciembreAnio =
    fechaHoy.getMonth() >= 10 // Noviembre (10) o Diciembre (11)
      ? new Date(fechaHoy.getFullYear() + 1, 11, 31) // Diciembre del próximo año
      : new Date(fechaHoy.getFullYear(), 11, 31); // Diciembre del año actual
  const hace18Anios = new Date(diciembreAnio);
  hace18Anios.setFullYear(hace18Anios.getFullYear() - 18);

  // Validar rango
  if (fechaIngresada < hace4Anios) {
    error = "La fecha no puede ser menor a 4 años respecto a marzo.";
  } else if (fechaIngresada > hace18Anios) {
    error = "La fecha no puede ser mayor a 18 años respecto a diciembre.";
  }

  return error;
};

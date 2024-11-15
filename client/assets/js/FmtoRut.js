/* ****************************************************** */
/*                                                        */
/*  Formatea value con separadores de miles y agrega      */
/*  guión (-) al penultimo caracter para formatear un     */
/*  Rut chileno, acepta números, una y sólo una K al      */
/*  final del string. si ingresó una k ya no puede seguir */
/*  ingresando más dígitos.                               */
/*  Retorna el número formateado o null si no cumple la   */
/*  condición                                             */
/* ****************************************************** */

const FmtoRut = (value) => {
  // let tvalue = value.replace(/[.-]/g, '');
  let tvalue = QuitaPuntos(value);
  let patt = new RegExp(/^\d{1,10}[kK]?$/);
  let retValue = "";

  if (tvalue === "") return tvalue;

  if (patt.test(tvalue)) {
    if (tvalue.length > 1) {
      let valueMenos = tvalue.slice(0, -1);
      valueMenos = Intl.NumberFormat("es-CL").format(valueMenos);
      tvalue = valueMenos + "-" + tvalue.slice(-1);
    }
    retValue = tvalue;
  } else retValue = null;

  return retValue;
};

const QuitaPuntos = (rut) => {

  if( typeof rut === 'number'){
    rut = rut.toString();
  }
  return rut.replace(/[.-]/g, "");
};

const validarRut = (rut) => {
  rut = rut.replace(/[.-]/g, ""); // Elimina los puntos y guión
  rut = rut.replace(/[^\dkK]/g, ""); // Eliminar caracteres no numéricos excepto K/k
  if (!/^\d{4,10}(?:[kK])?$/.test(rut)) {
    return false;
  }

  rut = rut.padStart(10, "0"); // Rellenar con ceros a la izquierda si el rut no tiene 10 dígitos

  var cuerpo = rut.slice(0, -1); // Obtener cuerpo del RUT (sin dígito verificador)
  var dv = rut.slice(-1).toUpperCase(); // Obtener dígito verificador, convertido a mayúscula

  var suma = 0;
  var multiplo = 2;

  // Calcular suma ponderada del cuerpo del RUT de derecha a izquierda
  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  var resultado = 11 - (suma % 11); // Calcular dígito verificador esperado (módulo 11)
  resultado =
    resultado === 11 ? "0" : resultado === 10 ? "K" : String(resultado); // Convertir valor 10 a 'K'
  return dv === resultado; // Validar si el dígito verificador ingresado es igual al obtenido
};

const manejoCambiofRut = (name, resultado, setResultado) => (event) => {
  let tvalue = FmtoRut(event.target.value);
  if (resultado.fRut.length === 1 && tvalue === null) tvalue = "";

  if (tvalue != null) {
    setResultado({ ...resultado, [name]: tvalue });
  }
};

export { FmtoRut, validarRut, QuitaPuntos, manejoCambiofRut };

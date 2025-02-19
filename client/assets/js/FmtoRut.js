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
  // console.log("en FmtoRut el valor ==>", value);
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
  if (typeof rut === "number") {
    rut = rut.toString();
  }
  return rut.replace(/[.-]/g, "");
};

const validarRut = (rut) => {
  // console.log(" en validarRut el rut es : ", rut);
  const rutnulos = [
    11111111, 22222222, 33333333, 44444444, 55555555, 66666666, 77777777,
    88888888, 99999999,
  ];
  rut = rut.replace(/[.-]/g, ""); // Elimina los puntos y guión
  rut = rut.replace(/[^\dkK]/g, ""); // Eliminar caracteres no numéricos excepto K/k
  if (!/^\d{4,10}(?:[kK])?$/.test(rut)) {
    // console.log(" No paso el test: ", rut);
    return false;
  }

  rut = rut.padStart(10, "0"); // Rellenar con ceros a la izquierda si el rut no tiene 10 dígitos

  var cuerpo = rut.slice(0, -1); // Obtener cuerpo del RUT (sin dígito verificador)
  var dv = rut.slice(-1).toUpperCase(); // Obtener dígito verificador, convertido a mayúscula

  var suma = 0;
  var multiplo = 2;

  if (rutnulos.includes(Number(cuerpo))) return false;

  // Calcular suma ponderada del cuerpo del RUT de derecha a izquierda
  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  var Rutresultado = 11 - (suma % 11); // Calcular dígito verificador esperado (módulo 11)
  Rutresultado =
    Rutresultado === 11
      ? "0"
      : Rutresultado === 10
      ? "K"
      : String(Rutresultado); // Convertir valor 10 a 'K'
  return dv === Rutresultado; // Validar si el dígito verificador ingresado es igual al obtenido
};

export const RutANumeros = (rut) => {
  rut = rut.replace(/[.-]/g, ""); // Elimina los puntos y guión
  rut = rut.replace(/[^\dkK]/g, ""); // Eliminar caracteres no numéricos excepto K/k
  rut = rut.padStart(10, "0"); // Rellenar con ceros a la izquierda si el rut no tiene 10 dígitos
  return rut.slice(0, -1);
};

const manejoCambiofRut =
  (name, resultado, setResultado, dataBuscaAl, setDataBuscaAl) => (event) => {
    let tvalue = FmtoRut(event.target.value);
    // console.log(` en manejoCambiofRut Resultado[${name}] tvalue = ${tvalue}`);

    if (resultado[name].length === 1 && tvalue === null) tvalue = "";

    if (tvalue != null) {
      var rut = parseInt(RutANumeros(tvalue), 10);
      var dv = tvalue.slice(-1).toUpperCase();

      setResultado({ ...resultado, [name]: tvalue });

      const fieldMapping = {
        ApRut: { keyRut: "ap_rut", keyDv: "ap_dv" },
        ApsuRut: { keyRut: "apsu_rut", keyDv: "apsu_dv" },
        PadRut: { keyRut: "padre_rut", keyDv: "padre_dv" },
        MadRut: { keyRut: "madre_rut", keyDv: "madre_dv" },
      };

      if (fieldMapping[name]) {
        const { keyRut, keyDv } = fieldMapping[name];
        //         setDataBuscaAl({ ...dataBuscaAl, [keyRut]: rut, [keyDv]: dv });
        setDataBuscaAl((prev) => ({ ...prev, [keyRut]: rut, [keyDv]: dv }));
      }
    }
  };

export const FValidarOtrosRut = (name, dataBuscaAl) => {
  //  console.log("recibido en FValidarOtrosRut =", resultado[name]);
  let tvalue = FmtoRut(dataBuscaAl[name]);
  //console.log("el formato rut es : ", tvalue);
  if (dataBuscaAl[name].length === 1 && tvalue === null) tvalue = "";
  if (tvalue != null) {
    const retornovalida = validarRut(dataBuscaAl[name]);
    //console.log("Voy a retornar con retornovalida=", retornovalida);
    return retornovalida;
  } else {
    return false;
  }
};

export { FmtoRut, validarRut, QuitaPuntos, manejoCambiofRut };

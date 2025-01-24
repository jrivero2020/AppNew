// *****************************************************
// Define si se muestra o no la etiqueta en el browser
//
const chkActivoRolAutentica = (data, isAuthenticated, jwtRol) => {
  let ret = false;
  const objeto = data.datos;

  if (objeto === undefined) {
    return;
  }

  if (objeto.activo === 1 || objeto.activo === "1") {
    if (objeto.autorizado === 1) ret = true;
    if (objeto.autorizado === "!A" && !isAuthenticated) ret = true;
    if (objeto.autorizado === "A" && isAuthenticated) ret = true;
    if (objeto.autorizado === "A1" && isAuthenticated && jwtRol === 1)
      ret = true;
    if (
      objeto.autorizado === "A12" &&
      isAuthenticated &&
      (jwtRol === 1 || jwtRol === 2)
    )
      ret = true;
  }

  return ret;
};
export { chkActivoRolAutentica };

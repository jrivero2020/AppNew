// *****************************************************
// Define si se muestra o no la etiqueta en el browser
//
const chkActivoRolAutentica = (data, isAuthenticated, jwtRol) => {
  let ret = false
  
  if (data.activo) {
    if( data.autorizado === 1)
      ret = true
    if (data.autorizado === "!A" && !isAuthenticated)
      ret = true
    if (data.autorizado === "A" && isAuthenticated)
      ret = true
    if (data.autorizado === "A1" && isAuthenticated && (jwtRol === 1))
      ret = true
    if (data.autorizado === "A12" && isAuthenticated && (jwtRol === 1 || jwtRol === 2))
      ret = true
  }
  
  return ret
}
export {chkActivoRolAutentica}
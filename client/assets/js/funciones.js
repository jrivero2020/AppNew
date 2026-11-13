// *****************************************************
// Define si se muestra o no la etiqueta en el browser
//
const chkActivoRolAutentica = (data, isAuthenticated, jwtRol) => {  // let ret = false;
  
  const objeto = data.datos;

  if (!objeto || objeto.activo !== 1) return false;
  if (jwtRol === 1) return true; // Admin siempre tiene acceso.

  const { autorizado } = objeto;
  if (objeto.autorizado === 1) return true;
  
  if (autorizado === "!A" && !isAuthenticated) return true; // Todos pueden acceder.  
  if (autorizado === "A" && isAuthenticated) return true; // Cualquier autenticado puede acceder.

  if (autorizado.startsWith("A")) {
    if (!isAuthenticated) return false; // Si requiere autenticación y no está autenticado, denegar acceso.

    const rolesPermitidos = new Set(
      autorizado.slice(1).split("").map(Number) // Extrae los números después de "A"
    );

    return rolesPermitidos.has(jwtRol);
  }

  if ( !isAuthenticated && autorizado.startsWith("!A")) {
    
    const rolesPermitidos = new Set(
      autorizado.slice(2).split("").map(Number) // Extrae los números después de "!A"
    );

    return rolesPermitidos.has(jwtRol) //  || isAuthenticated; 
    // Si tiene rol permitido o está autenticado (acceso a todo lo de "!A").
  }

  return false;





};
export { chkActivoRolAutentica };

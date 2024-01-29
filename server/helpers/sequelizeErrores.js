export const verErrorSequelize = (e) => {
  let msg = e.name;

  // console.log("******Console.log(e)===>:", e )
  // console.log( "El campo ", e.errors[0].path, e.errors[0].message, '========>Errors')

  switch (msg) {
    case "SequelizeUniqueConstraintError" || "SequelizeValidationError":
      if (msg.substring(0, 13) == "NombreUsuario") {
        msg = "Nombre de usuario ya existe, pruebe con otro";
      }
      if (msg === "SequelizeUniqueConstraintError") {
        msg = "Ya hay usuario registrado con ese nombre";
      }

      // console.log("sequelize==>:", msg)
      break;
    case "SequelizeDatabaseError":
      msg = e.parent.sqlMessage;
      break;
    default:
      msg = e.errors[0].message;
  }

  return msg;
};

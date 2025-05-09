import { usuarios } from "../modelos/usuario.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { jwtConfig } from "../../config/config.js";
import { sequelize } from "../bdatos/bdatos.js"

import bcrypt from "bcrypt";

const validaPass = async function (passwordIngresada, passwordGuardada) {
  //console.log("validaPass, passwordIngresada:",passwordIngresada,"   passwordGuardada:",passwordGuardada )
  return await bcrypt.compare(passwordIngresada, passwordGuardada);
};

const signin = async (req, res) => {
  const { nombre_usuario, password } = req.body;
  try {
//    const usrFind = await usuarios.findOne({ where: { nombre_usuario } });
  const usrFind = await sequelize.query(
      `CALL sp_getfuncionario(?)`,
      {
        replacements: [ nombre_usuario ],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // console.log( "***usrFind:",usrFind[0]['0'])
    const usrFindOk = usrFind[0]['0']
//console.log("usrFind==>:",usrFindOk, "  password:",password, "  PasswordGuardada:",usrFindOk.password)
    if (usrFind === null)
      return res.status(404).json({ message: "Usuario no existe" });

    //    let valida = await usrFind.validaPassword(password);
    const valida = await validaPass(password, usrFindOk.password);

    if (!valida)
      return res.status(401).json({ message: "Usuario y clave no coinciden" });

    // Jwt
    const user = {
      _id: usrFindOk.rut,
      _rol: usrFindOk.rol,
      _name: usrFindOk.nombres + " " + usrFindOk.apat + " " + usrFindOk.amat,
    };

    const token = jwt.sign({ user }, jwtConfig.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 20 });
    // console.log( 'Token: ', token)
    req.profile = usrFindOk.dataValues;
    // console.log("En logeo signin usrFind.dataValues==>", usrFindOk.dataValues)
    //console.log("res.json token:", token, "  user:", user)
    return res.json({ token, user });
  } catch (error) {
     //console.log("El Error==>: ", error)
    return res
      .status(400)
      .json({ message: "*** Usuario No Existe!!***" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({ message: "Sesión terminada" });
};

const requireSignin = expressjwt({
  secret: jwtConfig.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

const estaAutorizado = async (req, res, next) => {
  // console.log("estaAutorizado*********************req", req.auth.user._id);
  var usrRol = null;
  try {
    let findUsrRol = await usuarios.findByPk(req.auth.user._id);
    if (findUsrRol) {
      usrRol = findUsrRol.rol;
    } else {
      res.status(404).json({ message: "Usuario que consulta ya no es válido" });
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: "No pude conectar con BD. Usuario " + error });
  }
  // console.log("estaAutorizado req.profile ", req.profile )
  // , " req.auth.user :", req.auth.user, " req.profile.idUsuario =>", req.profile.idUsuario, "usrRol : ", usrRol)

  const autorizado =
    req.profile && req.auth.user && req.profile.idUsuario === req.auth.user._id;
  if (!autorizado) {
    return res.status(403).json({ message: "Usuario no está autorizado" });
  }
  next();
};

export default { signin, signout, requireSignin, estaAutorizado };

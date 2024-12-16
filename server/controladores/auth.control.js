import { usuarios } from "../modelos/usuario.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { jwtConfig } from "../../config/config.js";

const signin = async (req, res) => {
  const { nombre_usuario, password } = req.body;
  try {
    const usrFind = await usuarios.findOne({ where: { nombre_usuario } });
    if (usrFind === null)
      return res.status(404).json({ message: "Usuario no existe" });

    let valida = await usrFind.validaPassword(password);
    if (!valida)
      return res.status(401).json({ message: "Usuario y clave no coinciden" });

    // Jwt
    const user = {
      _id: usrFind.idUsuario,
      _rol: usrFind.rol,
    };

    const token = jwt.sign({ user }, jwtConfig.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 20 });
    // console.log( 'Token: ', token)
    req.profile = usrFind.dataValues;
    // console.log("Enlogeo signin usrFind.dataValues==>", usrFind.dataValues)
    return res.json({ token, user });
  } catch (error) {
    // console.log("El Error: ", error)
    return res
      .status(400)
      .json({ message: "*** signin No pude encontrar el registro***" });
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

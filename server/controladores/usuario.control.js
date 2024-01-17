import { Usuarios } from "../modelos/modeloCole.js";
import { verErrorSequelize } from "../helpers/sequelizeErrores.js";

const listaUsuarios = async (req, res) => {
  try {
    const usuario = await Usuarios.findAll();
    res.json(usuario);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const usuario = await Usuarios.findByPk(id);
    if (usuario === null) {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    } else {
      usuario.dataValues.password = undefined;
      req.profile = usuario.dataValues;
      next();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const leerUsuario = (req, res) => {
  return res.json(req.profile);
};

const crearUsuario = async (req, res) => {
  try {
    const newUsuario = await Usuarios.create(req.body);
    return res.status(200).json({ message: "Registro exitoso" });
  } catch (e) {
    return res.status(500).json({ message: verErrorSequelize(e) });
  }
};

const inscripcionUsuario = async (req, res) => {
  try {
    const newUsuario = await Usuarios.create(req.body);
    return res.status(200).json({ message: "Inscripción exitosa" });
  } catch (e) {
    const errmsg = verErrorSequelize(e);
    console.log("Dentro de inscripción de usuario: ", errmsg);
    return res.status(500).json({ message: errmsg });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.profile.idUsuario);
    usuario.set(req.body);
    usuario.updatedAt = Date.now();
    await usuario.save();
    usuario.password = undefined;
    res.json(usuario);
  } catch (e) {
    return res.status(500).json({ message: verErrorSequelize(e) });
  }
};
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  let user = req.profile; // lo voy a ver
  try {
    let usr = await Usuarios.destroy({
      where: { idUsuario: req.profile.idUsuario },
    });
    if (usr > 0) {
      usr.password = undefined;
      res.json({ message: "Registro borrado" });
    } else res.status(404).json({ message: "No se encontró registro" });
  } catch (e) {
    res.sendStatus(400).json({ message: verErrorSequelize(e) });
  }
};

export default {
  userByID,
  leerUsuario,
  crearUsuario,
  updateUsuario,
  listaUsuarios,
  deleteUsuario,
  inscripcionUsuario,
};

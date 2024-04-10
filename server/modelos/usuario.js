import { DataTypes } from "sequelize";
import { sequelize } from "../bdatos/bdatos.js";
import bcrypt, { hash } from "bcrypt";

export const usuarios = sequelize.define(
  "usuarios",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      unique: { args: true, msg: "Nombre usuario ya existe, utilice otro" },
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Debe Ingresar a un Usuario válido" },
        len: {
          args: [4, 25],
          msg: "El largo debe estar entre 4 y 25 caracteres",
        },
      },
    },
    correo: {
      type: DataTypes.STRING(50),
      unique: { args: true, msg: "Correo ya existe, ingrese otro" },
      validate: {
        isEmail: { args: true, msg: "Debe ingresar un correo válido" },
      },
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false,
      set(value) {
        if (value) {
          let salt = bcrypt.genSaltSync(12);
          let hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        }
      },
    },
    apat: {
      type: DataTypes.STRING(85),
    },
    amat: {
      type: DataTypes.STRING(85),
    },
    nombres: {
      type: DataTypes.STRING(120),
    },
    rut: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: { args: true, msg: "Debe ingresar solamente números" },
        len: {
          args: [7, 9],
          msg: "El largo del rut debe estar entre 7 y 9 dígitos",
        },
        isInt: true,
      },
    },
    dv: {
      type: DataTypes.STRING(1),
    },
    rol: {
      type: DataTypes.INTEGER(2),
    },
  },
  { timestamps: true }
);

usuarios.prototype.validaPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

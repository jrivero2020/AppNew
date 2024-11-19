import { DataTypes } from "sequelize";
import { sequelize } from "../bdatos/bdatos.js";
import bcrypt, { hash } from "bcrypt";

export const usuarios = sequelize.define(
  "usuarios",
  {
    id_usuario: {
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
      validate: {
        isNumeric: { args: true, msg: "Debe ingresar solamente números" },
        len: { args: [1], msg: "El largo del rol máximo 2 dígitos" },
        isInt: true,
      },
    },
  },
  { timestamps: true }
);

usuarios.prototype.validaPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

export const docentes = sequelize.define(
  "docentes",
  {
    id_profesor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),

    apat: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Ingrese ap. Paterno válido" },
        len: {
          args: [4, 80],
          msg: "El largo debe estar entre 4 y 80 caracteres",
        },
      },
    },
    amat: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Ingrese ap. Materno válido" },
        len: {
          args: [4, 80],
          msg: "El largo debe estar entre 4 y 80 caracteres",
        },
      },
    },
    nombres: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Ingrese un Nombre válido" },
        len: {
          args: [4, 80],
          msg: "El largo debe estar entre 4 y 80 caracteres",
        },
      },
    },
    fono: DataTypes.STRING(50),
    correo: {
      type: DataTypes.STRING(50),
      unique: { args: true, msg: "Correo ya existe, ingrese otro" },
      validate: {
        isEmail: { args: true, msg: "Debe ingresar un correo válido" },
      },
    },
    funcion: DataTypes.INTEGER,
    dia_at: DataTypes.INTEGER,
    hini_at: DataTypes.STRING(5),
    hter_at: DataTypes.STRING(5),
    activo: DataTypes.BOOLEAN,
    pb: DataTypes.BOOLEAN,
    ba: DataTypes.BOOLEAN,
    me: DataTypes.BOOLEAN,
  },
  { freezeTableName: true, timestamps: false }
);

export const comunas = sequelize.define(
  "comunas",
  {
    id_comuna: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },

    descripcion: DataTypes.STRING(120),
  },
  { freezeTableName: true }
);

export const parentescos = sequelize.define(
  "parentescos",
  {
    idparentesco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descripcion: DataTypes.STRING(45),
  },
  { freezeTableName: true }
);

export const vivecon = sequelize.define(
  "vivecon",
  {
    idvivecon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    descripcion: DataTypes.STRING(45),
  },
  { freezeTableName: true }
);

export const salas = sequelize.define(
  "salas",
  {
    id_sala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    nro_sala: DataTypes.INTEGER,
    ubicacion: DataTypes.STRING(200),
    descripcion: DataTypes.STRING(200),
  },
  { freezeTableName: true }
);

export const cursos = sequelize.define(
  "cursos",
  {
    id_curso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    nomcorto: DataTypes.STRING(20),
    nomlargo: DataTypes.STRING(80),
    id_sala: {
      type: DataTypes.INTEGER,
      references: {
        model: salas,
        key: "id_sala",
      },
    },
    jornada: DataTypes.STRING(10),
    agno: DataTypes.INTEGER,
    id_ciclo: DataTypes.INTEGER,
    cod_ense: DataTypes.INTEGER,
    cod_grado: DataTypes.INTEGER,
    letra: DataTypes.STRING(1),
    nivel: DataTypes.INTEGER,
    id_profesor: {
      type: DataTypes.INTEGER,
      references: {
        model: docentes,
        key: "id_profesor",
      },
    },
    desc_Grado: DataTypes.STRING(40),
    activo: DataTypes.BOOLEAN,
  },
  { freezeTableName: true }
);


export const apoderados = sequelize.define(
  "apoderados",
  {
    id_ap: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),
    nombres: DataTypes.STRING(200),
    apat: DataTypes.STRING(80),
    amat: DataTypes.STRING(80),
    sexo: DataTypes.STRING(1),
    fono1: DataTypes.STRING(120),
    fono2: DataTypes.STRING(300),
    emergencia: DataTypes.STRING(80),
    email: DataTypes.STRING(45),
    domicilio: DataTypes.STRING(200),
    id_comuna: {
      type: DataTypes.INTEGER,
      references: {
        model: comunas,
        key: "id_comuna",
      },
    },
    estudios: DataTypes.STRING(100),
    ocupacion: DataTypes.STRING(100),
    id_alumno: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);

export const alumnos = sequelize.define(
  "alumnos",
  {
    id_alumno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      unique: true,
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),
    nombres: DataTypes.STRING(80),
    apat: DataTypes.STRING(80),
    amat: DataTypes.STRING(80),
    f_nac: DataTypes.DATE,
    genero: DataTypes.STRING(1),
    domicilio: DataTypes.STRING(200),
    id_comuna: {
      type: DataTypes.INTEGER,
      references: {
        model: comunas,
        key: "id_comuna",
      },
    },
    cur_repe: DataTypes.STRING(45),
    canthnos: DataTypes.INTEGER,
    nroentrehnos: DataTypes.INTEGER,
    hnosaca: DataTypes.INTEGER,
    hnoscursos: DataTypes.STRING(45),
    nrofamiliar: DataTypes.INTEGER,
    enfermo: DataTypes.INTEGER,
    cuidados: DataTypes.STRING(300),
    fincorpora: DataTypes.DATE,
    fecharetiro: DataTypes.DATE,
    motivoretiro: DataTypes.STRING(400),
    procedencia: DataTypes.STRING(100),
    promedionotas: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0.0 },
    agnoegreso: DataTypes.INTEGER,
    idapoderado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "apoderados",
        key: "id_ap",
      },
    },
    idparentesco: {
      type: DataTypes.INTEGER,
      references: {
        model: "parentescos",
        key: "idparentesco",
      },
    },
    txtparentesco: DataTypes.STRING(100),
    idapoderadosupl: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "apoderados",
        key: "id_ap",
      },
    },
    idparentescosupl: DataTypes.INTEGER,
    txtparentescosupl: DataTypes.STRING(100),
    idvivecon: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vivecon",
        key: "idvivecon",
      },
    },
    descripcionvivecon: DataTypes.STRING(100),
    evaluareligion: DataTypes.BOOLEAN,
    idpadre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "apoderados",
        key: "id_ap",
      },
    },
    idmadre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "apoderados",
        key: "id_ap",
      },
    },

    idcurso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "cursos",
        key: "id_curso",
      },
    },
    idmatricula: DataTypes.INTEGER,
    ingresogrupofamiliar: DataTypes.INTEGER,
    vivienda: DataTypes.INTEGER,
    cod_ense: DataTypes.INTEGER,
    cod_grado: DataTypes.INTEGER,
    letra: DataTypes.STRING(10),
    nro_matricula: DataTypes.INTEGER,
    agno_matricula: DataTypes.STRING(100),
    educ_madre: DataTypes.STRING(100),
    educ_padre: DataTypes.STRING(100),
    activo: DataTypes.BOOLEAN,
    nroal: DataTypes.INTEGER,
    alumnoscol: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);
// Relación con apoderados (idmadre, idpadre, idapoderado, etc.)
alumnos.belongsTo(apoderados, { foreignKey: "idmadre", as: "madre" });
alumnos.belongsTo(apoderados, { foreignKey: "idpadre", as: "padre" });
alumnos.belongsTo(apoderados, { foreignKey: "idapoderado", as: "apoderado" });
alumnos.belongsTo(apoderados, { foreignKey: "idapoderadosupl", as: "apoderadoSuplente" });

// Relación con parentescos
alumnos.belongsTo(parentescos, { foreignKey: "idparentesco", as: "parentesco" });
alumnos.belongsTo(parentescos, { foreignKey: "idparentescosupl", as: "parentescoSuplente" });

// Relación con vivecon
alumnos.belongsTo(vivecon, { foreignKey: "idvivecon", as: "viveCon" });

// Relación con cursos
alumnos.belongsTo(cursos, { foreignKey: "idcurso", as: "curso" });

// Relación con comunas
alumnos.belongsTo(comunas, { foreignKey: "id_comuna", as: "comuna" });

import { DataTypes } from 'sequelize'
import { sequelize } from "../bdatos/bdatos.js"

const Docente = sequelize.define('docente', {
    id_profesor: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    apat: {
        type: DataTypes.STRING(80),
        allowNull: false,        
        validate: {
            notNull: { args: true, msg: "Ingrese ap. Paterno válido" },
            len:     { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    amat: {
        type: DataTypes.STRING(80),
        allowNull: false,        
        validate: {
            notNull: { args: true, msg: "Ingrese ap. Materno válido" },
            len:     { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    nom1: {
        type: DataTypes.STRING(80),
        allowNull: false,        
        validate: {
            notNull: { args: true, msg: "Ingrese Primer Nombre válido" },
            len:     { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    nom2: {
        type: DataTypes.STRING(80),
        allowNull: false,        
    },
    activo: {
        type: DataTypes.NUMBER,
        allowNull: false,        
    },
    Correo: {
        type: DataTypes.STRING(50),
        unique: { args: true, msg: "Correo ya existe, ingrese otro" },
        validate: {
            isEmail: { args: true, msg: "Debe ingresar un correo válido" }
        },
    }
}, { timestamps: false } )

export default Docente

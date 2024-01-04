import { DataTypes } from 'sequelize'
import { sequelize } from "../bdatos/bdatos.js"
import bcrypt, { hash } from 'bcrypt'

export const Usuarios = sequelize.define('Usuarios', {
    idusuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombreusuario: {
        type: DataTypes.STRING(50),
        unique: { args: true, msg: "Nombre usuario ya existe, utilice otro" },
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "Debe Ingresar a un Usuario válido" },
            len: { args: [4, 25], msg: "El largo debe estar entre 4 y 25 caracteres" }
        },
    },
    correo: {
        type: DataTypes.STRING(50),
        unique: { args: true, msg: "Correo ya existe, ingrese otro" },
        validate: {
            isEmail: { args: true, msg: "Debe ingresar un correo válido" }
        },
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false,
        set(value) {
            if (value) {
                let salt = bcrypt.genSaltSync(12)
                let hash = bcrypt.hashSync(value, salt)
                this.setDataValue('password', hash)
            }
        }
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
            len: { args: [7, 9], msg: "El largo del rut debe estar entre 7 y 9 dígitos" },
            isInt: true,
        }
    },
    dv: {
        type: DataTypes.STRING(1),
    },
    rol: {
        type: DataTypes.INTEGER(2),
        validate: {
            isNumeric: { args: true, msg: "Debe ingresar solamente números" },
            len: { args: [2], msg: "El largo máximo 2 dígitos" },
            isInt: true,
        }
    },
}, { timestamps: true }

)

Usuarios.prototype.validaPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password)
}

Usuarios.sync().then(() => {
    console.log('Modelo Usuarios, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Usuarios con la base de datos:', error);
});



export const Docentes = sequelize.define('Docentes', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),

    apat: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "Ingrese ap. Paterno válido" },
            len: { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    amat: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "Ingrese ap. Materno válido" },
            len: { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    nombres: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "Ingrese un Nombre válido" },
            len: { args: [4, 80], msg: "El largo debe estar entre 4 y 80 caracteres" }
        },
    },
    fono: DataTypes.STRING(50),
    correo: {
        type: DataTypes.STRING(50),
        unique: { args: true, msg: "Correo ya existe, ingrese otro" },
        validate: {
            isEmail: { args: true, msg: "Debe ingresar un correo válido" }
        },
    },
    funcion: DataTypes.INTEGER,
    dia_at: DataTypes.INTEGER,
    hini_at: DataTypes.STRING(5),
    hter_at: DataTypes.STRING(5),
    activo: DataTypes.BOOLEAN,
    pb: DataTypes.BOOLEAN,
    ba: DataTypes.BOOLEAN,
    me: DataTypes.BOOLEAN
}, { freezeTableName: true, timestamps: false })

Docentes.sync().then(() => {
    console.log('Modelo Docentes, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Docentes con la base de datos:', error);
});



export const Comunas = sequelize.define('Comunas', {
    id_comuna: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },

    descripcion: DataTypes.STRING(120)
}, { freezeTableName: true })

Comunas.sync().then(() => {
    console.log('Modelo Comunas, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Comunas con la base de datos:', error);
});


export const Parentescos = sequelize.define('Parentescos', {
    idparentesco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descripcion: DataTypes.STRING(45)
}, { freezeTableName: true })

Parentescos.sync().then(() => {
    console.log('Modelo Parentescos, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Parentescos con la base de datos:', error);
});


export const Vivecon = sequelize.define('Vivecon', {
    idvivecon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    descripcion: DataTypes.STRING(45)
}, { freezeTableName: true })


Vivecon.sync().then(() => {
    console.log('Modelo Vivecon, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Vivecon con la base de datos:', error);
});



export const Salas = sequelize.define('Salas', {
    id_sala: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    nro_sala: DataTypes.INTEGER,
    ubicacion: DataTypes.STRING(200),
    descripcion: DataTypes.STRING(200),
}, { freezeTableName: true })


Salas.sync().then(() => {
    console.log('Modelo Salas, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Salas con la base de datos:', error);
});


export const Alumnos = sequelize.define('Alumnos', {
    id_alumno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),
    apat: DataTypes.STRING(80),
    amat: DataTypes.STRING(80),
    nombres: DataTypes.STRING(80),
    f_nac: DataTypes.DATE,
    genero: DataTypes.STRING(1),
    domicilio: DataTypes.STRING(200),
    id_comuna: {
        type: DataTypes.INTEGER,
        references: {
            model: Comunas,
            key: 'id_comuna'
        }
    },
    cur_repe: DataTypes.STRING(45),
    canthnos: DataTypes.INTEGER,
    nroentrehnos: DataTypes.INTEGER,
    hnosaca: DataTypes.INTEGER,
    hnoscursos: DataTypes.STRING(45),
    enfermo: DataTypes.INTEGER,
    cuidados: DataTypes.STRING(300),
    fecharetiro: DataTypes.DATE,
    motivoretiro: DataTypes.STRING(400),
    agnoegreso: DataTypes.INTEGER,
    activo: DataTypes.BOOLEAN,
}, { freezeTableName: true }
)
// Alumnos.belongsTo(Vivecon, { foreignKey: 'idvivecon' });
// Alumnos.belongsTo(Comunas, { foreignKey: 'id_comuna' });


Alumnos.sync().then(() => {
    console.log('Modelo Alumnos, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Alumnos con la base de datos:', error);
});


export const Apoderados = sequelize.define('Apoderados', {
    idapoderados: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    rut: DataTypes.INTEGER,
    dv: DataTypes.STRING(1),
    nombres: DataTypes.STRING(200),
    apat: DataTypes.STRING(80),
    amat: DataTypes.STRING(80),
    sexo: DataTypes.STRING(1),
    fono1: DataTypes.STRING(120),
    fono2: DataTypes.STRING(300),
    email: DataTypes.STRING(45),
    domicilio: DataTypes.STRING(200),
    id_comuna: {
        type: DataTypes.INTEGER,
        references: {
            model: Comunas,
            key: 'id_comuna'
        }
    },

}, { freezeTableName: true })
// Apoderados.belongsTo(Comunas, { foreignKey: 'id_comuna' });

Apoderados.sync().then(() => {
    console.log('Modelo Apoderados, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Apoderados con la base de datos:', error);
});


export const Cursos = sequelize.define('Cursos', {
    id_curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    nomcorto: DataTypes.STRING(20),
    nomlargo: DataTypes.STRING(80),
    id_sala: {
        type: DataTypes.INTEGER,
        references: {
            model: Salas,
            key: 'id_sala'
        }
    },
    jornada: DataTypes.STRING(10),
    agno: DataTypes.INTEGER,
    id_ciclo: DataTypes.INTEGER,
    cod_ense: DataTypes.INTEGER,
    cod_grado: DataTypes.INTEGER,
    desc_Grado: DataTypes.STRING(40),
    letra: DataTypes.STRING(1),
    nivel: DataTypes.INTEGER,
    id_profesor: {
        type: DataTypes.INTEGER,
        references: {
            model: Docentes,
            key: 'id_profesor'
        }
    },
}, { freezeTableName: true })
//Cursos.belongsTo(Salas, { foreignKey: 'id_sala' });
//Cursos.belongsTo(Docentes, { foreignKey: 'id_profesor' });

Cursos.sync().then(() => {
    console.log('Modelo Cursos, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Cursos con la base de datos:', error);
});


export const Matriculas = sequelize.define('Matriculas', {
    idmatricula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        references: {
            model: Alumnos,
            key: 'id_alumno'
        }
    },
    f_matricula: DataTypes.DATE,
    id_curso: {
        type: DataTypes.INTEGER,
        references: {
            model: Cursos,
            key: 'id_curso'
        }
    },
    idapoderado: {
        type: DataTypes.INTEGER,
        references: {
            model: Apoderados,
            key: 'idapoderados'
        }
    },
    idparentesco: {
        type: DataTypes.INTEGER,
        references: {
            model: Parentescos,
            key: 'idparentesco'
        }
    },
    txtparentesco: DataTypes.INTEGER,

    idapoderadosupl: {
        type: DataTypes.INTEGER,
        references: {
            model: Apoderados,
            key: 'idapoderados'
        }
    },
    idparentescosupl: {
        type: DataTypes.INTEGER,
        references: {
            model: Parentescos,
            key: 'idparentesco'
        }
    },
    txtparentescosupl: DataTypes.STRING(100),
    agno_matricula: DataTypes.INTEGER,
    pagado: DataTypes.BOOLEAN,
    cole_origen: DataTypes.STRING(200),
    promedionota: DataTypes.DECIMAL(3, 1),
    activo: DataTypes.BOOLEAN,
    idvivecon: DataTypes.INTEGER,
    descripcionviveconotros: DataTypes.STRING(100),
    ingresofamiliar: DataTypes.INTEGER,
    tpvivienda: DataTypes.INTEGER,    
    evaluareligion: DataTypes.BOOLEAN,
    fecharetiro: DataTypes.DATE,
    motivoretiro: DataTypes.STRING(400),
    idpadres: DataTypes.INTEGER    

}, { freezeTableName: true })

/*
Matriculas.belongsTo(Alumnos, { foreignKey: 'id_alumno' });
Matriculas.belongsTo(Cursos, { foreignKey: 'id_curso' });
Matriculas.belongsTo(Parentescos, { foreignKey: 'idparentesco' });
Matriculas.belongsTo(Parentescos, { foreignKey: 'idparentescosupl' });
Matriculas.belongsTo(Apoderados, { foreignKey: 'idapoderado' });
Matriculas.belongsTo(Apoderados, { foreignKey: 'idapoderadosupl' });
*/

Matriculas.sync().then(() => {
    console.log('Modelo Matriculas, sincronizado correctamente con la base de datos');
}).catch((error) => {
    console.error('Error al sincronizar el modelo de Matriculas con la base de datos:', error);
});

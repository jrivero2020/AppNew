/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import {
  docentes,
  parentescos,
  comunas,
  alumnos,
} from "../modelos/modeloCole.js";

import { verErrorSequelize } from "../helpers/sequelizeErrores.js";
import { sequelize } from "../bdatos/bdatos.js";

const listaDocente = async (req, res) => {
  try {
    const docente = await docentes.findAll();
    res.json(docente);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const listaDocHorarios = async (req, res) => {
  try {
    const parametro = req.params.SpOpc;
    const docHorarios = await sequelize.query("CALL SP_HATENCION_PROFES( ? )", {
      replacements: [parametro],
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(docHorarios);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const docenteByID = async (req, res, next, id) => {
  try {
    const docente = await docentes.findByPk(id);
    if (docente === null) {
      res.status(404).json({ mensaje: "docente no encontrado" });
    } else {
      req.profile = docente.dataValues;
      next();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const leerDocente = (req, res) => {
  return res.json(req.profile);
};

const crearDocente = async (req, res) => {
  try {
    const newdocente = await docentes.create(req.body);
    return res.status(200).json({ message: "Registro exitoso" });
  } catch (e) {
    return res.status(500).json({ message: verErrorSequelize(e) });
  }
};

const inscripcionDocente = async (req, res) => {
  try {
    const newdocente = await docentes.create(req.body);
    return res.status(200).json({ message: "Inscripción exitosa" });
  } catch (e) {
    return res.status(500).json({ message: verErrorSequelize(e) });
  }
};

const updateDocente = async (req, res) => {
  try {
    const docente = await docentes.findByPk(req.profile.iddocente);
    docente.set(req.body);
    docente.updatedAt = Date.now();
    await docente.save();
    docente.password = undefined;
    res.json(docente);
  } catch (e) {
    return res.status(500).json({ message: verErrorSequelize(e) });
  }
};
const deleteDocente = async (req, res) => {
  const { id } = req.params;
  let user = req.profile; // lo voy a ver
  try {
    let alumno = await docentes.destroy({
      where: { iddocente: req.profile.iddocente },
    });
    if (alumno > 0) {
      res.json({ message: "Registro borrado" });
    } else res.status(404).json({ message: "No se encontró registro" });
  } catch (e) {
    res.sendStatus(400).json({ message: verErrorSequelize(e) });
  }
};

const listaMatricula = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const dataMatricula = await sequelize.query(
      "CALL SP_getDataMatriculaRut( ? )",
      {
        replacements: [rutAl],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(dataMatricula);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const listaAlumnosByRut = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const dataCertificado = await sequelize.query(
      "CALL sp_getDataCertificadoAlumnoRegular( ? )",
      {
        replacements: [rutAl],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(dataCertificado);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateAlumnosByRut = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const body = req.body;
    await sequelize.query("CALL sp_actAlumnoCurso( ?,?,?,?,? )", {
      replacements: [
        rutAl,
        body.nroal,
        body.nro_matricula,
        body.fecharetiro.substring(0, 10),
        body.activo,
      ],
      type: sequelize.QueryTypes.UPDATE,
    });
    return res.status(200).json({
      message: "Actualización ejecutada",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getParentesco = async (req, res) => {
  try {
    const datParentesco = await parentescos.findAll({
      order: [["idparentesco", "ASC"]],
    });

    // console.log( "datParentesco :", datParentesco)
    res.json(datParentesco);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getComunas = async (req, res) => {
  try {
    const datcomunas = await comunas.findAll({
      order: [["descripcion", "ASC"]],
    });
    res.json(datcomunas);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCursos = async (req, res) => {
  try {
    const dataCursos = await sequelize.query(`CALL sp_GetDataCursos()`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(dataCursos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCantAlumnosCurso = async (req, res) => {
  try {
    const dataCursos = await sequelize.query(`CALL sp_getCantAlumnosCurso()`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(dataCursos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getDataAlumnoNombres = async (req, res) => {
  try {
    const nomAl = req.params.nomAl;
    const apPatAl = req.params.apPatAl;
    const apMatAl = req.params.apMatAl;
    const dataAlumos = await sequelize.query(
      `CALL sp_buscaAlNombres( ?,?,? )`,
      {
        replacements: [nomAl, apPatAl, apMatAl],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    // console.log("dataAlumos", dataAlumos);
    res.json(dataAlumos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//
// SP_csvLibroMatricula
const CsvLibroMatricula = async (req, res) => {
  try {
    const dataLibro = await sequelize.query(`CALL sp_LibroAsistencia()`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(dataLibro);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getNroMatriculas = async (req, res) => {
  try {
    const dataCursos = await sequelize.query(`CALL sp_getNroMatriculas()`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(dataCursos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAlumnosCurso = async (req, res) => {
  try {
    const dataCurso = await sequelize.query(
      `CALL colegio.sp_getAlumnosCurso( ?,?,? )`,
      {
        replacements: [req.params.ense, req.params.grado, req.params.letra],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(dataCurso);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const JsonInitOpcion = async (req, res) => {
  try {
    const dataJson = await sequelize.query(
      `CALL colegio.sp_getDataJsonInitOpcion()`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(JSON.stringify(dataJson));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const CreaAlumnoRut = async (req, res) => {
  try {
    const alNuevo = 1;
    const rutAl = req.params.rutAl;
    const resul = req.params.resul;
    const body = req.body;
    const camposRep = [
      body.al_rut,
      body.al_dv,
      body.al_nombres,
      body.al_apat,
      body.al_amat,
      body.al_f_nac,
      body.al_genero,
      body.al_domicilio,
      body.al_id_comuna,
      body.al_cur_repe,
      body.al_canthnos,
      body.al_nroentrehnos,
      body.al_hnosaca,
      body.al_hnoscursos,
      body.al_enfermo,
      body.al_cuidados,
      body.al_procedencia,
      body.al_promedionota,
      body.al_idvivecon,
      body.al_descripcionvivecon,
      body.al_idcurso,
    ];

    const MyQuery =
      resul === alNuevo
        ? `CALL colegio.sp_CreaAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        : `CALL colegio.sp_ActualizaAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    console.log("control=========> CreaAlumnoRut , req.params:", req.params);
    console.log("control=========> CreaAlumnoRut , camposRep:", camposRep);

    const idAlumno = await sequelize.query(MyQuery, {
      replacements: camposRep,
      type: sequelize.QueryTypes.INSERT,
    });
    if (resul === alNuevo) {
      console.log("control=> CreaAlumnoRut , idAlumno:", idAlumno);
    } else {
      console.log("control=> Actualiza alumno , idAlumno:", idAlumno);
    }

    res.json(idAlumno);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      console.log("details; ", err.errors[0].message);
      console.log("value; ", err.errors[0].value);

      return res.status(409).json({
        message: "El alumno ya existe con el RUT proporcionado.",
        details: err.errors[0].message, // Mensaje detallado del error
        value: err.errors[0].value, // El valor que causó el conflicto
      });
    }
    console.log(" Saliendo por catch err:", err);
    console.log(" Saliendo por catch err:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

export default {
  docenteByID,
  leerDocente,
  crearDocente,
  updateDocente,
  listaDocente,
  deleteDocente,
  inscripcionDocente,
  listaDocHorarios,
  listaAlumnosByRut,
  updateAlumnosByRut,
  listaMatricula,
  getComunas,
  getCursos,
  getParentesco,
  getDataAlumnoNombres,
  CsvLibroMatricula,
  getCantAlumnosCurso,
  getNroMatriculas,
  getAlumnosCurso,
  JsonInitOpcion,
  CreaAlumnoRut,
};

/*
[ al_rut,
 al_dv,
al_nombres,
al_apat,
al_amat,
al_f_nac,
al_genero,
al_domicilio,
al_id_comuna,
al_cur_repe,
al_canthnos,
al_nroentrehnos,
al_hnosaca,
al_hnoscursos,
al_enfermo,
al_cuidados,
al_procedencia,
al_promedionota,
al_idvivecon,
al_descripcionvivecon,
al_idcurso
]




rut
dv    
nombres
apat
amat
f_nac
genero
domicilio
id_comuna
cur_repe
canthnos
nroentrehnos
hnosaca
hnoscursos
enfermo
cuidados
procedencia
promedionotas
idvivecon
descripcionvivecon
idcurso


CREATE  PROCEDURE sp_buscaAlNombres(IN nombres_alumno varchar(80), in apPat_Alumno varchar(80), in apMat_Alumno varchar(80) )
begin		
	set nombres_alumno = trim( nombres_alumno );
	set apPat_Alumno = trim( apPat_Alumno );
	set apMat_Alumno = trim( apMat_Alumno );
	
	IF nombres_alumno = '@' THEN
        SET nombres_alumno = '';
    END IF;	
	IF apPat_Alumno = '@' THEN
        SET apPat_Alumno = '';
    END IF;	
	IF apMat_Alumno = '@' THEN
        SET apMat_Alumno = '';
    END IF;	
	
    SELECT al_rut as id,al_rut,al_dv, al_nombres ,al_apat ,al_amat, c_nomcorto as curso 
    FROM view_matriculas vm 
    WHERE vm.al_activo = 1 and vm.al_nombres COLLATE utf8mb4_unicode_520_ci like concat('%', nombres_alumno COLLATE utf8mb4_unicode_520_ci, '%') 
    and vm.al_apat COLLATE utf8mb4_unicode_520_ci like concat('%', apPat_Alumno COLLATE utf8mb4_unicode_520_ci, '%') 
    and al_amat COLLATE utf8mb4_unicode_520_ci like concat('%', apMat_Alumno COLLATE utf8mb4_unicode_520_ci, '%')
    order by al_apat COLLATE utf8mb4_unicode_520_ci,
    al_amat COLLATE utf8mb4_unicode_520_ci, 
    al_nombres COLLATE utf8mb4_unicode_520_ci;
END


prut,
pdv,
pnombres,
papat,
pamat,
pfnac,
pgenero,
pdomicilio,
pidcomuna,
pcurrepe,
pcanthnos,
pnroentrehnos,
phnosaca,
phnoscursos,
penfermo,
pcuidados,
pprocedencia,
ppromedionota,
pidvivecon,
pdescripcionvivecon,
pidcurso

[
          body.al_rut,
          body.al_dv,
          body.al_nombres,
          body.al_apat,
          body.al_amat,
          body.al_f_nac,
          body.al_genero,
          body.al_domicilio,
          body.al_id_comuna,
          body.al_cur_repe,
          body.al_canthnos,
          body.al_nroentrehnos,
          body.al_hnosaca,
          body.al_hnoscursos,
          body.al_enfermo,
          body.al_cuidados,
          body.al_procedencia,
          body.al_promedionota,
          body.al_idvivecon,
          body.al_descripcionvivecon,
          body.al_idcurso,
          nroparam,
        ]



const updateAlumnosByRut = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const body = req.body;
    await sequelize.query("CALL sp_actAlumnoCurso( ?,?,?,?,? )", {
      replacements: [
        rutAl,
        body.nroal,
        body.nro_matricula,
        body.fecharetiro.substring(0, 10),
        body.activo,
      ],
      type: sequelize.QueryTypes.UPDATE,
    });
    return res.status(200).json({
      message: "Actualización ejecutada",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const CreaAlumnoRut = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const body = req.body;
    let nroparam = 0;
    const query = `
    SET @salida = 0;
    CALL sp_CreaAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@salida);
    SELECT @salida AS oidalumno;
 `;

    const camposRep = [
      body.al_rut,
      body.al_dv,
      body.al_nombres,
      body.al_apat,
      body.al_amat,
      body.al_f_nac,
      body.al_genero,
      body.al_domicilio,
      body.al_id_comuna,
      body.al_cur_repe,
      body.al_canthnos,
      body.al_nroentrehnos,
      body.al_hnosaca,
      body.al_hnoscursos,
      body.al_enfermo,
      body.al_cuidados,
      body.al_procedencia,
      body.al_promedionota,
      body.al_idvivecon,
      body.al_descripcionvivecon,
      body.al_idcurso,
      nroparam,
    ]
    console.log("control=========> CreaAlumnoRut , req.params:", req.params)
    console.log("control=========> CreaAlumnoRut , camposRep:", camposRep)

    const idAlumno = await sequelize.query(query,{
        replacements: camposRep,
        type: sequelize.QueryTypes.INSERT,
      }
    );
    console.log("**** ID generado:****", idAlumno[2][0].oidalumno);
    console.log("control=> CreaAlumnoRut , idAlumno:", idAlumno)


    res.send(JSON.stringify(idAlumno));
    return res.status(200).json({
      message: "Ingreso ejecutado",
    });
  } catch (err) {
    console.log(" Saliendo por catch err:", err)
    return res.status(500).json({ message: err.message });
  }
};


*/

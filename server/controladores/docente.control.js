/* eslint-disable import/no-anonymous-default-export */
import { docentes, parentescos, comunas } from "../modelos/modeloCole.js";

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
    const body = req.body
    console.log("Body :", body)
    console.log("req.params :", req.params, ' Rut :', rutAl)
    console.log(rutAl,
      body.nroal,
      body.nro_matricula,
      body.fecharetiro.substring(0, 10),
      body.activo)

    await sequelize.query(
      "CALL sp_actAlumnoCurso( ?,?,?,?,? )",
      {
        replacements: [rutAl,
          body.nroal,
          body.nro_matricula,
          body.fecharetiro.substring(0, 10),
          body.activo],
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    return res.status(200).json({
      message: "Actualización ejecutada"
    })

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const getParentesco = async (req, res) => {
  try {
    const datParentesco = await parentescos.findAll({
      order: [["idparentesco", "ASC"]],
    });
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

const JsonInitOpcion  = async (req, res) => {
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
};

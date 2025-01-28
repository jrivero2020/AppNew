/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import fs from "fs";
import path from "path";

import {
  docentes,
  parentescos,
  comunas,
  alumnos,
} from "../modelos/modeloCole.js";

import { verErrorSequelize } from "../helpers/sequelizeErrores.js";
import { sequelize } from "../bdatos/bdatos.js";

// Método para obtener imágenes por categoría
const obtenerImagenesPorCategoria = async (req, res) => {
  const { category } = req.query; // Obtener la categoría desde el frontend
  if (!category) {
    return res.status(400).json({ error: "La categoría es requerida" });
  }

  // Ruta de la carpeta de imágenes
  const categoryFolder = path.join(
    process.cwd(),
    "dist",
    "images",
    "fotos",
    category
  );

  // Leer los archivos de la carpeta
  fs.readdir(categoryFolder, (error, files) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer la carpeta" });
    }

    // Crear un array con las rutas de las imágenes
    const images = files.map((file) => ({
      id: file, // Nombre del archivo como ID
      url: `/dist/images/fotos/${category}/${file}`, // Ruta para acceder a la imagen
      title: file.split(".")[0], // Título (nombre del archivo sin extensión)
    }));

    // Devolver las imágenes al frontend
    res.status(200).json(images);
  });
};

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

const getDatosFamilia = async (req, res) => {
  try {
    const rutAl = req.params.rutAl;
    const dataMatricula = await sequelize.query(
      "CALL sp_getdatosfamiliaap( ? )",
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
    const resul = req.body.result;
    const body = req.body.alumno;
    // console.log(" ****body**** =>", body, "*********Resul =>", resul);
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
      body.al_activo,
      body.al_evaluareligion,
      body.al_idapoderado,
      body.al_idapoderadosupl,
      body.al_idmadre,
      body.al_idpadre,
      body.al_idparentesco,
      body.al_idparentescosupl,
      body.al_ingresogrupofamiliar,
      body.al_nrofamiliar,
      body.al_vivienda,
      body.ap_rut,
      body.ap_dv,
      body.ap_nombres,
      body.ap_apat,
      body.ap_amat,
      body.ap_parentesco,
      body.ap_fono1,
      body.ap_fono2,
      body.ap_emergencia,
      body.ap_email,
      body.ap_domicilio,
      body.ap_id_comuna,
      body.apsu_rut,
      body.apsu_dv,
      body.apsu_nombres,
      body.apsu_apat,
      body.apsu_amat,
      body.apsu_parentesco,
      body.apsu_fono1,
      body.apsu_fono2,
      body.apsu_emergencia,
      body.apsu_email,
      body.apsu_domicilio,
      body.apsu_id_comuna,
      body.madre_rut,
      body.madre_dv,
      body.madre_nombres,
      body.madre_apat,
      body.madre_amat,
      body.madre_estudios,
      body.madre_ocupacion,
      body.padre_rut,
      body.padre_dv,
      body.padre_nombres,
      body.padre_apat,
      body.padre_amat,
      body.padre_estudios,
      body.padre_ocupacion,
    ];

    const MyQuery = `CALL colegio.InsertarActualizarAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    //       resul === alNuevo
    //         ? `CALL colegio.sp_CreaAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    //         : `CALL colegio.sp_ActualizaAlumno(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const idAlumno = await sequelize.query(MyQuery, {
      replacements: camposRep,
      type: sequelize.QueryTypes.INSERT,
    });

    res.json(idAlumno);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      // console.log("details; ", err.errors[0].message);
      // console.log("value; ", err.errors[0].value);

      return res.status(409).json({
        message: "El alumno ya existe con el RUT proporcionado.",
        details: err.errors[0].message, // Mensaje detallado del error
        value: err.errors[0].value, // El valor que causó el conflicto
      });
    }
    //    console.log(" Saliendo por catch err:", err);
    //    console.log(" Saliendo por catch err:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

const getDataApoderadoNombres = async (req, res) => {
  try {
    const nomAp = req.params.nomAp;
    const apPatAp = req.params.apPatAp;
    const apMatAp = req.params.apMatAp;
    const dataApoderado = await sequelize.query(
      `CALL sp_buscaApoderadoNombres( ?,?,? )`,
      {
        replacements: [nomAp, apPatAp, apMatAp],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log("dataApoderados", dataApoderado);
    res.json(dataApoderado);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const JsonGetNoticias = async (req, res) => {
  try {
    const dataJson = await sequelize.query(`CALL colegio.sp_getNoticias()`, {
      type: sequelize.QueryTypes.SELECT,
    });
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
  CreaAlumnoRut,
  getDatosFamilia,
  getDataApoderadoNombres,
  JsonGetNoticias,
  obtenerImagenesPorCategoria,
};

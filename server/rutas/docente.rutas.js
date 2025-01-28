import { Router } from "express";
import docenteCtrl from "../controladores/docente.control.js";
import authCtrl from "../controladores/auth.control.js";
const router = Router();

router
  .route("/Docente")
  .get(docenteCtrl.listaDocente)
  .post(docenteCtrl.crearDocente);

router.route("/docenteHorarios/:SpOpc").get(docenteCtrl.listaDocHorarios);

router.route("/inscripcionDocente").post(docenteCtrl.inscripcionDocente);

router
  .route("/Docente/:Id")
  .get(authCtrl.requireSignin, authCtrl.estaAutorizado, docenteCtrl.leerDocente)
  .put(
    authCtrl.requireSignin,
    authCtrl.estaAutorizado,
    docenteCtrl.updateDocente
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.estaAutorizado,
    docenteCtrl.deleteDocente
  );

router
  .route("/CsvLibroMatricula")
  .get(authCtrl.requireSignin, docenteCtrl.CsvLibroMatricula);

router
  .route("/AlumnosByRut/:rutAl")
  .get(docenteCtrl.listaAlumnosByRut)
  .put(authCtrl.requireSignin, docenteCtrl.updateAlumnosByRut);

router
  .route("/matricula/:rutAl")
  .get(authCtrl.requireSignin, docenteCtrl.listaMatricula);

router.param("Id", docenteCtrl.docenteByID);

router.route("/getComunas").get(docenteCtrl.getComunas);

router.route("/getCursos").get(docenteCtrl.getCursos);

router.route("/getParentesco").get(docenteCtrl.getParentesco);

router
  .route("/getAlumnoNombres/:nomAl/:apPatAl/:apMatAl")
  .get(docenteCtrl.getDataAlumnoNombres);

router
  .route("/getCantAlumnosCurso")
  .get(authCtrl.requireSignin, docenteCtrl.getCantAlumnosCurso);

router
  .route("/getNroMatriculas")
  .get(authCtrl.requireSignin, docenteCtrl.getNroMatriculas);

router
  .route("/getAlumnosCurso/:ense/:grado/:letra")
  .get(authCtrl.requireSignin, docenteCtrl.getAlumnosCurso);

router.route("/JsonInitOpcion").get(docenteCtrl.JsonInitOpcion);

router
  .route("/UpdateInsertAlumno/:al_rut")
  .put(authCtrl.requireSignin, docenteCtrl.CreaAlumnoRut);

router
  .route("/rutaGetDatosFamilia/:rutAl")
  .get(authCtrl.requireSignin, docenteCtrl.getDatosFamilia);

router
  .route("/rutaGetApoderadoNombres/:nomAp/:apPatAp/:apMatAp")
  .get(docenteCtrl.getDataApoderadoNombres);

router.route("/JsonGetNoticias").get(docenteCtrl.JsonGetNoticias);

// Ruta para obtener imágenes por categoría
router.route("/api/images").get(docenteCtrl.obtenerImagenesPorCategoria);

export default router;

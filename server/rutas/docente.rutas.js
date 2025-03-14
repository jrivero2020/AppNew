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

// Ruta para CREAR SOLICITUD DE EQUIPOS
router.route("/getCursos").get(docenteCtrl.getCursos);

router.route("/getAsignaturas").get(docenteCtrl.getAsignaturas);

// router.route("/getJornadas").get(docenteCtrl.getJornadas);

router.route("/getEquipamiento").get(docenteCtrl.getEquipamiento);

router.route("/getBloquesHorarios/:jornada_id/:equipamiento_id/:fecha_solicitud")
.get(docenteCtrl.getBloquesHorarios);


router.route("/api/CreaSolicitaEquipo").post(authCtrl.requireSignin,docenteCtrl.CreaSolicitaEquipo);

router.route("/api/profesor/:id_profesor").get(authCtrl.requireSignin,docenteCtrl.SolicitudEquipoProfe )

export default router;

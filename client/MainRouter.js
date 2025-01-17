import React from "react";
import { Routes, Route } from "react-router-dom";
import { NoMatch } from "./assets/NoMatch";
import LstUsuarios from "./usuario/LstUsuarios";
import Signup from "./usuario/Signup";
import SalidaUsr from "./auth/SignOut";
import Inscripcion from "./usuario/Inscripcion";
import MiddlewarePdf from "./core/MiddlewarePdf";
import DocenteHoras from "./core/DocenteHoras";
import HistoriaDetalle from "./assets/data/historiaDetalle";
import Vision from "./assets/data/vision";
import Mision from "./assets/data/mision";
import CertAlumnoRegular from "./print/CertAlumnoRegular";
import LabTabs from "./Matriculas/LabTabs";
import VerUtilesEscolares from "./core/VerUtilesEscolares";
import Alertas from "./assets/mensajes/Alertas";
import Parent from "./Matriculas/Parent";
import CompLibroMatricula from "./Matriculas/CompLibroMatriculas";
import Pendiente from "./core/PagPendiente";
import Menu from "./core/menuCLCII";
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from "./core/AuthProvider";
import AlumnosCursos from "./Matriculas/AlumnosCursos";
import BuscarAlumno from "./FichaAlumnos/BuscarAlumno";
import Signin from "./auth/Signin";
import FullFeaturedCrudGrid from "./assets/GrillaExamples/FullFeaturedCrudGrid";
import PrincipalGui from "./core/InitOpcionII";
import VerJSON from "./../client/core/VerJSON";

const MainRouter = () => {
  return (
    <>
      <AuthProvider>
        <Menu />

        <Routes>
          <Route path="/" element={<PrincipalGui />} />
          <Route
            path="/FullFeaturedCrudGrid"
            element={<FullFeaturedCrudGrid />}
          />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/lstusuario" element={<LstUsuarios />} />
          <Route path="/SalidaUsr" element={<SalidaUsr />} />
          <Route path="/Inscripcion" element={<Inscripcion />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/HistoriaDetalle" element={<HistoriaDetalle />} />
          <Route path="/Vision" element={<Vision />} />
          <Route path="/Mision" element={<Mision />} />

          <Route path="/MiddlewarePdf" element={<MiddlewarePdf />} />

          <Route path="/VerUtilesEscolares" element={<VerUtilesEscolares />} />
          <Route path="/DocenteHoras" element={<DocenteHoras />} />
          <Route path="/VerJSON" element={<VerJSON />} />

          <Route
            path="/CertAlumnoRegular"
            element={
              <PrivateRoute>
                <CertAlumnoRegular />
              </PrivateRoute>
            }
          />
          <Route path="/LabTabs" element={<LabTabs />} />
          <Route
            path="/BuscarAlumno"
            element={
              <PrivateRoute rol={2}>
                <BuscarAlumno />
              </PrivateRoute>
            }
          />
          <Route
            path="/AlumnosCursos"
            element={
              <PrivateRoute rol={2}>
                <AlumnosCursos />
              </PrivateRoute>
            }
          />

          <Route path="/Alertas" element={<Alertas />} />
          <Route path="/Parent" element={<Parent />} />
          <Route path="/Pendiente" element={<Pendiente />} />
          <Route
            path="/CompLibroMatricula"
            element={
              <PrivateRoute>
                <CompLibroMatricula />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </AuthProvider>
    </>
  );
};
export default MainRouter;

//             <Route exact path="/ImprimeCertificado" element={<ImprimeCertificado />} />
//

import React from "react";
import { Routes, Route } from "react-router-dom";
import { NoMatch } from "./assets/NoMatch";
import LstUsuarios from "./usuario/LstUsuarios";
import Signup from "./usuario/Signup";
import SalidaUsr from "./auth/SignOut";
import Inscripcion from "./usuario/Inscripcion";
// import auth from "./auth/auth-helper";
// import Carousel from "./core/carousel";
import ReactImageGalery from "./core/ReactimageGalery";
import MiddlewarePdf from "./core/MiddlewarePdf";
import DocenteHoras from "./core/DocenteHoras";
import HistoriaDetalle from "./assets/data/historiaDetalle";
import FichaDelAlumno2 from "./Matriculas/FichaDelAlumno2";
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

import Signin from "./auth/Signin";
import FullFeaturedCrudGrid from "./assets/GrillaExamples/FullFeaturedCrudGrid"
import PrincipalGui from './../client/core/PrincipalGui'

/*
const Signout = () => {
  auth.clearJWT();
  // let location = useLocation();
  return <Navigate to="/" replace />;
};
*/


const MainRouter = () => {
  return (
    <>
      <AuthProvider>
        <Menu />

        <Routes>
          <Route path="/" element={<PrincipalGui />} />
          <Route path='/FullFeaturedCrudGrid' element={<FullFeaturedCrudGrid /> } />
          <Route path="/Signup" element={<Signup /> } />
          <Route path="/lstusuario" element={<LstUsuarios />} />
          <Route path="/SalidaUsr" element={<SalidaUsr />} />
          <Route path="/Inscripcion" element={<Inscripcion />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/HistoriaDetalle" element={<HistoriaDetalle />} />
          <Route path="/MiddlewarePdf" element={<MiddlewarePdf />} />
          <Route path="/VerUtilesEscolares" element={<VerUtilesEscolares />} />
          <Route path="/DocenteHoras" element={<DocenteHoras />} />
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
            path="/FichaDelAlumno2"
            element={
              <PrivateRoute rol={2}>
                <FichaDelAlumno2 />
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

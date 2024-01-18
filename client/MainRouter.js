import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SwipeableTemporaryDrawer from "./core/menu2";
import { NoMatch } from "./assets/NoMatch";
import LstUsuarios from "./usuario/LstUsuarios";
import Signup from "./usuario/Signup";
import Signin from "./auth/Signin";
import Inscripcion from "./usuario/Inscripcion";
import auth from "./auth/auth-helper";
import Carousel from "./core/carousel";
import VisorPdfII from "./core/VisorPdfII";
import DocenteHoras from "./core/DocenteHoras";
import HistoriaDetalle from "./assets/data/historiaDetalle";
import FichaDelAlumno2 from "./Matriculas/FichaDelAlumno2";
import CertAlumnoRegular from "./print/CertAlumnoRegular";
import LabTabs from "./Matriculas/LabTabs";
import VerUtiles from "./core/VerUtiles";
import VerGrilla from "./core/VerGrilla";
import Alertas from "./assets/mensajes/Alertas";
import Parent from "./Matriculas/Parent";

const Signout = () => {
  auth.clearJWT();
  // let location = useLocation();
  return <Navigate to="/" replace />;
};

const Home = () => {
  return <Navigate to="/" replace />;
};

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Carousel />} />
      <Route path="/lstusuario" element={<LstUsuarios />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Inscripcion" element={<Inscripcion />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signout" element={<Signout />} />
      <Route path="/menu2" element={<SwipeableTemporaryDrawer />} />
      <Route path="/HistoriaDetalle" element={<HistoriaDetalle />} />
      <Route path="/VisorPdfII" element={<VisorPdfII />} />
      <Route path="/VerUtiles" element={<VerUtiles />} />
      <Route path="/VerGrilla" element={<VerGrilla />} />
      <Route path="/DocenteHoras" element={<DocenteHoras />} />
      <Route path="/CertAlumnoRegular" element={<CertAlumnoRegular />} />
      <Route path="/LabTabs" element={<LabTabs />} />
      <Route path="/FichaDelAlumno2" element={<FichaDelAlumno2 />} />
      <Route path="/Alertas" element={<Alertas />} />
      <Route path="/Parent" element={<Parent />} />
      <Route path="/Home" element={<Home />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};
export default MainRouter;

//             <Route exact path="/ImprimeCertificado" element={<ImprimeCertificado />} />

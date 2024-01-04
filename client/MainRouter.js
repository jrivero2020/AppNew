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
      <Route exact path="/" element={<Carousel />} />
      <Route exact path="/lstusuario" element={<LstUsuarios />} />
      <Route exact path="/Signup" element={<Signup />} />
      <Route exact path="/Inscripcion" element={<Inscripcion />} />
      <Route exact path="/Signin" element={<Signin />} />
      <Route exact path="/Signout" element={<Signout />} />
      <Route exact path="/menu2" element={<SwipeableTemporaryDrawer />} />
      <Route exact path="/Carousel" element={<Carousel />} />
      <Route exact path="/HistoriaDetalle" element={<HistoriaDetalle />} />
      <Route exact path="/VisorPdfII" element={<VisorPdfII />} />
      <Route exact path="/VerUtiles" element={<VerUtiles />} />
      <Route exact path="/VerGrilla" element={<VerGrilla />} />
      <Route exact path="/DocenteHoras" element={<DocenteHoras />} />
      <Route exact path="/CertAlumnoRegular" element={<CertAlumnoRegular />} />
      <Route exact path="/LabTabs" element={<LabTabs />} />
      <Route exact path="/FichaDelAlumno2" element={<FichaDelAlumno2 />} />
      <Route exact path="/Alertas" element={<Alertas />} />
      <Route exact path="/Parent" element={<Parent />} />
      <Route exact path="/Home" element={<Home />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};
export default MainRouter;

//             <Route exact path="/ImprimeCertificado" element={<ImprimeCertificado />} />

import React, { createContext, useState } from "react";
import { cFichaAlumno } from "./../Matriculas/matriculasCampos";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isJwtRol, setIsJwtRol] = useState(false);
  const [jwt, setJwt] = useState(false);
  const [activeImgLinks, setactiveImgLinks] = useState([]);
  const [dataBuscaAl, setDataBuscaAl] = useState(cFichaAlumno);
  const [Noticias, setNoticias] = useState([]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isJwtRol,
        setIsJwtRol,
        jwt,
        setJwt,
        activeImgLinks,
        setactiveImgLinks,
        dataBuscaAl,
        setDataBuscaAl,
        Noticias,
        setNoticias,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isJwtRol, setIsJwtRol] = useState(false);
  const [jwt, setJwt] = useState(false);
  const [activeImgLinks, setactiveImgLinks] = useState([]);
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
        setactiveImgLinks
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

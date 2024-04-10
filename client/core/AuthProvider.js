import React, { createContext, useState } from "react";
import auth from "./../auth/auth-helper";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isJwtRol, setIsJwtRol] = useState(false);

  /*
  if (isJwtRol) {
    auth.clearJWT();
  }
*/

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isJwtRol, setIsJwtRol }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import auth from "./../auth/auth-helper";

import { AuthContext } from "./../core/AuthProvider";

const SalidaUsr = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, isJwtRol, setIsJwtRol } =
    useContext(AuthContext);
  auth.clearJWT();

  useEffect(() => {
    setIsAuthenticated(false);
    setIsJwtRol(false);

    navigate("/");
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Saliendo del usuario</h1>
      <button> Aqui </button>
    </div>
  );
};

export default SalidaUsr;

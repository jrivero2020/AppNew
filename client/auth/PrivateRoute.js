import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./../core/AuthProvider";

function PrivateRoute({ children, rol }) {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/Signin" state={{ from: location }} />
  );
}

export default PrivateRoute;

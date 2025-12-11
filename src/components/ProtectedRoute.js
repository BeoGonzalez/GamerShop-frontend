import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, children, redirectTo = "/" }) => {
  if (!isAllowed) {
    // Si el usuario NO tiene permiso (no es admin), lo expulsamos
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene permiso, mostramos el contenido protegido (AdminPanel)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

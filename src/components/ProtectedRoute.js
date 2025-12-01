import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
  if (!isAllowed) {
    // Si no tiene permiso, lo mandamos a donde digas (login o tienda)
    return <Navigate to={redirectTo} replace />;
  }
  // Si tiene permiso, renderiza los hijos (la página solicitada)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

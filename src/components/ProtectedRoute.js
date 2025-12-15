import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, children, redirectTo = "/" }) => {
  // --- DIAGNÓSTICO (Borrar cuando todo funcione) ---
  console.log("👮 ProtectedRoute revisando acceso...");
  console.log("   ¿Permitido?:", isAllowed);

  if (!isAllowed) {
    console.warn("⛔ ACCESO DENEGADO. Redirigiendo a:", redirectTo);
    // Si el usuario NO tiene permiso, lo expulsamos
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene permiso, mostramos el contenido
  return children ? children : <Outlet />;
};

export default ProtectedRoute;

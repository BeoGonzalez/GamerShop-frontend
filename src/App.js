import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Componentes de Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito"; // Asumimos que esta es la Tienda/Carrito visual
import Login from "./pages/Login";
import AdminPanel from "./components/AdminPanel"; // El panel nuevo que creamos

function App() {
  // 1. Estado de Autenticación
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [rol, setRol] = useState(localStorage.getItem("rol"));

  // 2. Funciones de Sesión
  const handleLogin = (newToken, newRol) => {
    setToken(newToken);
    setRol(newRol);
    localStorage.setItem("token", newToken);
    localStorage.setItem("rol", newRol);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol(null);
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* 3. Pasamos el estado al Navbar para que muestre/oculte enlaces */}
        <Navbar isAuth={!!token} role={rol} onLogout={handleLogout} />

        <main className="flex-grow-1">
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/contacto" element={<Contact />} />

            {/* Login: Si ya está logueado, lo manda al home o donde prefieras */}
            <Route
              path="/login"
              element={
                !token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
              }
            />

            {/* --- RUTAS PARA USUARIOS REGISTRADOS (Cualquier ROL) --- */}
            <Route
              element={
                <ProtectedRoute isAllowed={!!token} redirectTo="/login" />
              }
            >
              {/* Aquí pueden entrar Admins y Usuarios */}
              <Route path="/carrito" element={<Carrito />} />
            </Route>

            {/* --- RUTA SOLO PARA ADMIN (AdminPanel) --- */}
            <Route
              element={
                <ProtectedRoute
                  isAllowed={!!token && rol === "ADMIN"}
                  redirectTo="/"
                />
              }
            >
              {/* Solo entra si es ADMIN. Si falla, lo manda al Home */}
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

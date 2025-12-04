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
import AdminPanel from "./pages/AdminPanel"; // El panel nuevo que creamos

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
        <Navbar isAuth={!!token} role={rol} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

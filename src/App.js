import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Registro from "./pages/Registro";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("USER");

  // 1. Al cargar la app, verificamos si hay una sesión guardada
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const username = localStorage.getItem("username");

    if (token) {
      setIsAuth(true);
      // Lógica simple: Si el usuario es "admin", le damos rol de ADMIN
      if (username === "admin") {
        setRole("ADMIN");
      } else {
        setRole("USER");
      }
    } else {
      setIsAuth(false);
      setRole("USER");
    }
  }, []);

  // 2. Función para actualizar el estado cuando el Login es exitoso
  const handleLoginSuccess = (username) => {
    setIsAuth(true);
    if (username === "admin") {
      setRole("ADMIN");
    } else {
      setRole("USER");
    }
  };

  // 3. Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    setIsAuth(false);
    setRole("USER");
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* El Navbar es fixed-top, flota sobre todo */}
        <Navbar isAuth={isAuth} role={role} onLogout={handleLogout} />

        {/* SOLUCIÓN: 
           Agregamos style={{ paddingTop: "80px" }} 
           Esto baja el contenido para que el Navbar no lo tape.
           Puedes ajustar el 80px si tu barra es más alta o más baja.
        */}
        <main className="flex-grow-1" style={{ paddingTop: "80px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/registro" element={<Registro />} />
            <Route
              path="/admin"
              element={
                isAuth && role === "ADMIN" ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

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
  const [rol, setRol] = useState("USER");
  const [username, setUsername] = useState(""); // NUEVO ESTADO PARA EL NOMBRE

  // 1. Al cargar, leemos todos los datos de la sesión
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    // LEEMOS EL ROL GUARDADO QUE VIENE DEL BACKEND
    const storedRol = localStorage.getItem("rol");
    const storedUsername = localStorage.getItem("username"); // LEEMOS EL NOMBRE

    if (token) {
      setIsAuth(true);
      // Si hay un rol guardado, lo usamos. Si no, por defecto USER.
      setRol(storedRol || "USER");
      setUsername(storedUsername || ""); // GUARDAMOS EL NOMBRE EN EL ESTADO
    } else {
      setIsAuth(false);
      setRol("USER");
      setUsername("");
    }
  }, []);

  // 2. Actualizamos el nombre al hacer login
  const handleLoginSuccess = (user, userRol) => {
    setIsAuth(true);
    setRol(userRol); // Usamos el rol real que nos pasó el Login
    setUsername(user); // ACTUALIZAMOS EL ESTADO
  };

  // 3. Limpiamos el nombre al salir
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol"); // Limpiamos también el rol
    setIsAuth(false);
    setRol("USER");
    setUsername(""); // LIMPIAMOS EL ESTADO
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* PASAMOS 'username' AL NAVBAR */}
        <Navbar
          isAuth={isAuth}
          role={rol}
          username={username}
          onLogout={handleLogout}
        />

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
            <Route path="/register" element={<Registro />} />

            {/* Protección de ruta Admin basada en el rol real */}
            <Route
              path="/admin"
              element={
                isAuth && rol === "ADMIN" ? <AdminPanel /> : <Navigate to="/" />
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

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// IMPORTA TUS ESTILOS CSS SI LOS TIENES
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductoDetalle from "./pages/ProductoDetalle";

// Páginas
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [rol, setRol] = useState("USER");
  const [username, setUsername] = useState("");

  // 1. Al cargar, leemos datos
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const storedRol = localStorage.getItem("rol");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsAuth(true);
      setRol(storedRol || "USER");
      setUsername(storedUsername || "");
    } else {
      setIsAuth(false);
      setRol("USER");
      setUsername("");
    }
  }, []);

  // 2. CORRECCIÓN IMPORTANTE: Orden de parámetros
  // Login.js envía (rol, username), así que debemos recibirlos en ese orden
  const handleLogin = (userRol, user) => {
    setIsAuth(true);
    setRol(userRol);
    setUsername(user);
  };

  // 3. Limpiamos al salir
  const handleLogout = () => {
    localStorage.clear(); // Limpia todo el storage de una vez
    setIsAuth(false);
    setRol("USER");
    setUsername("");
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
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
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />

            {/* CORRECCIÓN CRÍTICA: La prop debe llamarse 'onLogin' */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* USAMOS EL COMPONENTE ProtectedRoute QUE CREAMOS */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  isAllowed={isAuth && rol === "ADMIN"}
                  redirectTo="/"
                >
                  <AdminPanel />
                </ProtectedRoute>
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

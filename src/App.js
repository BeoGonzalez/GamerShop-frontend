import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Componentes Globales
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas Públicas
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import ProductoDetalle from "./pages/ProductoDetalle";

// Páginas Privadas
import AdminPanel from "./pages/AdminPanel";
import MisCompras from "./pages/MisCompras";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [rol, setRol] = useState("USER");
  const [username, setUsername] = useState("");

  // --- NUEVO ESTADO: CARGANDO ---
  // Esto evitará que te expulse antes de tiempo
  const [loading, setLoading] = useState(true);

  // 1. CARGA INICIAL
  useEffect(() => {
    // Leemos los datos del almacenamiento
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

    // ¡IMPORTANTE! Decimos que ya terminamos de cargar
    setLoading(false);
  }, []);

  // 2. LOGIN
  const handleLogin = (userData) => {
    setIsAuth(true);
    setRol(userData.rol);
    setUsername(userData.username);
  };

  // 3. LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    setRol("USER");
    setUsername("");
    window.location.href = "/";
  };

  // --- PANTALLA DE CARGA ---
  // Si todavía estamos leyendo el localStorage, mostramos esto
  // en lugar de renderizar las rutas y que te expulse.
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
          <p className="mt-3 text-muted fw-bold">Cargando GamerShop...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          isAuth={isAuth}
          role={rol} // Pasamos el rol al navbar
          username={username}
          onLogout={handleLogout}
        />

        <main className="flex-grow-1" style={{ paddingTop: "80px" }}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />

            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Rutas Privadas: Usuario */}
            <Route
              path="/mis-compras"
              element={
                isAuth ? <MisCompras /> : <Login onLogin={handleLogin} />
              }
            />

            {/* Rutas Privadas: Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  // Ahora isAuth y rol ya tienen el valor correcto porque loading terminó
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

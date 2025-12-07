import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tema from "./Tema";

function Navbar({ isAuth, role, username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm bg-body-tertiary">
      {/* Estilos para la animación del texto. 
          Lo definimos aquí para mantener todo en un solo archivo, 
          pero idealmente iría en tu CSS global.
      */}
      <style>
        {`
          @keyframes shine {
            to {
              background-position: 200% center;
            }
          }
          .gamer-text {
            background: linear-gradient(to right, #00d2ff 20%, #3a7bd5 40%, #ff00ff 60%, #00d2ff 80%);
            background-size: 200% auto;
            color: #000;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 3s linear infinite;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
        `}
      </style>

      <div className="container">
        {/* 1. LOGO CON EFECTO GRADIENTE ANIMADO */}
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
          to="/"
          onClick={closeMenu}
        >
          <span style={{ fontSize: "1.5rem" }}>🎮</span>

          {/* APLICAMOS LA CLASE ANIMADA AQUÍ */}
          <span className="gamer-text">GamerShop</span>
        </Link>

        {/* 2. BOTÓN HAMBURGUESA */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ border: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 3. CONTENIDO DEL MENÚ */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          {/* Enlaces Izquierda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categoria" onClick={closeMenu}>
                Categorías
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto" onClick={closeMenu}>
                Contacto
              </Link>
            </li>

            {isAuth && (
              <li className="nav-item">
                <Link
                  className="nav-link text-info fw-bold"
                  to="/carrito"
                  onClick={closeMenu}
                >
                  🛒 Carrito
                </Link>
              </li>
            )}

            {/* Link Admin */}
            {isAuth && role === "ADMIN" && (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="nav-link btn btn-outline-warning btn-sm text-warning px-3 border-warning rounded-pill fw-bold"
                  style={{ width: "fit-content" }}
                >
                  AdminPanel
                </Link>
              </li>
            )}
          </ul>

          {/* Botones Derecha */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
            {/* BOTÓN DE TEMA */}
            <div className="align-self-start align-self-lg-center">
              <Tema />
            </div>

            {!isAuth ? (
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn btn-primary fw-bold px-4 rounded-pill"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <>
                {/* Texto de Bienvenida */}
                <div className="text-end lh-1">
                  <small
                    className="d-block text-secondary text-uppercase fw-bold"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {role === "ADMIN" ? "Administrador" : "Cliente"}
                  </small>
                  <span className="fw-bold text-capitalize">
                    Hola, {username || "Jugador"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

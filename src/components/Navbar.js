import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuth, role, onLogout }) {
  // Estado para controlar el colapso del menú en móviles
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        {/* 1. LOGO */}
        <Link
          className="navbar-brand fw-bold fs-4 text-white d-flex align-items-center gap-2"
          to="/"
          onClick={closeMenu}
        >
          <span>🎮</span> <span style={{ color: "#a855f7" }}>GamerShop</span>
        </Link>

        {/* 2. BOTÓN HAMBURGUESA (Toggler) */}
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

        {/* 3. CONTENIDO DEL MENÚ (Collapsible) */}
        {/* Agregamos la clase 'show' condicionalmente para abrir/cerrar sin necesitar jQuery */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          {/* Enlaces a la Izquierda */}
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
                  className="nav-link text-info"
                  to="/carrito"
                  onClick={closeMenu}
                >
                  🛒 Carrito
                </Link>
              </li>
            )}

            {/* Link Admin (Solo si es ADMIN) */}
            {isAuth && role === "ADMIN" && (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="nav-link btn btn-outline-warning btn-sm text-warning px-3 border-warning rounded-pill fw-bold"
                  style={{ width: "fit-content" }}
                >
                  ⚙️ AdminPanel
                </Link>
              </li>
            )}
          </ul>

          {/* Botones Derecha (Login / Logout) */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
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
                <div className="text-white text-lg-end lh-1">
                  <small
                    className="d-block text-secondary text-uppercase fw-bold"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {role === "ADMIN" ? "Administrador" : "Cliente"}
                  </small>
                  <span className="fw-bold">Hola, Jugador</span>
                </div>

                {/* Botón Salir */}
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

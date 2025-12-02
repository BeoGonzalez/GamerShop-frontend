import React from "react";
import { Link } from "react-router-dom";

function Navbar({ isAuth, role, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 border-bottom border-secondary">
      <div className="container-fluid">
        <Link className="navbar-brand text-info fw-bold" to="/">
          GamerShop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categoria">
                Categorías
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                Contacto
              </Link>
            </li>

            {/* Solo mostramos "Tienda" si está logueado (opcional) */}
            {isAuth && (
              <li className="nav-item">
                <Link className="nav-link" to="/carrito">
                  Carrito
                </Link>
              </li>
            )}

            {/* ENLACE EXCLUSIVO ADMIN */}
            {isAuth && role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/admin">
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex">
            {!isAuth ? (
              <Link className="btn btn-outline-info" to="/login">
                Iniciar Sesión
              </Link>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small d-none d-md-block">
                  {role === "ADMIN" ? "Comandante" : "Jugador"}
                </span>
                <button onClick={onLogout} className="btn btn-sm btn-danger">
                  Salir 🚪
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

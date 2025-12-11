import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tema from "./Tema";
// 1. IMPORTAMOS LA IMAGEN DEL LOGO
import logo from "../assets/logo.png";

function Navbar({ isAuth, role, username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // --- LÓGICA DEL CONTADOR ---
  useEffect(() => {
    const actualizarContador = () => {
      if (!isAuth || !username) {
        setCantidadCarrito(0);
        return;
      }

      const storageKey = `carrito_${username}`;
      const carritoGuardado = localStorage.getItem(storageKey);

      if (carritoGuardado) {
        try {
          const items = JSON.parse(carritoGuardado);
          const total = items.reduce(
            (acc, item) => acc + (item.cantidad || 1),
            0
          );
          setCantidadCarrito(total);
        } catch (e) {
          console.error("Error leyendo carrito", e);
          setCantidadCarrito(0);
        }
      } else {
        setCantidadCarrito(0);
      }
    };

    actualizarContador();
    window.addEventListener("cartUpdated", actualizarContador);
    window.addEventListener("storage", actualizarContador);

    return () => {
      window.removeEventListener("cartUpdated", actualizarContador);
      window.removeEventListener("storage", actualizarContador);
    };
  }, [isAuth, username]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm bg-body-tertiary">
      <style>
        {`
          @keyframes shine {
            to { background-position: 200% center; }
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
          .badge-counter {
            transition: transform 0.2s;
          }
          .badge-counter:hover {
            transform: scale(1.2);
          }
          .nav-link i, .btn i {
            vertical-align: middle;
            margin-right: 5px;
            font-size: 1.2rem;
          }
        `}
      </style>

      <div className="container">
        {/* LOGO CON IMAGEN PNG */}
        <Link
          // CAMBIO AQUÍ: 'gap-1' reduce el espacio. Si quieres menos aún usa 'gap-0'.
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-1"
          to="/"
          onClick={closeMenu}
        >
          {/* 2. AQUÍ ESTÁ TU LOGO COMO IMAGEN */}
          <img
            src={logo}
            alt="GamerShop Logo"
            height="40" // Altura ajustada
            className="d-inline-block align-text-top"
            // OPCIONAL: Si aún se ve separado, puedes usar un margen negativo pequeño
            // style={{ marginRight: "-5px" }}
          />

          {/* Texto Animado */}
          <span className="gamer-text">GamerShop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          style={{ border: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                <i className="bx bx-home-alt-2"></i> Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/categoria" onClick={closeMenu}>
                <i className="bx bx-category"></i> Categorías
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/nosotros" onClick={closeMenu}>
                <i className="bx bx-group"></i> Nosotros
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contacto" onClick={closeMenu}>
                <i className="bx bx-envelope"></i> Contacto
              </Link>
            </li>

            {isAuth && (
              <li className="nav-item">
                <Link
                  className="nav-link text-info fw-bold position-relative"
                  to="/carrito"
                  onClick={closeMenu}
                >
                  <i className="bx bx-cart"></i> Carrito
                  {cantidadCarrito > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-counter">
                      {cantidadCarrito}
                      <span className="visually-hidden">
                        productos en carrito
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            )}

            {isAuth && role === "ADMIN" && (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="nav-link btn btn-outline-warning btn-sm text-warning px-3 border-warning rounded-pill fw-bold text-center"
                >
                  <i className="bx bxs-dashboard"></i> AdminPanel
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
            <div className="align-self-start align-self-lg-center">
              <Tema />
            </div>

            {!isAuth ? (
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn btn-primary fw-bold px-4 rounded-pill d-flex align-items-center justify-content-center"
              >
                <i className="bx bx-log-in-circle"></i> Iniciar Sesión
              </Link>
            ) : (
              <>
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
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center justify-content-center"
                >
                  <i className="bx bx-log-out-circle"></i> Salir
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

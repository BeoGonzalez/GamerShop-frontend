import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tema from "./Tema";

function Navbar({ isAuth, role, username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cantidadCarrito, setCantidadCarrito] = useState(0); // Estado para el contador
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
    // Función para leer y contar items del localStorage
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
          // Sumamos las cantidades individuales de cada producto
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

    // 1. Ejecutar al iniciar
    actualizarContador();

    // 2. Escuchar evento personalizado "cartUpdated" (para actualizaciones en vivo)
    window.addEventListener("cartUpdated", actualizarContador);
    // 3. Escuchar evento "storage" (por si tienes varias pestañas abiertas)
    window.addEventListener("storage", actualizarContador);

    // Limpieza al desmontar
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
          /* Animación para el contador */
          .badge-counter {
            transition: transform 0.2s;
          }
          .badge-counter:hover {
            transform: scale(1.2);
          }
        `}
      </style>

      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
          to="/"
          onClick={closeMenu}
        >
          <span style={{ fontSize: "1.5rem" }}>🎮</span>
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
                  className="nav-link text-info fw-bold position-relative"
                  to="/carrito"
                  onClick={closeMenu}
                >
                  🛒 Carrito
                  {/* --- AQUÍ ESTÁ EL CONTADOR --- */}
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
                  className="nav-link btn btn-outline-warning btn-sm text-warning px-3 border-warning rounded-pill fw-bold"
                  style={{ width: "fit-content" }}
                >
                  AdminPanel
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
                className="btn btn-primary fw-bold px-4 rounded-pill"
              >
                Iniciar Sesión
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

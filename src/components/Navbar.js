import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuth, role, onLogout }) {
  // Estado para controlar el menú en móviles
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login"); // Redirigir al login al salir
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 transition-colors no-underline"
            >
              GamerShop 🎮
            </Link>
          </div>

          {/* MENÚ DE ESCRITORIO (Oculto en móvil) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline"
              >
                Inicio
              </Link>
              <Link
                to="/categoria"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline"
              >
                Categorías
              </Link>
              <Link
                to="/contacto"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline"
              >
                Contacto
              </Link>

              {/* Solo usuarios logueados */}
              {isAuth && (
                <Link
                  to="/carrito"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline"
                >
                  🛒 Carrito
                </Link>
              )}

              {/* Solo ADMIN */}
              {isAuth && role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-yellow-500 hover:bg-yellow-900/20 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-bold transition-colors no-underline border border-yellow-500/30"
                >
                  Panel Admin
                </Link>
              )}
            </div>
          </div>

          {/* BOTONES DE LOGIN / LOGOUT (Escritorio) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!isAuth ? (
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors no-underline"
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">
                    Hola,{" "}
                    <span className="text-white font-bold">
                      {role === "ADMIN" ? "Comandante" : "Jugador"}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border-none"
                  >
                    Salir 🚪
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN HAMBURGUESA (Móvil) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú</span>
              {/* Icono de menú (hamburguesa / X) */}
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (Desplegable) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/categoria"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
              onClick={() => setIsOpen(false)}
            >
              Categorías
            </Link>
            <Link
              to="/contacto"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>

            {isAuth && (
              <Link
                to="/carrito"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
                onClick={() => setIsOpen(false)}
              >
                🛒 Carrito
              </Link>
            )}

            {isAuth && role === "ADMIN" && (
              <Link
                to="/admin"
                className="text-yellow-500 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-bold no-underline"
                onClick={() => setIsOpen(false)}
              >
                ⚠️ Panel Admin
              </Link>
            )}

            {/* Login / Logout en Móvil */}
            <div className="border-t border-gray-700 mt-4 pt-4">
              {!isAuth ? (
                <Link
                  to="/login"
                  className="text-indigo-400 block px-3 py-2 rounded-md text-base font-bold no-underline"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left text-red-400 block px-3 py-2 rounded-md text-base font-bold bg-transparent border-none"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

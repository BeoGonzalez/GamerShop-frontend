import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuth, role, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Efecto para detectar scroll y cambiar la opacidad del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 font-sans ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-2"
          : "bg-slate-900/50 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* LOGO CON GRADIENTE */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-extrabold tracking-tight no-underline group"
            >
              <span className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-12 inline-block">
                🎮
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                GamerShop
              </span>
            </Link>
          </div>

          {/* 🖥️ MENÚ DE ESCRITORIO */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/categoria">Categorías</NavLink>
              <NavLink to="/contacto">Contacto</NavLink>

              {isAuth && (
                <NavLink to="/carrito">
                  <span className="mr-1">🛒</span> Carrito
                </NavLink>
              )}

              {/* 🛡️ ENLACE ADMINPANEL */}
              {isAuth && role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="ml-4 px-4 py-1.5 rounded-full text-sm font-bold text-amber-400 border border-amber-500/30 bg-amber-900/10 hover:bg-amber-500/10 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300 no-underline flex items-center gap-2"
                >
                  <span>⚙️</span> AdminPanel
                </Link>
              )}
            </div>
          </div>

          {/* BOTONES LOGIN/LOGOUT (Escritorio) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center gap-4">
              {!isAuth ? (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-200 no-underline"
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="text-right hidden lg:block leading-tight">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                      {role === "ADMIN" ? "Comandante" : "Jugador"}
                    </p>
                    <p className="text-sm font-bold text-gray-100">
                      Bienvenido
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all duration-200"
                  >
                    Salir
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MENÚ MÓVIL (Desplegable) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100 border-t border-white/10 bg-slate-900/95"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
            Inicio
          </MobileNavLink>
          <MobileNavLink to="/categoria" onClick={() => setIsOpen(false)}>
            Categorías
          </MobileNavLink>
          <MobileNavLink to="/contacto" onClick={() => setIsOpen(false)}>
            Contacto
          </MobileNavLink>

          {isAuth && (
            <MobileNavLink to="/carrito" onClick={() => setIsOpen(false)}>
              🛒 Carrito
            </MobileNavLink>
          )}

          {isAuth && role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 mb-2 px-3 py-2 rounded-md text-base font-bold text-amber-400 bg-amber-900/20 border border-amber-500/30 no-underline"
            >
              ⚙️ AdminPanel
            </Link>
          )}

          <div className="border-t border-white/10 mt-4 pt-4">
            {!isAuth ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-3 rounded-lg text-base font-bold no-underline shadow-lg"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <span>Cerrar Sesión</span>
                <span>👋</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Sub-componente para enlaces de escritorio para mantener el código limpio
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 no-underline"
  >
    {children}
  </Link>
);

// Sub-componente para enlaces móviles
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 hover:text-white hover:bg-white/5 block px-3 py-2 rounded-md text-base font-medium transition-colors no-underline"
  >
    {children}
  </Link>
);

export default Navbar;

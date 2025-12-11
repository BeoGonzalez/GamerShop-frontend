import React, { useState, useEffect } from "react";

const Tema = () => {
  // Estado inicial
  const [tema, setTema] = useState(() => {
    const guardado = localStorage.getItem("tema");
    if (guardado) return guardado;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Estado para controlar la animación al hacer clic
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () => {
    // 1. Activar animación
    setIsAnimating(true);

    // 2. Cambiar tema
    setTema((prev) => (prev === "dark" ? "light" : "dark"));

    // 3. Desactivar animación después de que termine (500ms)
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin-effect {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(0.5); opacity: 0.5; }
            100% { transform: rotate(360deg) scale(1); opacity: 1; }
          }
          .animating-icon {
            animation: spin-effect 0.5s ease-in-out;
          }
        `}
      </style>

      <button
        onClick={toggleTema}
        className={`btn border-0 bg-transparent d-flex align-items-center justify-content-center p-0 ${
          isAnimating ? "animating-icon" : ""
        }`}
        style={{
          width: "38px",
          height: "38px",
          // Color: Magenta en modo Light (Sol), Cyan en modo Dark (Luna)
          color: tema === "light" ? "#ff00ff" : "#00aec3",
        }}
        title={`Cambiar a modo ${tema === "dark" ? "claro" : "oscuro"}`}
      >
        {tema === "light" ? (
          // Sol
          <i className="bx bx-sun fs-4"></i>
        ) : (
          // Luna
          <i className="bx bx-moon fs-4"></i>
        )}
      </button>
    </>
  );
};

export default Tema;

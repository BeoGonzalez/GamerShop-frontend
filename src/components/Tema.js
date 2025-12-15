import React, { useState, useEffect } from "react";

const Tema = () => {
  // 1. Estado inicial inteligente (Lee localStorage o Preferencia de Sistema)
  const [tema, setTema] = useState(() => {
    const guardado = localStorage.getItem("tema");
    if (guardado) return guardado;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [isAnimating, setIsAnimating] = useState(false);

  // 2. EFECTO: Aplica el tema al HTML (Global)
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);

    // Disparamos un evento personalizado para que AdminPanel se entere inmediatamente
    window.dispatchEvent(new Event("themeChange"));
  }, [tema]);

  const toggleTema = () => {
    setIsAnimating(true);
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
    setTimeout(() => setIsAnimating(false), 500);
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
          color: tema === "light" ? "#ff00ff" : "#00aec3", // Magenta (Sol) / Cyan (Luna)
          transition: "color 0.3s ease",
        }}
        title={`Cambiar a modo ${tema === "dark" ? "claro" : "oscuro"}`}
      >
        {tema === "light" ? (
          <i className="bx bx-sun fs-4"></i>
        ) : (
          <i className="bx bx-moon fs-4"></i>
        )}
      </button>
    </>
  );
};

export default Tema;

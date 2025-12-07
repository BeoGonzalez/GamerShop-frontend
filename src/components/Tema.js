import React, { useEffect, useState } from "react";

function Tema() {
  // Detectar el tema inicial
  const temaInicial = () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado) return temaGuardado;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [tema, setTema] = useState(temaInicial);

  // Aplicar tema al HTML
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTema}
      type="button"
      className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center justify-content-center"
      title={`Cambiar a modo ${tema === "dark" ? "claro" : "oscuro"}`}
      style={{
        width: "40px",
        height: "40px",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: "1.2rem",
          transition: "transform 0.5s ease",
          transform: tema === "dark" ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        {tema === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

export default Tema;

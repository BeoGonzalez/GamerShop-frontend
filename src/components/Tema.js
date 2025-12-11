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
      className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center justify-content-center shadow-sm"
      title={`Cambiar a modo ${tema === "dark" ? "claro" : "oscuro"}`}
      style={{
        width: "40px",
        height: "40px",
        border: "1px solid var(--bs-border-color)",
        backgroundColor: "var(--bs-body-bg)",
        padding: 0, // CRUCIAL: Elimina el relleno interno para un centrado perfecto
      }}
    >
      <span
        style={{
          display: "flex", // Usamos flex para centrar el icono dentro del span
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem", // Tamaño ajustado (aprox 24px) para que se vea nítido
          transition: "transform 0.5s ease",
          transform: tema === "dark" ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        {tema === "dark" ? (
          <i className="bx bx-moon" style={{ color: "cyan" }}></i>
        ) : (
          <i className="bx bx-sun" style={{ color: "magenta" }}></i>
        )}
      </span>
    </button>
  );
}

export default Tema;

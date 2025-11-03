import React, { useEffect, useState } from "react";

function Tema() {
  // Detectar el tema inicial (sistema o guardado)
  const temaInicial = () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado) return temaGuardado;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [tema, setTema] = useState(temaInicial);

  // Aplicar tema al HTML y guardar preferencia
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  // Escuchar cambios del sistema (opcional)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("tema")) {
        setTema(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Cambiar tema manualmente
  const ventana = () => {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={ventana}
      className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill"
      style={{
        transition: "all 0.4s ease",
        borderWidth: "2px",
        fontWeight: "500",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: tema === "dark" ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.4s ease",
        }}
      >
        {tema === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

export default Tema;

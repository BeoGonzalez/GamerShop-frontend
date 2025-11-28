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

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    // Cambiar tema manualmente
    const ventana = (e) => {
        e.stopPropagation();
        setTema((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            onClick={ventana}
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill"
            aria-label={`Cambiar a tema ${tema === "dark" ? "claro" : "oscuro"}`}
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
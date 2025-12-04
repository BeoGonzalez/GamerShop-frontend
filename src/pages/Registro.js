import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  // -------------------------------------------------------------------
  // ⚠️ IMPORTANTE: PEGA AQUÍ LA URL DE TU BACKEND EN RENDER ⚠️
  // -------------------------------------------------------------------
  const API_URL = "https://gamershop-backend.onrender.com/auth";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación de seguridad
    if (API_URL.includes("https://gamershop-backend.onrender.com/auth")) {
      setError("Error: Falta configurar la URL del backend.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Éxito: Mostrar alerta y enviar al login
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        navigate("/login");
      } else {
        // Error: El usuario ya existe o datos inválidos
        const errorText = await response.text();
        setError(
          errorText || "Error al registrar. El usuario quizás ya existe."
        );
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        <h2 className="text-center mb-8 text-3xl font-semibold text-gray-100">
          Crear Cuenta
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Input Usuario */}
          <div className="flex flex-col text-left">
            <label className="mb-2 text-gray-300 font-medium text-sm">
              Elige un Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500"
              placeholder="Usuario nuevo"
            />
          </div>

          {/* Input Contraseña */}
          <div className="flex flex-col text-left">
            <label className="mb-2 text-gray-300 font-medium text-sm">
              Elige una Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500"
              placeholder="********"
            />
          </div>

          {/* Botón Registrarse (Verde) */}
          <button
            type="submit"
            disabled={loading}
            className={`
                            p-3.5 rounded-lg border-none font-bold text-white text-base mt-2 transition-colors cursor-pointer
                            ${
                              loading
                                ? "bg-emerald-900 text-gray-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }
                        `}
          >
            {loading ? "Creando cuenta..." : "REGISTRARSE"}
          </button>

          {/* Caja de Error */}
          {error && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center justify-center gap-2 animate-pulse">
              <span className="text-lg">⚠️</span>
              <p className="text-red-300 text-sm font-bold m-0">{error}</p>
            </div>
          )}
        </form>

        {/* Footer / Links */}
        <div className="mt-6 text-center border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm mb-1">¿Ya tienes cuenta?</p>
          <Link
            to="/login"
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors no-underline"
          >
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

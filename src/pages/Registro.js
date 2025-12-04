import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  // -------------------------------------------------------------------
  // ⚠️ URL DEL BACKEND
  // -------------------------------------------------------------------
  const API_URL = "https://gamershop-backend.onrender.com/auth";

  // Estados para el formulario
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Petición POST al endpoint "/registro"
      // CORRECCIÓN: Quitamos "const response =" porque no usamos la variable.
      // Axios lanzará un error automáticamente si el status no es 200/201.
      await axios.post(`${API_URL}/registro`, formData);

      // 2. Éxito
      setSuccess("¡Usuario registrado exitosamente! Redirigiendo...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      // 3. Manejo de Errores
      if (err.response) {
        if (err.response.status === 409 || err.response.status === 500) {
          setError("Error: Es posible que el usuario ya exista.");
        } else if (err.response.status === 400) {
          setError("Datos inválidos. Revisa la información.");
        } else {
          setError(
            `Error al registrar: ${err.response.status} - ${
              err.response.data || ""
            }`
          );
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Intenta más tarde.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
        <h2 className="text-center mb-6 text-3xl font-semibold text-gray-100">
          Crear Cuenta
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Input Usuario */}
          <div className="flex flex-col text-left">
            <label className="mb-1 text-gray-300 font-medium text-sm">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
              placeholder="Elige un usuario"
            />
          </div>

          {/* Input Contraseña */}
          <div className="flex flex-col text-left">
            <label className="mb-1 text-gray-300 font-medium text-sm">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
              placeholder="********"
            />
          </div>

          {/* Botón Registrar */}
          <button
            type="submit"
            disabled={loading}
            className={`
                p-3.5 rounded-lg border-none font-bold text-white text-base mt-2 transition-colors cursor-pointer
                ${
                  loading
                    ? "bg-indigo-900 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
            `}
          >
            {loading ? "Registrando..." : "REGISTRARSE"}
          </button>

          {/* Mensajes de Feedback */}
          {error && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-red-300 text-sm font-bold m-0">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-2 p-3 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center justify-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-green-300 text-sm font-bold m-0">{success}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm mb-1">¿Ya tienes cuenta?</p>
          <Link
            to="/login"
            className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors no-underline"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;

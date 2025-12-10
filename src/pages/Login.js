import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Definimos la URL Base del Backend aquí mismo para asegurar la conexión directa
const API_BASE_URL = "https://gamershop-backend-1.onrender.com";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Petición Directa con Axios
      // Concatenamos la URL base con el endpoint específico
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });

      console.log("Respuesta del login:", response.data);

      // 2. Validación y Extracción de Datos
      const data = response.data;

      // Adaptar según lo que devuelve tu backend.
      // Prioridad: 1. data.token (JSON), 2. data (String plano)
      const token = data.token || (typeof data === "string" ? data : null);

      // Si el rol no viene en el JSON, asignamos "USER" por defecto
      const rol = data.rol || "USER";

      if (!token) {
        throw new Error("No se recibió un token válido del servidor.");
      }

      // 3. Guardar en LocalStorage (Persistencia)
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);

      // 4. Actualizar estado global en App.js
      if (onLoginSuccess) {
        onLoginSuccess(username, rol);
      }

      // 5. Redirigir al Home
      navigate("/");
    } catch (err) {
      console.error("Error en login:", err);

      // Manejo de errores detallado
      if (err.response) {
        // El servidor respondió con un código de error (4xx, 5xx)
        if (err.response.status === 401 || err.response.status === 403) {
          setError("Usuario o contraseña incorrectos.");
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else if (err.request) {
        // No hubo respuesta (Servidor caído, dormido o problema de red/CORS)
        setError(
          "No se pudo conectar con el servidor. Verifica tu internet o espera un momento si Render está despertando."
        );
      } else {
        // Error al configurar la petición
        setError("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor con estilos de Bootstrap adaptables (bg-body-tertiary se adapta al tema)
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-body-tertiary">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tu usuario"
                autoComplete="username"
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-bold">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                autoComplete="current-password"
              />
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary fw-bold py-2"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verificando...
                  </>
                ) : (
                  "ENTRAR"
                )}
              </button>
            </div>

            {error && (
              <div
                className="alert alert-danger mt-3 d-flex align-items-center p-2 small"
                role="alert"
              >
                <span className="fs-5 me-2">⚠️</span>
                <div>{error}</div>
              </div>
            )}
          </form>

          <div className="mt-4 text-center border-top pt-3">
            <p className="text-muted small mb-1">¿No tienes cuenta?</p>
            <Link
              to="/register"
              className="text-decoration-none fw-bold text-primary"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

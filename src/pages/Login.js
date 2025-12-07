import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Recibimos la prop 'onLoginSuccess' desde App.js
const Login = ({ onLoginSuccess }) => {
  const API_URL = "https://gamershop-backend-1.onrender.com/auth";

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
      // 1. Petición al Backend
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
      });

      // 2. Desempaquetar el JSON (Token + Rol)
      const { token, rol } = response.data;

      // 3. Guardar TODO en localStorage
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);

      // 4. Avisar a App.js
      if (onLoginSuccess) {
        onLoginSuccess(username, rol);
      }

      // 5. Redirigir al Home
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Credenciales incorrectas.");
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Intenta de nuevo.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // CAMBIO 1: Usamos 'bg-body-tertiary' en lugar de 'bg-dark'.
    // Esto será gris claro en modo Light y gris oscuro en modo Dark.
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-body-tertiary">
      {/* CAMBIO 2: Quitamos 'text-white' y estilos inline de color. 
          La clase 'card' de Bootstrap 5.3 ya maneja el cambio de color automáticamente. */}
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          // Eliminamos el backgroundColor fijo para que Bootstrap decida
        }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label fw-bold">Usuario</label>
              {/* CAMBIO 3: Quitamos 'bg-secondary text-white border-0'. 
                  Usamos solo 'form-control', que se adapta al tema. */}
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tu usuario"
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
                className="alert alert-danger mt-3 d-flex align-items-center p-2"
                role="alert"
              >
                <span className="fs-5 me-2">⚠️</span>
                <div className="small fw-bold">{error}</div>
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

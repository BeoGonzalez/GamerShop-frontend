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

      console.log("RESPUESTA DEL BACKEND:", response.data);

      // 2. CORRECCIÓN: Desempaquetar el JSON (Token + Rol)
      // El backend devuelve: { "token": "...", "rol": "ADMIN", "username": "..." }
      const { token, rol } = response.data;

      // 3. Guardar TODO en localStorage
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol); // <--- Guardamos el rol real

      // 4. ¡IMPORTANTE! Avisar a App.js con el rol incluido
      if (onLoginSuccess) {
        onLoginSuccess(username, rol); // <--- Pasamos el rol para que el Navbar se actualice
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
      <div
        className="card p-4 shadow-lg text-white"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#212529",
          border: "1px solid #495057",
        }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label text-light">Usuario</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tu usuario"
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label text-light">Contraseña</label>
              <input
                type="password"
                className="form-control bg-secondary text-white border-0"
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

          <div className="mt-4 text-center border-top border-secondary pt-3">
            <p className="text-muted small mb-1">¿No tienes cuenta?</p>
            {/* CORRECCIÓN: El link debe ser /register para coincidir con App.js */}
            <Link
              to="/register"
              className="text-decoration-none fw-bold text-info"
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

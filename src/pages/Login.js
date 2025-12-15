import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Petición al Backend
      const response = await axios.post(
        "https://gamershop-backend-1.onrender.com/auth/login",
        formData
      );

      if (response.status === 200) {
        const data = response.data;

        console.log("✅ Login exitoso. Rol:", data.rol);

        // =======================================================
        // 🔑 PARTE CRÍTICA: GUARDAR CON EL NOMBRE CORRECTO
        // =======================================================
        // Antes quizás decia "token", ahora DEBE decir "jwt_token"
        // para que coincida con ProductsManager.js y los demás.
        localStorage.setItem("jwt_token", data.token);

        localStorage.setItem("rol", data.rol);
        localStorage.setItem("username", data.username);

        // Actualizamos el estado de App.js
        if (onLogin) {
          onLogin(data);
        }

        // Redirección inteligente según el Rol
        if (data.rol === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/"); // O a /mis-compras
        }
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (err.response && err.response.status === 401) {
        setError("❌ Usuario o contraseña incorrectos.");
      } else {
        setError("❌ Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <i
            className="bx bxs-user-circle text-primary"
            style={{ fontSize: "4rem" }}
          ></i>
          <h3 className="fw-bold mt-2">Bienvenido</h3>
          <p className="text-muted small">Ingresa a tu cuenta GamerShop</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center p-2 small animate__animated animate__shakeX">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold small">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bx bx-user"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                name="username"
                placeholder="Ej: admin1"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bx bx-lock-alt"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 rounded-pill mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Ingresando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="small text-muted mb-0">¿No tienes cuenta?</p>
          <Link
            to="/register"
            className="text-primary fw-bold text-decoration-none"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

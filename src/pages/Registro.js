import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  const API_URL = "https://gamershop-backend-1.onrender.com/auth";

  // Estados para el formulario (Datos que se envían al backend)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rol: "USER",
  });

  // Estado para la confirmación (Solo validación local, no se envía)
  const [confirmPassword, setConfirmPassword] = useState("");

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

    // --- 1. VALIDACIÓN DE CONTRASEÑAS ---
    if (formData.password !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden. Por favor verifícalas.");
      setLoading(false); // Detenemos la carga
      return; // 🛑 DETENEMOS LA EJECUCIÓN AQUÍ (No se envía nada al backend)
    }

    try {
      // Si pasan la validación, enviamos los datos
      await axios.post(`${API_URL}/registro`, formData);

      setSuccess("¡Cuenta creada exitosamente! Redirigiendo...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409 || err.response.status === 500) {
          setError("Error: El usuario ya existe.");
        } else if (err.response.status === 400) {
          setError("Datos inválidos.");
        } else {
          setError(`Error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor.");
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
          <h2 className="text-center mb-4 fw-bold">Crear Cuenta</h2>

          <form onSubmit={handleRegister}>
            {/* Input Usuario */}
            <div className="mb-3 text-start">
              <label className="form-label text-light">Usuario</label>
              <input
                type="text"
                name="username"
                className="form-control bg-secondary text-white border-0"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Elige un usuario"
              />
            </div>

            {/* Input Contraseña */}
            <div className="mb-3 text-start">
              <label className="form-label text-light">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control bg-secondary text-white border-0"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="********"
                minLength={4} // Opcional: Validación HTML básica
              />
            </div>

            {/* --- NUEVO: INPUT CONFIRMAR CONTRASEÑA --- */}
            <div className="mb-3 text-start">
              <label className="form-label text-light">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control bg-secondary text-white border-0 ${
                  confirmPassword && formData.password !== confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
              />
              {/* Feedback visual inmediato (opcional) */}
              {confirmPassword && formData.password !== confirmPassword && (
                <div className="invalid-feedback text-warning">
                  Las contraseñas no coinciden
                </div>
              )}
            </div>

            {/* Selector de Rol */}
            <div className="mb-4 text-start">
              <label className="form-label text-light">Tipo de Cuenta</label>
              <select
                name="rol"
                className="form-select bg-secondary text-white border-0"
                value={formData.rol}
                onChange={handleChange}
              >
                <option value="USER">Jugador (Usuario Normal)</option>
                <option value="ADMIN">Comandante (Administrador)</option>
              </select>
              <div className="form-text text-muted">
                * Selecciona "Comandante" para acceder al Panel Admin.
              </div>
            </div>

            {/* Botón Registrar */}
            <div className="d-grid gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary fw-bold py-2"
              >
                {loading ? "Creando..." : "REGISTRARSE"}
              </button>
            </div>

            {/* Mensajes */}
            {error && (
              <div
                className="alert alert-danger mt-3 d-flex align-items-center p-2"
                role="alert"
              >
                <span className="fs-5 me-2">⚠️</span>
                <div className="small fw-bold">{error}</div>
              </div>
            )}

            {success && (
              <div
                className="alert alert-success mt-3 d-flex align-items-center p-2"
                role="alert"
              >
                <span className="fs-5 me-2">✅</span>
                <div className="small fw-bold">{success}</div>
              </div>
            )}
          </form>

          <div className="mt-4 text-center border-top border-secondary pt-3">
            <p className="text-muted small mb-1">¿Ya tienes cuenta?</p>
            <Link
              to="/login"
              className="text-decoration-none fw-bold text-info"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;

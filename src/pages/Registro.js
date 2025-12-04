import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  // -------------------------------------------------------------------
  // ⚠️ URL DEL BACKEND
  // -------------------------------------------------------------------
  const API_URL = "https://gamershop-backend-1.onrender.com/auth";

  // Estados para el formulario
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para capturar lo que el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función al enviar el formulario
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Petición POST al endpoint "/registro"
      await axios.post(`${API_URL}/registro`, formData);

      // 2. Éxito
      setSuccess("¡Cuenta creada exitosamente! Redirigiendo...");

      // Esperamos 1.5 segundos y enviamos al usuario al Login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      // 3. Manejo de Errores
      if (err.response) {
        // Conflicto (Usuario ya existe) o Error Interno
        if (err.response.status === 409 || err.response.status === 500) {
          setError("Error: El nombre de usuario ya está en uso.");
        } else if (err.response.status === 400) {
          setError("Datos inválidos. Intenta con otra contraseña.");
        } else {
          setError(`Error al registrar: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Revisa tu internet.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal: Fondo oscuro y centrado perfecto
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
      {/* Tarjeta */}
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
            {/* Campo: Usuario */}
            <div className="mb-3 text-start">
              <label className="form-label text-light">Usuario</label>
              <input
                type="text"
                name="username"
                className="form-control bg-secondary text-white border-0"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Elige un nombre de usuario"
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="mb-4 text-start">
              <label className="form-label text-light">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control bg-secondary text-white border-0"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="********"
              />
            </div>

            {/* Botón de Registro */}
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
                    Creando cuenta...
                  </>
                ) : (
                  "REGISTRARSE"
                )}
              </button>
            </div>

            {/* Mensajes de Feedback */}
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

          {/* Pie de la tarjeta */}
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

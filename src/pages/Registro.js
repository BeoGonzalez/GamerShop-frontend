import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://gamershop-backend-1.onrender.com";

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // CONEXIÓN AL NUEVO AUTHCONTROLLER
      const url = `${API_URL}/auth/register`;

      console.log("Enviando a:", url);
      await axios.post(url, formData);

      // Si pasa, éxito
      alert("✅ ¡Cuenta creada con éxito! Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      console.error("Error registro:", err);
      // Ahora leemos el JSON { "message": "..." } que envía Java
      const msg =
        err.response?.data?.message || "Error al conectar con el servidor.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 animate__animated animate__fadeIn">
      <div
        className="card border-0 shadow-lg rounded-4 p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Crear Cuenta</h2>
          <p className="text-muted">Únete a la comunidad GamerShop</p>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Usuario</label>
            <input
              name="username"
              className="form-control"
              placeholder="Usuario123"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/login" className="text-decoration-none">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;

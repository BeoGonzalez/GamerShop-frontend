import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registro() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://gamershop-backend-1.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        alert("✅ ¡Cuenta creada! Ahora inicia sesión con tu correo.");
        navigate("/login");
      } else {
        const msg = await response.text();
        setError("Error al registrar: " + msg);
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center py-4">
          <i className="bx bx-user-plus" style={{ fontSize: "3rem" }}></i>
          <h2 className="fw-bold mt-2">Crear Cuenta</h2>
          <p className="mb-0 opacity-75">Únete a GamerShop</p>
        </div>

        <div className="card-body p-4 bg-body-tertiary">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2">
              <i className="bx bx-error-circle fs-4"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* USERNAME (Sin icono) */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control rounded-3" // Eliminado ps-5
                id="floatingUser"
                name="username"
                placeholder=""
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingUser">Nombre de Usuario (Nick)</label>{" "}
              {/* Eliminado ps-4 */}
            </div>

            {/* EMAIL (Sin icono) */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-3" // Eliminado ps-5
                id="floatingEmail"
                name="email"
                placeholder=""
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingEmail">Correo Electrónico</label>{" "}
              {/* Eliminado ps-4 */}
            </div>

            {/* PASSWORD (Sin icono) */}
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control rounded-3" // Eliminado ps-5
                id="floatingPass"
                name="password"
                placeholder=""
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPass">Contraseña</label>{" "}
              {/* Eliminado ps-4 */}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale"
            >
              REGISTRARSE <i className="bx bx-right-arrow-alt ms-1"></i>
            </button>
          </form>
        </div>

        <div className="card-footer text-center py-3 bg-body border-0">
          <small className="text-muted">¿Ya tienes cuenta? </small>
          <Link to="/login" className="text-decoration-none fw-bold">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;

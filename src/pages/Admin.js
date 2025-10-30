import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está logueado, redirige a home
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Usuario administrador (puedes cambiar esto)
    if (email === "admin@gamershop.cl" && password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
      alert("✅ Bienvenido Administrador");
      navigate("/admin");
      return;
    }

    // Usuario normal
    if (email && password) {
      localStorage.setItem("user", JSON.stringify({ role: "user", email }));
      alert("✅ Inicio de sesión exitoso");
      navigate("/");
    } else {
      setError("Por favor ingresa tus credenciales");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Iniciar Sesión
              </button>
            </form>

            <div className="mt-3 text-center">
              <small>
                Usuario admin: <b>admin@gamershop.cl</b> / <b>admin123</b>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

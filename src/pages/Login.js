import React, { useState } from "react";
import "../Carrito.css";

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false); // Alternar entre Login y Registro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("USER"); // Rol por defecto
  const [error, setError] = useState(null);

  const API_AUTH = "https://gamershop-backend-1.onrender.com/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isRegistering ? "/register" : "/login";
    // Si es registro enviamos el rol seleccionado, si es login solo user/pass
    const body = isRegistering
      ? { username, password, rol }
      : { username, password };

    try {
      const response = await fetch(API_AUTH + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error en credenciales o conexión");
      }

      if (isRegistering) {
        alert("✅ Cuenta creada. Por favor inicia sesión.");
        setIsRegistering(false); // Volver al login
      } else {
        const data = await response.json();
        // Login exitoso: Pasamos el token y el rol a App.js
        onLogin(data.token, data.rol);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="gamer-panel p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center gamer-title mb-4">
          {isRegistering ? "REGISTRO" : "ACCESO"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="gamer-label">Usuario</label>
            <input
              className="form-control gamer-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="gamer-label">Contraseña</label>
            <input
              className="form-control gamer-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Selector de Rol (Solo visible en Registro) */}
          {isRegistering && (
            <div className="mb-4">
              <label className="gamer-label">Tipo de Cuenta</label>
              <select
                className="form-control gamer-input text-white bg-dark"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="USER">Usuario Común</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          )}

          {error && <div className="alert alert-danger p-1">{error}</div>}

          <button className="btn btn-gamer-primary w-100" type="submit">
            {isRegistering ? "CREAR CUENTA" : "ENTRAR"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link text-info small"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Volver al Login"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Login;

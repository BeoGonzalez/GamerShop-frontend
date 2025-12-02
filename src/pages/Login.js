import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Carrito.css"; // Reutilizamos tus estilos cyberpunk

function Login({ onLogin }) {
  const navigate = useNavigate();

  // Estados del formulario
  const [isRegistering, setIsRegistering] = useState(false); // Alternar entre Login y Registro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("USER"); // Rol por defecto

  // Estados de UI
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL de tu Backend (Endpoints de AuthController)
  const API_AUTH = "https://gamershop-backend-1.onrender.com/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegistering ? "/register" : "/login";

    // Si es registro enviamos el rol, si es login solo user/pass
    const body = isRegistering
      ? { username, password, rol }
      : { username, password };

    try {
      const response = await fetch(API_AUTH + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Manejo de errores del servidor (ej: "Usuario ya existe" o "Credenciales incorrectas")
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error en la autenticación");
      }

      // Lógica de éxito
      if (isRegistering) {
        alert("✅ Cuenta creada con éxito. Ahora inicia sesión.");
        setIsRegistering(false); // Cambiar a vista de login automáticamente
        setPassword(""); // Limpiar contraseña por seguridad
      } else {
        // LOGIN EXITOSO
        const data = await response.json();

        // data debe contener: { token: "...", rol: "...", username: "..." }
        console.log("Login exitoso:", data);

        // Guardamos en LocalStorage por redundancia (aunque App.js también lo maneja)
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);

        // Notificamos a App.js para que actualice el estado y redirija
        if (onLogin) {
          onLogin(data.token, data.rol);
        }

        // Redirigir al home (o App.js lo hará por el cambio de estado)
        navigate("/");
      }
    } catch (err) {
      console.error("Error Auth:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="gamer-container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="gamer-panel p-4 p-md-5 fade-in-up"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="text-center gamer-title mb-4">
          {isRegistering ? (
            <>
              NUEVO <span className="highlight">JUGADOR</span>
            </>
          ) : (
            <>
              ACCESO <span className="highlight">SISTEMA</span>
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div className="mb-3">
            <label className="gamer-label">Nombre de Usuario</label>
            <input
              className="form-control gamer-input"
              type="text"
              placeholder="Ej: MasterChief117"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-4">
            <label className="gamer-label">Contraseña</label>
            <input
              className="form-control gamer-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Selector de Rol (Solo visible en Registro) */}
          {isRegistering && (
            <div className="mb-4 fade-in">
              <label className="gamer-label">Tipo de Cuenta</label>
              <select
                className="form-control gamer-input text-white bg-dark"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="alert alert-danger bg-transparent text-danger border-danger p-2 text-center mb-3">
              ❌ {error}
            </div>
          )}

          {/* Botón Submit */}
          <button
            className="btn btn-gamer-primary w-100 py-2 mb-3 fw-bold"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : isRegistering ? (
              "REGISTRARSE"
            ) : (
              "INICIAR SESIÓN"
            )}
          </button>
        </form>

        {/* Switch Login/Registro */}
        <div className="text-center mt-3 pt-3 border-top border-secondary">
          <p className="mb-2 text-muted small">
            {isRegistering
              ? "¿Ya tienes una cuenta?"
              : "¿No tienes cuenta aún?"}
          </p>
          <button
            className="btn btn-outline-info btn-sm w-100"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
              setUsername("");
              setPassword("");
            }}
          >
            {isRegistering ? "Volver al Login" : "Crear Cuenta Nueva"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

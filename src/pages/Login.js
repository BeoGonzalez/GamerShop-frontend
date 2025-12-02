import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Carrito.css"; // Estilos Gamer

function Login({ onLogin }) {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [isRegistering, setIsRegistering] = useState(false); // Switch Login/Registro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("USER"); // Por defecto USER

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL del Backend
  const API_AUTH = "https://gamershop-backend-1.onrender.com/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegistering ? "/register" : "/login";

    // Preparar el cuerpo de la petición
    // Si es login, no enviamos el rol. Si es registro, sí.
    const body = isRegistering
      ? { username, password, rol }
      : { username, password };

    try {
      console.log(`Enviando petición a: ${API_AUTH}${endpoint}`);

      const response = await fetch(API_AUTH + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // LEER LA RESPUESTA DE FORMA SEGURA
      // El backend devuelve texto plano para registro y JSON para login.
      // Leemos como texto primero para no romper el JSON.parse
      const dataText = await response.text();
      let data;
      try {
        data = JSON.parse(dataText); // Intentamos convertir a JSON (Login)
      } catch {
        data = dataText; // Si falla, es texto plano (Registro o Error simple)
      }

      if (!response.ok) {
        // Si hay error, lanzamos una excepción con el mensaje del servidor
        throw new Error(typeof data === 'string' ? data : (data.message || "Error en la solicitud"));
      }

      // --- MANEJO DE ÉXITO ---

      if (isRegistering) {
        // CASO 1: REGISTRO EXITOSO
        alert("✅ " + (typeof data === 'string' ? data : "Cuenta creada con éxito."));
        setIsRegistering(false); // Cambiar a la vista de Login
        setPassword(""); // Limpiar contraseña por seguridad
        setError(null);
      } else {
        // CASO 2: LOGIN EXITOSO
        console.log("Login OK:", data);

        // Guardamos en LocalStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("username", data.username);

        // Actualizamos el estado global en App.js (Navbar, Rutas protegidas)
        if (onLogin) {
          onLogin(data.token, data.rol);
        }

        // Redirigir al inicio
        navigate("/");
      }

    } catch (err) {
      console.error("Error Auth:", err);
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gamer-container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="gamer-panel p-4 p-md-5 fade-in-up" style={{ maxWidth: "450px", width: "100%" }}>

        <h2 className="text-center gamer-title mb-4">
          {isRegistering ? (
            <>NUEVO <span className="highlight">JUGADOR</span></>
          ) : (
            <>ACCESO <span className="highlight">SISTEMA</span></>
          )}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Input Usuario */}
          <div className="mb-3">
            <label className="gamer-label">Nombre de Usuario</label>
            <input
              className="form-control gamer-input"
              type="text"
              placeholder="Ej: MasterChief"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Input Contraseña */}
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
                <option value="USER">Jugador (Usuario Cliente)</option>
                <option value="ADMIN">Game Master (Administrador)</option>
              </select>
              <small className="text-muted mt-1 d-block" style={{ fontSize: "0.8em" }}>
                * Selecciona "Game Master" para gestionar el inventario.
              </small>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="alert alert-danger bg-transparent text-danger border-danger p-2 text-center mb-3 small">
              ❌ {error}
            </div>
          )}

          {/* Botón de Acción */}
          <button
            className="btn btn-gamer-primary w-100 py-2 fw-bold mb-3"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</span>
            ) : (
              isRegistering ? "CREAR CUENTA" : "INICIAR SESIÓN"
            )}
          </button>
        </form>

        {/* Switch Login/Registro */}
        <div className="text-center mt-3 pt-3 border-top border-secondary">
          <p className="mb-2 text-muted small">
            {isRegistering ? "¿Ya tienes cuenta?" : "¿Eres nuevo aquí?"}
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
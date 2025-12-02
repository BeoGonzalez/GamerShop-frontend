import React, { useState, useEffect } from "react";
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

  // Limpiar cualquier sesión residual al cargar el componente
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("username");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegistering ? "/register" : "/login";

    // Preparar el cuerpo de la petición
    const body = isRegistering
      ? { username, password, rol }
      : { username, password };

    try {
      console.log(`📡 Enviando petición a: ${API_AUTH}${endpoint}`);

      const response = await fetch(API_AUTH + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log(`📥 Respuesta recibida. Status: ${response.status}`);

      // LEER LA RESPUESTA DE FORMA SEGURA
      const dataText = await response.text();
      let data;
      try {
        data = JSON.parse(dataText);
      } catch {
        data = dataText;
      }

      if (!response.ok) {
        // --- MEJORA DE DIAGNÓSTICO DE ERRORES ---
        let serverMessage = typeof data === 'string' && data.length > 0 ? data : (data?.message || "");

        if (!serverMessage) {
          if (response.status === 401) serverMessage = "Credenciales incorrectas (401).";
          else if (response.status === 403) serverMessage = "Acceso prohibido (403). Revisa la configuración de seguridad del Backend.";
          else if (response.status === 404) serverMessage = "Servicio no encontrado (404).";
          else if (response.status === 500) serverMessage = "Error interno del servidor (500).";
          else serverMessage = `Error desconocido (${response.status})`;
        }

        throw new Error(serverMessage);
      }

      // --- MANEJO DE ÉXITO ---

      if (isRegistering) {
        alert("✅ " + (typeof data === 'string' ? data : "Cuenta creada con éxito."));
        setIsRegistering(false); // Ir al Login
        setPassword("");
        setError(null);
      } else {
        console.log("✅ Login Exitoso:", data);

        // Guardamos sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("username", data.username);

        if (onLogin) {
          onLogin(data.token, data.rol);
        }

        navigate("/");
      }

    } catch (err) {
      console.error("❌ Error Auth:", err);

      if (err.message === "Failed to fetch") {
        setError("⚠️ No se pudo conectar al servidor. Puede que se esté 'despertando' (espera 1 min) o sea un bloqueo CORS.");
      } else {
        setError(err.message);
      }
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
              placeholder="Ej: PlayerOne"
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

          {/* Selector de Rol (Solo en Registro) */}
          {isRegistering && (
            <div className="mb-4 fade-in">
              <label className="gamer-label">Tipo de Cuenta</label>
              <select
                className="form-control gamer-input text-white bg-dark"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="USER">Jugador (Cliente)</option>
                <option value="ADMIN">Game Master (Admin)</option>
              </select>
              <small className="text-muted mt-1 d-block" style={{ fontSize: "0.8em" }}>
                * Elige "Game Master" para poder agregar/borrar productos.
              </small>
            </div>
          )}

          {/* Mensaje de Error (Ahora más detallado) */}
          {error && (
            <div className="alert alert-danger bg-transparent text-danger border-danger p-2 text-center mb-3 small">
              {error}
            </div>
          )}

          {/* Botón de Acción */}
          <button
            className="btn btn-gamer-primary w-100 py-2 fw-bold mb-3"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Conectando...</span>
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
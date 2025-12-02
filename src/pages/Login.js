import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Carrito.css"; // Asegúrate de que los estilos existan

function Login({ onLogin }) {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [isRegistering, setIsRegistering] = useState(false); // Alternar Login/Registro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("USER"); // Por defecto USER

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL del Backend
  const API_AUTH = "https://gamershop-backend-1.onrender.com/auth";

  // Limpiar cualquier sesión residual al entrar a esta pantalla
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("username");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación básica antes de enviar
    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    const endpoint = isRegistering ? "/register" : "/login";

    // Preparar el cuerpo de la petición
    // Si es Login, NO enviamos el rol. Si es Registro, SÍ.
    const body = isRegistering
      ? { username, password, rol }
      : { username, password };

    try {
      console.log(`📡 Enviando a: ${API_AUTH}${endpoint}`);

      const response = await fetch(API_AUTH + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // 1. LEER LA RESPUESTA (Puede ser JSON o Texto Plano)
      const dataText = await response.text();
      let data;
      try {
        data = JSON.parse(dataText); // Intentamos convertir a objeto JS
      } catch {
        data = dataText; // Si falla, es un mensaje de texto simple (ej: "Usuario creado")
      }

      // 2. MANEJO DE ERRORES HTTP
      if (!response.ok) {
        // Intentamos obtener el mensaje de error del backend
        let errorMessage = typeof data === 'string' && data.length > 0 ? data : (data?.message || "");

        // Si el backend no dio mensaje, deducimos por el código de estado
        if (!errorMessage) {
          if (response.status === 401) errorMessage = "Credenciales incorrectas.";
          else if (response.status === 403) errorMessage = "Acceso prohibido (403). Revisa si tu usuario existe o el backend está bloqueando.";
          else if (response.status === 404) errorMessage = "Servidor no encontrado (404).";
          else if (response.status === 500) errorMessage = "Error interno del servidor (500).";
          else errorMessage = `Error desconocido (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      // 3. MANEJO DE ÉXITO
      if (isRegistering) {
        // --- REGISTRO EXITOSO ---
        alert("✅ Cuenta creada con éxito. Ahora inicia sesión.");
        setIsRegistering(false); // Cambiar visualmente a Login
        setPassword(""); // Limpiar contraseña
        setError(null);
      } else {
        // --- LOGIN EXITOSO ---
        console.log("✅ Login OK:", data);

        // Guardamos en LocalStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("username", data.username);

        // Notificar a App.js
        if (onLogin) {
          onLogin(data.token, data.rol);
        }

        // Redirección inteligente
        navigate("/");
      }

    } catch (err) {
      console.error("❌ Error Auth:", err);

      if (err.message === "Failed to fetch") {
        setError("⚠️ No hay conexión con el servidor. Puede que Render se esté 'despertando' (espera 1 min) o sea un bloqueo CORS.");
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

          {/* Selector de Rol (Solo visible en Registro) */}
          {isRegistering && (
            <div className="mb-4 p-3 border border-secondary rounded bg-dark fade-in">
              <label className="gamer-label mb-2 text-warning">Selecciona tu Rol</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="USER">👤 Cliente (Comprar)</option>
                <option value="ADMIN">🛠️ Game Master (Administrar)</option>
              </select>
              <small className="text-muted mt-2 d-block" style={{ fontSize: "0.8em" }}>
                * Selecciona "Game Master" si necesitas agregar o borrar productos.
              </small>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="alert alert-danger bg-transparent text-danger border-danger p-2 text-center mb-3">
              <small><strong>Error:</strong> {error}</small>
            </div>
          )}

          {/* Botón de Acción */}
          <button
            className="btn btn-gamer-primary w-100 py-2 fw-bold mb-3 shadow-sm"
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
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿Eres nuevo en GamerShop?"}
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
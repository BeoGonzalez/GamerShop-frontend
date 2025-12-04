import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Estado para saber si estamos en Login o Registro
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Estados del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // URL del Backend (CÁMBIALO POR TU URL DE RENDER CUANDO SUBAS A PRODUCCIÓN)
  // Ejemplo producción: const API_URL = "https://tu-backend-en-render.com/auth";
  const API_URL = "https://gamershop-backend-1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLoginMode ? `${API_URL}/login` : `${API_URL}/register`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (isLoginMode) {
        if (response.ok) {
          const token = await response.text();
          localStorage.setItem("jwt_token", token);
          // Redirigir al dashboard o home
          navigate("/dashboard");
        } else {
          setError("Credenciales incorrectas");
        }
      } else {
        // Modo Registro
        if (response.ok) {
          alert("Registro exitoso! Ahora inicia sesión.");
          setIsLoginMode(true); // Cambiar a pestaña de login
          setPassword(""); // Limpiar contraseña por seguridad
        } else {
          setError("El usuario ya existe o hubo un error.");
        }
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Encabezado con pestañas */}
        <div style={styles.header}>
          <button
            style={isLoginMode ? styles.activeTab : styles.inactiveTab}
            onClick={() => {
              setIsLoginMode(true);
              setError("");
            }}
          >
            Iniciar Sesión
          </button>
          <button
            style={!isLoginMode ? styles.activeTab : styles.inactiveTab}
            onClick={() => {
              setIsLoginMode(false);
              setError("");
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <div style={styles.formContainer}>
          <h2 style={styles.title}>
            {isLoginMode ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                placeholder="Ej: gamer123"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="******"
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
            >
              {loading
                ? "Procesando..."
                : isLoginMode
                ? "Entrar"
                : "Registrarse"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Estilos CSS-in-JS para que no tengas que crear un archivo CSS aparte
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    borderBottom: "1px solid #eee",
  },
  activeTab: {
    flex: 1,
    padding: "15px",
    border: "none",
    backgroundColor: "white",
    color: "#6366f1", // Color Indigo
    fontWeight: "bold",
    cursor: "pointer",
    borderBottom: "2px solid #6366f1",
  },
  inactiveTab: {
    flex: 1,
    padding: "15px",
    border: "none",
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    cursor: "pointer",
  },
  formContainer: {
    padding: "30px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1f2937",
    fontSize: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    marginBottom: "5px",
    fontSize: "0.9rem",
    color: "#4b5563",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#a5a6f6",
    color: "white",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.9rem",
    textAlign: "center",
    margin: "0",
  },
};

export default Login;

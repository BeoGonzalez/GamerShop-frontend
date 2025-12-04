import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registro = () => {
  // URL del Backend (Ajustar según entorno)
  // const API_URL = "http://localhost:8080/auth";
  const API_URL = "https://tu-backend-en-render.onrender.com/auth";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        navigate("/login"); // Redirige al login tras registrarse
      } else {
        const errorText = await response.text();
        setError(
          errorText || "Error al registrar. El usuario quizás ya existe."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Elige un Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Usuario nuevo"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Elige una Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="********"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Registrando..." : "REGISTRARSE"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.text}>¿Ya tienes cuenta?</p>
          <Link to="/login" style={styles.link}>
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

// Reutilizamos los mismos estilos para consistencia visual
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111827",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #374151",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#f3f4f6",
    fontSize: "1.8rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", textAlign: "left" },
  label: { marginBottom: "8px", color: "#d1d5db" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #4b5563",
    backgroundColor: "#374151",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981", // Verde para registro (diferente al login)
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonDisabled: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#059669",
    color: "#d1fae5",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  error: { color: "#fca5a5", textAlign: "center", margin: "0" },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    borderTop: "1px solid #374151",
    paddingTop: "20px",
  },
  text: { color: "#9ca3af", marginBottom: "5px" },
  link: { color: "#818cf8", textDecoration: "none", fontWeight: "bold" },
};

export default Registro;

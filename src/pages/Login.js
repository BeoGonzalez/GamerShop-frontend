import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  // URL del Backend (Ajustar según entorno)
  // const API_URL = "http://localhost:8080/auth";
  const API_URL = "https://gamershop-backend-1.onrender.com";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("username", username);
        console.log("Login exitoso");
        navigate("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos.");
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
        <h2 style={styles.title}>Iniciar Sesión</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Tu usuario"
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
              placeholder="********"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Cargando..." : "ENTRAR"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.text}>¿No tienes cuenta?</p>
          <Link to="/register" style={styles.link}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

// Estilos compartidos (puedes moverlos a un archivo CSS aparte si prefieres)
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
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonDisabled: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4338ca",
    color: "#9ca3af",
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

export default Login;

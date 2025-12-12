import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("🔍 TEST-LOG [1]: Submit iniciado. Email:", email);

    try {
      // 1. Petición al Backend
      const response = await fetch(
        "https://gamershop-backend-1.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      console.log("🔍 TEST-LOG [2]: Fetch respondió. Status:", response.status);

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error de servidor");
      }

      const data = await response.json();
      console.log("🔍 TEST-LOG [3]: Data recibida del JSON:", data);

      // 2. Guardar en LocalStorage
      localStorage.setItem("jwt_token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("rol", data.rol);

      // 3. Verificar datos críticos antes de llamar a onLogin
      // Aquí suele estar el error: ¿data.rol existe? ¿data.username existe?
      console.log("🔍 TEST-LOG [4]: Validando datos...", {
        rol: data.rol,
        username: data.username,
        propOnLogin: typeof onLogin,
      });

      // 4. Actualizar estado global
      if (typeof onLogin === "function") {
        console.log("🔍 TEST-LOG [5]: Llamando a onLogin()...");
        onLogin(data.rol, data.username);
      } else {
        console.error(
          "❌ TEST-LOG: ¡onLogin no es una función! Revisa App.js o el Test"
        );
      }

      // 5. Redirección
      setTimeout(() => {
        if (data.rol === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 100);
    } catch (err) {
      console.error("❌ TEST-LOG: ERROR CAPTURADO EN CATCH:", err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center py-4">
          <i className="bx bx-user-circle" style={{ fontSize: "4rem" }}></i>
          <h2 className="fw-bold mt-2">Bienvenido</h2>
          <p className="mb-0 opacity-75">Inicia sesión para continuar</p>
        </div>

        <div className="card-body p-4 bg-body-tertiary">
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2"
              role="alert"
            >
              <i className="bx bx-error-circle fs-4"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-3"
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingInput">Correo Electrónico</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control rounded-3"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Contraseña</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale"
            >
              INGRESAR <i className="bx bx-log-in-circle ms-1"></i>
            </button>
          </form>
        </div>

        <div className="card-footer text-center py-3 bg-body border-0">
          <small className="text-muted">¿No tienes cuenta? </small>
          <Link to="/register" className="text-decoration-none fw-bold">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

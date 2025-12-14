import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileView = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de tu backend
  const API_URL = "https://gamershop-backend-1.onrender.com";

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("jwt_token");

      // Si no hay token, forzamos logout
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Hacemos la petición al endpoint /usuarios/perfil
        const response = await axios.get(`${API_URL}/usuarios/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Si todo sale bien, guardamos los datos
        setPerfil(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setError("No se pudo cargar la información del usuario.");
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  // 1. ESTADO DE CARGA
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <span className="text-muted">Cargando tu perfil...</span>
      </div>
    );
  }

  // 2. ESTADO DE ERROR (Para que no se quede cargando infinito)
  if (error) {
    return (
      <div
        className="alert alert-danger d-flex align-items-center rounded-4 shadow-sm"
        role="alert"
      >
        <i className="bx bx-error-circle fs-4 me-2"></i>
        <div>
          <strong>Error:</strong> {error}
          <br />
          <small>Intenta cerrar sesión y volver a entrar.</small>
        </div>
      </div>
    );
  }

  // 3. ESTADO DE ÉXITO (Mostrar Perfil)
  return (
    <div
      className="container animate__animated animate__fadeIn"
      style={{ maxWidth: "600px" }}
    >
      <div className="card border-0 shadow-lg bg-body-tertiary rounded-4 overflow-hidden">
        {/* Encabezado decorativo */}
        <div
          className="bg-primary bg-gradient p-4 text-center text-white"
          style={{ minHeight: "120px" }}
        >
          <h4 className="fw-bold m-0">Mi Perfil</h4>
        </div>

        <div
          className="card-body text-center p-4"
          style={{ marginTop: "-60px" }}
        >
          {/* Avatar con inicial */}
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow p-1 mb-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "100px", height: "100px", fontSize: "3rem" }}
            >
              {perfil?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <h3 className="fw-bold text-body mb-1">{perfil?.username}</h3>
          <p className="text-muted mb-4">{perfil?.email}</p>

          {/* Badges de información */}
          <div className="d-flex justify-content-center gap-2 mb-5">
            <span
              className={`badge px-3 py-2 rounded-pill ${
                perfil?.rol === "ADMIN" ? "bg-danger" : "bg-primary"
              }`}
            >
              <i className="bx bx-shield-quarter"></i> {perfil?.rol}
            </span>
            <span className="badge bg-success px-3 py-2 rounded-pill">
              <i className="bx bx-check-circle"></i> Cuenta Activa
            </span>
          </div>

          {/* Datos Técnicos (ID) */}
          <div className="bg-body-secondary p-3 rounded-3 mb-4 text-start">
            <small className="text-muted d-block text-uppercase fw-bold mb-2">
              Detalles de la cuenta
            </small>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2 border-secondary-subtle">
              <span className="text-body">ID de Usuario:</span>
              <span className="fw-bold font-monospace">#{perfil?.id}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-body">Última conexión:</span>
              <span className="fw-bold">Ahora</span>
            </div>
          </div>

          {/* Botón Cerrar Sesión */}
          <button
            className="btn btn-outline-danger w-100 rounded-pill fw-bold py-2 hover-shadow"
            onClick={() => {
              if (window.confirm("¿Seguro que quieres salir?")) {
                localStorage.removeItem("jwt_token");
                localStorage.removeItem("username");
                localStorage.removeItem("rol");
                window.location.href = "/login";
              }
            }}
          >
            <i className="bx bx-log-out me-2"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

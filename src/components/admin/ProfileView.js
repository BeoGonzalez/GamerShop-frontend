import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileView = () => {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      axios
        .get("https://gamershop-backend-1.onrender.com/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPerfil(res.data))
        .catch(console.error);
    }
  }, []);

  if (!perfil)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div
      className="card border-0 shadow-lg bg-body-tertiary rounded-4 animate__animated animate__fadeIn"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <div className="card-body p-5 text-center">
        <div className="mb-4 d-inline-block p-1 rounded-circle border border-primary border-3">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}
          >
            {perfil.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <h3 className="fw-bold text-body">{perfil.username}</h3>
        <p className="text-muted mb-4">{perfil.email}</p>
        <div className="d-flex justify-content-center gap-2 mb-4">
          <span className="badge bg-primary px-3 py-2 rounded-pill">
            Rol: {perfil.rol}
          </span>
          <span className="badge bg-success px-3 py-2 rounded-pill">
            Estado: Activo
          </span>
        </div>
        <hr className="text-secondary opacity-25" />
        <button
          className="btn btn-outline-danger rounded-pill px-4"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          <i className="bx bx-log-out"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
export default ProfileView;

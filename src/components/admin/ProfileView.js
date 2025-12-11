import React from "react";

const ProfileView = () => {
  const username = localStorage.getItem("username");
  const rol = localStorage.getItem("rol");

  return (
    <div
      className="card border-0 shadow-lg rounded-4 animate__animated animate__fadeIn"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <div className="card-body text-center p-5">
        <div className="mb-4">
          <div className="bg-primary bg-opacity-10 d-inline-flex p-4 rounded-circle text-primary">
            <i className="bx bx-user" style={{ fontSize: "4rem" }}></i>
          </div>
        </div>
        <h2 className="fw-bold text-capitalize">{username}</h2>
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-4">
          {rol}
        </span>

        <div className="list-group list-group-flush text-start">
          <div className="list-group-item py-3">
            <small className="text-muted d-block">Estado</small>
            <span className="fw-bold text-success">
              <i className="bx bxs-circle x-small"></i> Activo
            </span>
          </div>
          <div className="list-group-item py-3">
            <small className="text-muted d-block">Permisos</small>
            <span>
              Acceso total al sistema, gestión de inventario y usuarios.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

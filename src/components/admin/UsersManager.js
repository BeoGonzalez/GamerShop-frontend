import React from "react";

const UsersManager = ({ usuarios, onDeleteUser }) => {
  return (
    <div className="card border-0 shadow-lg bg-body-tertiary rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-transparent border-0 pt-4 ps-4">
        <h5 className="fw-bold text-primary">
          <i className="bx bx-user-circle"></i> Gestión de Usuarios
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-body-secondary">
              <tr>
                <th className="ps-4">ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="ps-4">#{u.id}</td>
                  <td className="fw-bold text-body">{u.username}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        u.rol === "ADMIN" ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => onDeleteUser(u.id)}
                    >
                      <i className="bx bx-trash fs-5"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default UsersManager;

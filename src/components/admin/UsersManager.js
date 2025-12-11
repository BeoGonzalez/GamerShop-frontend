import React from "react";

const UsersManager = ({ usuarios, onDeleteUser }) => {
  return (
    <div className="card border-0 shadow-lg rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-transparent border-0 pt-4 ps-4">
        <h4 className="fw-bold">
          <i className="bx bx-user-circle text-primary"></i> Gestión de Usuarios
        </h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario / Email</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>
                    <small className="text-muted">#{u.id}</small>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2 text-primary">
                        <i className="bx bx-user"></i>
                      </div>
                      <div>
                        {/* Intenta mostrar username, si no existe muestra email */}
                        <span className="fw-bold d-block">
                          {u.username || u.nombre}
                        </span>
                        <small className="text-muted">{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* Detecta rol o role */}
                    <span
                      className={`badge rounded-pill ${
                        u.rol === "ADMIN" || u.role === "ADMIN"
                          ? "bg-danger bg-opacity-75"
                          : "bg-info bg-opacity-75 text-dark"
                      }`}
                    >
                      {(u.rol || u.role || "USER").toUpperCase()}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2 hover-scale"
                      onClick={() => onDeleteUser(u.id)}
                      title="Eliminar usuario"
                    >
                      <i className="bx bx-trash fs-5"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bx bx-ghost fs-1 mb-2"></i>
                    <p>No se encontraron usuarios en la base de datos.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;

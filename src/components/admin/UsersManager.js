import React from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

const UsersManager = ({ usuarios = [], onRefresh }) => {
  // Función para eliminar usuario (requiere token de admin)
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
      )
    )
      return;

    const token = localStorage.getItem("jwt_token");
    if (!token) return alert("No tienes permisos.");

    try {
      await axios.delete(`${API_URL}/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Usuario eliminado");
      onRefresh(); // Recargamos la lista
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar usuario. Puede que tenga órdenes asociadas.");
    }
  };

  return (
    <div className="animate__animated animate__fadeIn">
      {/* CAMBIO 1: El contenedor principal usa 'bg-body-tertiary'.
         - Modo Claro: Gris muy suave.
         - Modo Oscuro: Gris oscuro (se diferencia del fondo negro).
      */}
      <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
          {/* CAMBIO 2: 'text-body-emphasis' para el título (Negro o Blanco brillante) */}
          <h5 className="fw-bold text-body-emphasis mb-0">
            Gestión de Usuarios
          </h5>
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle">
            {usuarios.length} Registrados
          </span>
        </div>

        <div className="card-body px-0 pt-2">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              {/* CAMBIO 3: Header de la tabla adaptable */}
              <thead className="bg-body-secondary">
                <tr>
                  <th
                    className="ps-4 text-body-secondary"
                    style={{ width: "50px" }}
                  >
                    ID
                  </th>
                  <th className="text-body-secondary">Usuario</th>
                  <th className="text-body-secondary">Rol</th>
                  <th className="text-end pe-4 text-body-secondary">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((user) => (
                    // CAMBIO 4: Borde sutil que se ve bien en ambos modos
                    <tr
                      key={user.id}
                      className="border-bottom border-secondary-subtle"
                    >
                      <td className="ps-4 fw-bold text-body-tertiary">
                        #{user.id}
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          {/* Avatar con iniciales */}
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="d-flex flex-column">
                            {/* CAMBIO 5: Nombre de usuario adaptable */}
                            <span className="fw-bold text-body">
                              {user.username}
                            </span>
                            <small
                              className="text-body-secondary"
                              style={{ fontSize: "0.75rem" }}
                            >
                              ID Base de Datos: {user.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {/* Badges semánticos (subtle) funcionan perfecto en dark mode */}
                        <span
                          className={`badge rounded-pill ${
                            user.rol === "ADMIN"
                              ? "bg-danger-subtle text-danger border border-danger-subtle"
                              : "bg-success-subtle text-success border border-success-subtle"
                          }`}
                        >
                          {user.rol}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        {user.rol !== "ADMIN" && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-sm btn-outline-danger border-0"
                            title="Eliminar Usuario"
                          >
                            <i className="bx bx-trash fs-5"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="text-body-secondary opacity-50 mb-2">
                        <i
                          className="bx bx-user-x"
                          style={{ fontSize: "3rem" }}
                        ></i>
                      </div>
                      <p className="text-body-secondary">
                        No se encontraron usuarios.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;

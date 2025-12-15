import React, { useState } from "react";
import axios from "axios";

// 🌍 URL de tu Backend
const API_URL = "https://gamershop-backend-1.onrender.com";

const UsersManager = ({ usuarios = [], onRefresh }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [userId, setUserId] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Se envía solo al crear o si se quiere cambiar
    rol: "USER",
  });

  // ==============================================================
  // 1. OBTENER TOKEN (Vital para @PreAuthorize)
  // ==============================================================
  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cargar datos en el formulario para editar
  const cargarEdicion = (u) => {
    setModoEdicion(true);
    setUserId(u.id);
    setFormData({
      username: u.username,
      email: u.email,
      password: "", // IMPORTANTE: Dejamos la contraseña vacía por seguridad
      rol: u.rol || "USER",
    });
  };

  const cancelar = () => {
    setModoEdicion(false);
    setUserId(null);
    setFormData({ username: "", email: "", password: "", rol: "USER" });
  };

  // ==============================================================
  // 2. ENVIAR DATOS (POST /usuarios/registro o PUT /usuarios/{id})
  // ==============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getHeaders();

    if (!headers) {
      alert("⚠️ No tienes sesión activa. Por favor, loguéate de nuevo.");
      return;
    }

    // URL y Método dinámicos
    // Si editamos -> PUT /usuarios/{id}
    // Si creamos -> POST /usuarios/registro
    const url = modoEdicion
      ? `${API_URL}/usuarios/${userId}`
      : `${API_URL}/usuarios/registro`;

    const method = modoEdicion ? "put" : "post";

    // Preparamos los datos (Payload)
    const payload = { ...formData };

    // LÓGICA DE CONTRASEÑA:
    // Si estamos editando y el campo password está vacío, LO BORRAMOS del objeto.
    // Así el Backend (UsuarioController.java) sabrá que no debe cambiar la contraseña actual.
    if (modoEdicion && !payload.password) {
      delete payload.password;
    }

    console.log("📤 Enviando usuario:", payload);

    try {
      await axios({ method, url, data: payload, headers });

      alert(modoEdicion ? "✅ Usuario actualizado" : "✅ Usuario registrado");

      onRefresh(); // Recargar la lista en el AdminPanel
      cancelar(); // Limpiar formulario
    } catch (error) {
      console.error("Error UsersManager:", error);
      const msg = error.response?.data?.message || error.message;

      if (error.response?.status === 403) {
        alert("⛔ ACCESO DENEGADO: No tienes permisos de ADMIN.");
      } else {
        alert(`❌ Error: ${msg}`);
      }
    }
  };

  // ==============================================================
  // 3. ELIMINAR USUARIO (DELETE /usuarios/{id})
  // ==============================================================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    const headers = getHeaders();
    if (!headers) return alert("⚠️ No tienes sesión activa.");

    try {
      await axios.delete(`${API_URL}/usuarios/${id}`, { headers });
      alert("🗑️ Usuario eliminado");
      onRefresh(); // Actualizar tabla
    } catch (error) {
      console.error(error);
      alert(
        "❌ Error al eliminar usuario (puede que tenga órdenes asociadas)."
      );
    }
  };

  return (
    <div className="row g-4 animate__animated animate__fadeIn">
      {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold text-primary mb-0">
              {modoEdicion ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
            </h5>
          </div>

          <div className="card-body px-4 pb-4">
            <form onSubmit={handleSubmit}>
              {/* Usuario */}
              <div className="mb-3">
                <label className="form-label small text-muted">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bx bx-user"></i>
                  </span>
                  <input
                    name="username"
                    className="form-control border-start-0 ps-0"
                    placeholder="Ej: JuanPerez"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label small text-muted">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bx bx-envelope"></i>
                  </span>
                  <input
                    name="email"
                    type="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small text-muted">
                  {modoEdicion ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bx bx-lock-alt"></i>
                  </span>
                  <input
                    name="password"
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder={
                      modoEdicion ? "Dejar vacía para no cambiar" : "******"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    // Si es nuevo usuario, la pass es obligatoria. Si edita, no.
                    required={!modoEdicion}
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="mb-4">
                <label className="form-label small text-muted">Rol</label>
                <select
                  name="rol"
                  className="form-select"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="USER">USER (Cliente)</option>
                  <option value="ADMIN">ADMIN (Administrador)</option>
                </select>
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn w-100 py-2 fw-bold btn-${
                    modoEdicion ? "warning" : "success"
                  }`}
                >
                  <i
                    className={`bx ${
                      modoEdicion ? "bx-save" : "bx-plus-circle"
                    } me-2`}
                  ></i>
                  {modoEdicion ? "Actualizar" : "Registrar"}
                </button>

                {modoEdicion && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelar}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: TABLA DE USUARIOS --- */}
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-primary mb-0">Usuarios Registrados</h5>
            <span className="badge bg-light text-dark border">
              {usuarios.length} Usuarios
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th className="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios && usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 fw-bold text-muted">#{u.id}</td>
                      <td className="fw-bold text-dark">{u.username}</td>
                      <td className="text-muted small">{u.email}</td>
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
                          className="btn btn-sm btn-outline-primary me-2 border-0"
                          onClick={() => cargarEdicion(u)}
                          title="Editar"
                        >
                          <i className="bx bx-edit fs-5"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          onClick={() => handleDelete(u.id)}
                          title="Eliminar"
                        >
                          <i className="bx bx-trash fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bx bx-user-x fs-1 mb-2"></i>
                      <p>No se encontraron usuarios.</p>
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

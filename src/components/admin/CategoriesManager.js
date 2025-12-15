import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

const CategoriesManager = ({ categorias = [], onRefresh }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [catId, setCatId] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  // --- CORRECCIÓN: Usar "jwt_token" ---
  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cargar datos para editar
  const cargarEdicion = (cat) => {
    setModoEdicion(true);
    setCatId(cat.id);
    setFormData({
      nombre: cat.nombre,
      descripcion: cat.descripcion || "",
    });
  };

  const cancelar = () => {
    setModoEdicion(false);
    setCatId(null);
    setFormData({ nombre: "", descripcion: "" });
  };

  // --- GUARDAR (POST) O ACTUALIZAR (PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getHeaders();

    if (!headers) {
      alert("⚠️ No tienes sesión activa.");
      return;
    }

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const url = modoEdicion
      ? `${API_URL}/categorias/${catId}`
      : `${API_URL}/categorias`;

    const method = modoEdicion ? "put" : "post";

    try {
      await axios({ method, url, data: formData, headers });

      alert(modoEdicion ? "✅ Categoría actualizada" : "✅ Categoría creada");

      onRefresh();
      cancelar();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message;
      alert(`❌ Error al guardar: ${msg}`);
    }
  };

  // --- ELIMINAR (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    // Obtenemos headers aquí también
    const headers = getHeaders();
    if (!headers) return alert("⚠️ No tienes sesión activa.");

    try {
      await axios.delete(`${API_URL}/categorias/${id}`, { headers });
      alert("🗑️ Categoría eliminada");
      onRefresh();
    } catch (error) {
      console.error("Error delete:", error);
      if (error.response && error.response.status === 500) {
        alert(
          "⚠️ No se puede eliminar: Esta categoría tiene productos asociados. Elimina o mueve los productos primero."
        );
      } else {
        alert("❌ Error al eliminar categoría");
      }
    }
  };

  return (
    <div className="row g-4 animate__animated animate__fadeIn">
      {/* FORMULARIO */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold text-primary mb-0">
              {modoEdicion ? "✏️ Editar Categoría" : "➕ Nueva Categoría"}
            </h5>
          </div>
          <div className="card-body px-4 pb-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted">Nombre</label>
                <input
                  name="nombre"
                  className="form-control"
                  placeholder="Ej: Consolas"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  rows="3"
                  placeholder="Descripción breve..."
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn w-100 py-2 fw-bold btn-${
                    modoEdicion ? "warning" : "primary"
                  }`}
                >
                  <i
                    className={`bx ${
                      modoEdicion ? "bx-save" : "bx-plus-circle"
                    } me-2`}
                  ></i>
                  {modoEdicion ? "Actualizar" : "Guardar"}
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

      {/* LISTA */}
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-primary mb-0">Listado</h5>
            <span className="badge bg-light text-dark border">
              {categorias.length} Categorías
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <tr key={cat.id}>
                      <td className="ps-4 fw-bold text-muted">#{cat.id}</td>
                      <td className="fw-bold text-primary">{cat.nombre}</td>
                      <td className="text-muted small">
                        {cat.descripcion || (
                          <em className="text-secondary opacity-50">
                            Sin descripción
                          </em>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 me-1"
                          onClick={() => cargarEdicion(cat)}
                          title="Editar"
                        >
                          <i className="bx bx-edit fs-5"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          onClick={() => handleDelete(cat.id)}
                          title="Eliminar"
                        >
                          <i className="bx bx-trash fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bx bx-category fs-1 mb-2"></i>
                      <p>No hay categorías registradas.</p>
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

export default CategoriesManager;

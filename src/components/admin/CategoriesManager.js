import React, { useState } from "react";

const CategoriesManager = ({ categorias, onAddCategory, onDeleteCategory }) => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAddCategory({ nombre });
    setNombre("");
  };

  return (
    <div className="row g-4 animate__animated animate__fadeIn">
      <div className="col-md-4">
        <div className="card border-0 shadow-lg bg-body-tertiary rounded-4">
          <div className="card-header bg-transparent border-0 pt-4 ps-4">
            <h5 className="fw-bold text-primary">
              <i className="bx bx-plus-circle"></i> Nueva Categoría
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-bold"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card border-0 shadow-lg bg-body-tertiary rounded-4">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-body-secondary">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Nombre</th>
                  <th className="text-end pe-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-4 text-muted">#{c.id}</td>
                    <td className="fw-bold text-body">{c.nombre}</td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => onDeleteCategory(c.id)}
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
    </div>
  );
};
export default CategoriesManager;

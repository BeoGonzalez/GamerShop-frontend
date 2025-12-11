import React, { useState } from "react";

const CategoriesManager = ({ categorias, onAddCategory, onDeleteCategory }) => {
  const [newCat, setNewCat] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory({ nombre: newCat });
      setNewCat("");
    }
  };

  return (
    <div className="row g-4 animate__animated animate__fadeIn">
      <div className="col-md-4">
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bx bx-plus-circle"></i> Nueva Categoría
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de categoría"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bx bx-list-ul"></i> Listado
            </h5>
            <ul className="list-group list-group-flush">
              {categorias.map((cat) => (
                <li
                  key={cat.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {cat.nombre}
                  <button
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => onDeleteCategory(cat.id)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManager;

import React, { useState } from "react";

// Recibimos 'categoriasDisponibles' desde el padre (AdminPanel)
function ProductoForm({ onGuardar, categoriasDisponibles = [] }) {
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imagen: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState(false); // Estado para alternar input manual

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!producto.nombre || !producto.precio || !producto.stock) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const productoAEnviar = {
      ...producto,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
    };

    onGuardar(productoAEnviar);
    setProducto({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
      imagen: "",
    });
    setNuevaCategoria(false); // Reseteamos el modo de nueva categoría
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label text-white small">
          Nombre del Producto
        </label>
        <input
          type="text"
          name="nombre"
          className="form-control bg-dark text-white border-secondary"
          value={producto.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label text-white small">Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control bg-dark text-white border-secondary"
            value={producto.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label text-white small">Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control bg-dark text-white border-secondary"
            value={producto.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      {/* SECCIÓN DE CATEGORÍA DINÁMICA */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label text-white small m-0">Categoría</label>
          <button
            type="button"
            className="btn btn-link btn-sm text-info p-0 text-decoration-none"
            onClick={() => {
              setNuevaCategoria(!nuevaCategoria);
              setProducto({ ...producto, categoria: "" }); // Limpiamos al cambiar
            }}
          >
            {nuevaCategoria ? "Seleccionar existente" : "+ Nueva Categoría"}
          </button>
        </div>

        {nuevaCategoria ? (
          <input
            type="text"
            name="categoria"
            className="form-control bg-dark text-white border-info"
            value={producto.categoria}
            onChange={handleChange}
            placeholder="Escribe la nueva categoría..."
            required
            autoFocus
          />
        ) : (
          <select
            name="categoria"
            className="form-select bg-dark text-white border-secondary"
            value={producto.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona...</option>
            {/* Mapeamos las categorías disponibles que vienen de la BD */}
            {categoriasDisponibles.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label text-white small">
          URL Imagen (Opcional)
        </label>
        <input
          type="text"
          name="imagen"
          className="form-control bg-dark text-white border-secondary"
          value={producto.imagen}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="btn btn-warning w-100 fw-bold">
        GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;

import React, { useState } from "react";

function ProductoForm({ onGuardar }) {
  // Estado inicial del formulario
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imagen: "", // Agrego imagen por si tu modelo la tiene, si no, puedes quitarla
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!producto.nombre || !producto.precio || !producto.stock) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    // Convertir tipos si es necesario (precio y stock a números)
    const productoAEnviar = {
      ...producto,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
    };

    // Llamamos a la función del padre (AdminPanel)
    onGuardar(productoAEnviar);

    // Limpiar formulario
    setProducto({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
      imagen: "",
    });
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

      <div className="mb-3">
        <label className="form-label text-white small">Categoría</label>
        <select
          name="categoria"
          className="form-select bg-dark text-white border-secondary"
          value={producto.categoria}
          onChange={handleChange}
        >
          <option value="">Selecciona...</option>
          <option value="Consolas">Consolas</option>
          <option value="Juegos">Juegos</option>
          <option value="Accesorios">Accesorios</option>
          <option value="PC">PC Gaming</option>
        </select>
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
        💾 GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;

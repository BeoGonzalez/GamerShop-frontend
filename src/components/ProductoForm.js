import React, { useState } from "react";

// Recibimos 'categoriasDisponibles' desde el padre (AdminPanel)
// Le asignamos un valor por defecto [] para evitar errores si es null/undefined
function ProductoForm({ onGuardar, categoriasDisponibles = [] }) {
  // Estado inicial del formulario
  const [producto, setProducto] = useState({
    nombre: "",
    categoriaId: "", // Guardamos el ID de la categoría
    precio: "",
    stock: "",
    imagen: "",
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
    if (
      !producto.nombre ||
      !producto.precio ||
      !producto.stock ||
      !producto.categoriaId
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Construir el objeto JSON para el backend
    const productoAEnviar = {
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      imagen: producto.imagen,
      // La clave es enviar un objeto 'categoria' con su 'id'
      categoria: {
        id: parseInt(producto.categoriaId),
      },
    };

    onGuardar(productoAEnviar);

    // Limpiar formulario
    setProducto({
      nombre: "",
      categoriaId: "",
      precio: "",
      stock: "",
      imagen: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* NOMBRE */}
      <div className="mb-3">
        <label className="form-label small fw-bold">Nombre del Producto</label>
        <input
          type="text"
          name="nombre"
          className="form-control"
          value={producto.nombre}
          onChange={handleChange}
          required
        />
      </div>

      {/* PRECIO Y STOCK */}
      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label small fw-bold">Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control"
            value={producto.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label small fw-bold">Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={producto.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      {/* --- SECCIÓN CATEGORÍA CORREGIDA --- */}
      <div className="mb-3">
        <label className="form-label small fw-bold">Categoría</label>

        <select
          name="categoriaId"
          className={`form-select ${!producto.categoriaId ? "text-muted" : ""}`}
          value={producto.categoriaId}
          onChange={handleChange}
          required
          disabled={categoriasDisponibles.length === 0} // Deshabilitar si no hay datos
        >
          <option value="">
            {categoriasDisponibles.length === 0
              ? "Cargando categorías..."
              : "Selecciona una categoría..."}
          </option>

          {/* Mapeo seguro: verificamos que 'categoriasDisponibles' sea un array */}
          {Array.isArray(categoriasDisponibles) &&
            categoriasDisponibles.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
        </select>

        {/* Mensaje de ayuda si la lista está vacía después de cargar */}
        {categoriasDisponibles.length === 0 && (
          <div className="form-text text-warning small mt-1">
            ⚠️ No se encontraron categorías. Crea algunas en la base de datos o
            espera a que carguen.
          </div>
        )}
      </div>

      {/* IMAGEN (OPCIONAL) */}
      <div className="mb-3">
        <label className="form-label small fw-bold">
          URL Imagen (Opcional)
        </label>
        <input
          type="text"
          name="imagen"
          className="form-control"
          value={producto.imagen}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      {/* BOTÓN GUARDAR */}
      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold"
        disabled={categoriasDisponibles.length === 0} // Evitar enviar sin categoría
      >
        GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;

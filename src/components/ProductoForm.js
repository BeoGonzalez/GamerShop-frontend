import React, { useState } from "react";

function ProductoForm({ onGuardar, categoriasDisponibles = [] }) {
  // Estado inicial
  const [producto, setProducto] = useState({
    nombre: "",
    categoriaId: "", // Guardamos el ID de la categoría seleccionada
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
    if (
      !producto.nombre ||
      !producto.precio ||
      !producto.stock ||
      !producto.categoriaId
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Construimos el objeto exacto que quiere Spring Boot (JPA)
    const productoAEnviar = {
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      imagen: producto.imagen,
      // La clave es enviar un objeto con el ID para la relación
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

      <div className="mb-3">
        <label className="form-label small fw-bold">Categoría</label>
        <select
          name="categoriaId"
          className="form-select"
          value={producto.categoriaId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría...</option>
          {/* Mapeamos las categorías reales (objetos) */}
          {categoriasDisponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {categoriasDisponibles.length === 0 && (
          <div className="form-text text-danger">
            No hay categorías cargadas. Crea algunas en la base de datos
            primero.
          </div>
        )}
      </div>

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

      <button type="submit" className="btn btn-primary w-100 fw-bold">
        GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;

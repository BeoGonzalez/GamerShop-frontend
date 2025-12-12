import React, { useState } from "react";

const ProductoForm = ({ onGuardar, categoriasDisponibles }) => {
  // --- ESTADOS DEL FORMULARIO ---
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState(""); // Nuevo: Descripción
  const [imagen, setImagen] = useState(""); // Existente: URL Imagen

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validamos campos críticos
    if (!nombre || !precio || !stock || !categoriaId) {
      alert(
        "Completa los campos obligatorios (Nombre, Precio, Stock, Categoría)"
      );
      return;
    }

    // Armamos el objeto con TODOS los campos
    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria: { id: parseInt(categoriaId) },
      descripcion: descripcion, // Se envía la descripción
      imagen: imagen, // Se envía la URL de la imagen
    };

    onGuardar(nuevoProducto);

    // Limpiar formulario tras guardar
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoriaId("");
    setDescripcion("");
    setImagen("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 1. NOMBRE */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          Nombre del Producto
        </label>
        <input
          type="text"
          className="form-control rounded-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      {/* 2. DESCRIPCIÓN (TEXTAREA) */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          Descripción
        </label>
        <textarea
          className="form-control rounded-3"
          rows="2"
          placeholder="Detalles (ej: Procesador i5, RGB...)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      {/* 3. IMAGEN (URL) - AQUI ESTÁ EL CAMPO QUE PEDISTE */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          URL de la Imagen
        </label>
        <div className="input-group">
          <span className="input-group-text bg-body-tertiary">
            <i className="bx bx-link"></i>
          </span>
          <input
            type="text"
            className="form-control rounded-end-3"
            placeholder="https://ejemplo.com/foto.jpg"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        {/* Previsualización pequeña si hay link */}
        {imagen && (
          <div className="mt-2">
            <img
              src={imagen}
              alt="Vista previa"
              className="rounded-3 border"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <small className="ms-2 text-muted">Vista previa</small>
          </div>
        )}
      </div>

      {/* 4. PRECIO Y STOCK (EN FILA) */}
      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label small fw-bold text-secondary">
            Precio
          </label>
          <input
            type="number"
            className="form-control rounded-3"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="col-6 mb-3">
          <label className="form-label small fw-bold text-secondary">
            Stock
          </label>
          <input
            type="number"
            className="form-control rounded-3"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      {/* 5. CATEGORÍA */}
      <div className="mb-4">
        <label className="form-label small fw-bold text-secondary">
          Categoría
        </label>
        <select
          className="form-select rounded-3"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecciona...</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* BOTÓN GUARDAR */}
      <button
        type="submit"
        className="btn btn-primary w-100 rounded-pill fw-bold hover-scale"
      >
        <i className="bx bx-save me-2"></i> Guardar Producto
      </button>
    </form>
  );
};

export default ProductoForm;

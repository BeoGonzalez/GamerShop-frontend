import React, { useState, useRef } from "react";

function ProductoForm({ onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const inputRef = useRef(null);

  const guardar = (e) => {
    if (e) e.preventDefault();
    if (!nombre.trim() || !categoria.trim() || !precio) {
      alert("⚠️ Faltan datos requeridos.");
      return;
    }
    const precioEntero = parseInt(precio);
    if (isNaN(precioEntero) || precioEntero <= 0) {
      alert("⚠️ Precio inválido.");
      return;
    }
    onGuardar({
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: precioEntero,
    });
    setNombre("");
    setCategoria("");
    setPrecio("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <form onSubmit={guardar}>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label gamer-label">
          Nombre del Producto
        </label>
        <input
          ref={inputRef}
          className="form-control gamer-input"
          placeholder="Ej: Teclado Mecánico RGB"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          type="text"
          id="nombre"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="categoria" className="form-label gamer-label">
          Categoría / Tipo
        </label>
        <input
          className="form-control gamer-input"
          placeholder="Ej: Periférico"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          type="text"
          id="categoria"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="precio" className="form-label gamer-label">
          Precio Unitario (USD)
        </label>
        <input
          className="form-control gamer-input"
          placeholder="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          type="number"
          min="1"
          id="precio"
          required
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-gamer-primary btn-lg" type="submit">
          GUARDAR EN SISTEMA 💾
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;

import React, { useState, useRef } from "react";

function ProductoForm({ onGuardar }) {
  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState(""); // NUEVO: Estado para Stock

  const inputRef = useRef(null);

  const guardar = (e) => {
    if (e) e.preventDefault();

    // 1. Validar que todos los campos tengan datos
    if (!nombre.trim() || !categoria.trim() || !precio || !stock) {
      alert("⚠️ Faltan datos requeridos (incluyendo stock).");
      return;
    }

    const precioEntero = parseInt(precio);
    const stockEntero = parseInt(stock); // Convertir stock a número

    // 2. Validaciones numéricas
    if (isNaN(precioEntero) || precioEntero <= 0) {
      alert("⚠️ Precio inválido. Debe ser mayor a 0.");
      return;
    }

    if (isNaN(stockEntero) || stockEntero < 0) {
      alert("⚠️ El stock no puede ser negativo.");
      return;
    }

    // 3. Enviar objeto al Padre (AdminPanel)
    onGuardar({
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: precioEntero,
      stock: stockEntero, // Enviamos el stock a la DB
    });

    // 4. Limpiar formulario
    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock(""); // Limpiar campo stock

    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <form onSubmit={guardar}>
      {/* Campo Nombre */}
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

      {/* Campo Categoría */}
      <div className="mb-3">
        <label htmlFor="categoria" className="form-label gamer-label">
          Categoría / Tipo
        </label>
        <input
          className="form-control gamer-input"
          placeholder="Ej: Mouse, Tarjeta Gráfica"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          type="text"
          id="categoria"
          required
        />
      </div>

      <div className="row">
        {/* Campo Precio */}
        <div className="col-md-6 mb-3">
          <label htmlFor="precio" className="form-label gamer-label">
            Precio ($)
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

        {/* NUEVO: Campo Stock */}
        <div className="col-md-6 mb-4">
          <label htmlFor="stock" className="form-label gamer-label">
            Stock Inicial
          </label>
          <input
            className="form-control gamer-input"
            placeholder="Cant."
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            min="0"
            id="stock"
            required
          />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="d-grid">
        <button className="btn btn-gamer-primary btn-lg" type="submit">
          Guardar Producto
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;

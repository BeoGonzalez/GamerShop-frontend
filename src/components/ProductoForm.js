import React, { useState } from "react";

function ProductoForm({ onGuardar, categoriasDisponibles = [] }) {
  const [producto, setProducto] = useState({
    nombre: "",
    categoriaId: "",
    precio: "",
    stock: "",
    imagen: "",
  });

  // Estado local para manejar errores de carga de imagen en el preview
  const [imagenInvalida, setImagenInvalida] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });

    // Si el usuario cambia la URL, reseteamos el error de imagen
    if (name === "imagen") {
      setImagenInvalida(false);
    }
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

    const productoAEnviar = {
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      imagen: producto.imagen,
      categoria: {
        id: parseInt(producto.categoriaId),
      },
    };

    onGuardar(productoAEnviar);

    setProducto({
      nombre: "",
      categoriaId: "",
      precio: "",
      stock: "",
      imagen: "",
    });
    setImagenInvalida(false);
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

      {/* CATEGORÍA */}
      <div className="mb-3">
        <label className="form-label small fw-bold">Categoría</label>
        <select
          name="categoriaId"
          className={`form-select ${!producto.categoriaId ? "text-muted" : ""}`}
          value={producto.categoriaId}
          onChange={handleChange}
          required
          disabled={categoriasDisponibles.length === 0}
        >
          <option value="">
            {categoriasDisponibles.length === 0
              ? "Cargando categorías..."
              : "Selecciona una categoría..."}
          </option>
          {Array.isArray(categoriasDisponibles) &&
            categoriasDisponibles.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
        </select>
      </div>

      {/* --- SECCIÓN DE IMAGEN MEJORADA --- */}
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
          placeholder="Ej: https://i.imgur.com/tu-imagen.jpg"
        />

        {/* VISTA PREVIA */}
        {producto.imagen && !imagenInvalida && (
          <div className="mt-3 text-center border rounded p-2 bg-light">
            <p className="small text-muted mb-1">Vista Previa:</p>
            <img
              src={producto.imagen}
              alt="Vista previa"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "150px", objectFit: "contain" }}
              onError={() => setImagenInvalida(true)}
            />
          </div>
        )}

        {imagenInvalida && producto.imagen && (
          <div className="mt-2 text-danger small d-flex align-items-center gap-1">
            {/* ICONO BOXICON EN VEZ DE EMOJI */}
            <i className="bx bx-error-circle fs-5"></i>
            <span>
              No se pudo cargar la imagen. Verifica que la URL sea directa
              (terminada en .jpg, .png, etc).
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold"
        disabled={categoriasDisponibles.length === 0}
      >
        GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;

import React from "react";

function ProductoList({ productos, onEliminar }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="alert alert-info bg-transparent text-info border-info text-center p-4">
        <h4 className="alert-heading">Inventario Vacío</h4>
        <p className="mb-0">No hay items registrados en la base de datos.</p>
      </div>
    );
  }

  return (
    <ul className="inventory-list">
      {productos.map((producto) => (
        <li
          key={producto.id}
          className="inventory-item d-flex justify-content-between align-items-center"
        >
          {/* Información del Producto */}
          <div className="d-flex flex-column">
            <strong className="item-name">{producto.nombre}</strong>
            <div className="mt-2 d-flex align-items-center flex-wrap gap-2">
              <small className="item-id">ID: #{producto.id}</small>

              {/* Badges estilo neón */}
              <span className="badge badge-gamer badge-category">
                {producto.categoria}
              </span>
            </div>
          </div>

          {/* Precio y Botón de eliminar */}
          <div className="d-flex align-items-center flex-column flex-md-row gap-3 text-end">
            <span className="badge badge-gamer badge-price">
              ${producto.precio}
            </span>

            <button
              className="btn btn-gamer-danger btn-sm px-3"
              onClick={() => onEliminar(producto.id)}
              aria-label={`Eliminar ${producto.nombre}`}
            >
              ELIMINAR
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductoList;

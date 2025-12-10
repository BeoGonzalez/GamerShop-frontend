import React from "react";

function ProductoList({ productos, onEliminar }) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No hay productos en el inventario.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-hover align-middle mb-0">
        <thead className="table-secondary">
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col" className="text-end">
              Precio
            </th>
            <th scope="col" className="text-center">
              Stock
            </th>
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>
                <div className="d-flex align-items-center">
                  {prod.imagen ? (
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="rounded me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span className="me-2 fs-4">🎮</span>
                  )}
                  <span className="fw-bold">{prod.nombre}</span>
                </div>
              </td>
              <td>
                {/* CORRECCIÓN: Accedemos a prod.categoria.nombre */}
                <span className="badge bg-secondary">
                  {prod.categoria ? prod.categoria.nombre : "General"}
                </span>
              </td>
              <td className="text-end text-warning fw-bold">
                ${prod.precio.toLocaleString()}
              </td>
              <td className="text-center">
                {prod.stock > 0 ? (
                  <span className="badge bg-success">{prod.stock} un.</span>
                ) : (
                  <span className="badge bg-danger">Agotado</span>
                )}
              </td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onEliminar(prod.id)}
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductoList;

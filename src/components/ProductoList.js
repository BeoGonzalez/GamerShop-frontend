import React from "react";

const ProductoList = ({ productos, onEliminar, onActualizarStock }) => {
  // Función segura para leer variantes sin explotar
  const getVariantes = (json) => {
    try {
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-0">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Variantes</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td className="text-success fw-bold">${p.precio}</td>
                <td style={{ width: "100px" }}>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    defaultValue={p.stock}
                    onBlur={(e) => onActualizarStock(p.id, e.target.value)}
                  />
                </td>
                <td>
                  {getVariantes(p.variantes).map((v, i) => (
                    <span key={i} className="badge bg-secondary me-1">
                      {v.color}
                    </span>
                  ))}
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-circle"
                    onClick={() => onEliminar(p.id)}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductoList;

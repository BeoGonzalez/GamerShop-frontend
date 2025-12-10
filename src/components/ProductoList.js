import React, { useState, useEffect } from "react";

// --- COMPONENTE INTERNO: STOCK EDITOR VERTICAL ---
const StockEditor = ({ producto, onGuardarCambio }) => {
  const [stockLocal, setStockLocal] = useState(producto.stock);
  const [haCambiado, setHaCambiado] = useState(false);

  useEffect(() => {
    setStockLocal(producto.stock);
    setHaCambiado(false);
  }, [producto.stock]);

  const handleRestar = () => {
    if (stockLocal > 0) {
      setStockLocal(stockLocal - 1);
      setHaCambiado(true);
    }
  };

  const handleSumar = () => {
    setStockLocal(stockLocal + 1);
    setHaCambiado(true);
  };

  const handleChangeInput = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setStockLocal(val);
      setHaCambiado(true);
    }
  };

  const handleSave = () => {
    onGuardarCambio(producto.id, stockLocal);
    setHaCambiado(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      {/* CÁPSULA VERTICAL */}
      <div className="stock-capsule">
        {/* BOTÓN ARRIBA (SUMAR) */}
        <button
          className="stock-btn-circle"
          onClick={handleSumar}
          title="Aumentar"
        >
          ▲
        </button>

        {/* INPUT EN MEDIO */}
        <input
          type="number"
          className="stock-input-clean"
          value={stockLocal}
          onChange={handleChangeInput}
        />

        {/* BOTÓN ABAJO (RESTAR) */}
        <button
          className="stock-btn-circle"
          onClick={handleRestar}
          disabled={stockLocal <= 0}
          title="Disminuir"
        >
          ▼
        </button>
      </div>

      {/* BOTÓN FLOTANTE DE GUARDAR */}
      {haCambiado && (
        <button
          className="btn btn-success btn-save-floating"
          onClick={handleSave}
          title="Guardar cambios"
        >
          💾
        </button>
      )}
    </div>
  );
};

// --- LISTA PRINCIPAL ---
function ProductoList({ productos, onEliminar, onActualizarStock }) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No hay productos en el inventario.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive mt-4 shadow rounded-4 overflow-hidden border border-secondary-subtle">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-body-tertiary text-secondary text-uppercase small">
          <tr>
            <th scope="col" className="ps-4">
              Producto
            </th>
            <th scope="col">Categoría</th>
            <th scope="col" className="text-end">
              Precio
            </th>
            <th scope="col" className="text-center">
              Inventario
            </th>
            <th scope="col" className="text-end pe-4">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td className="ps-4">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-3 overflow-hidden shadow-sm me-3"
                    style={{ width: "45px", height: "45px" }}
                  >
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain", // IMAGEN COMPLETA
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center fs-5">
                        🎮
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="fw-bold text-body d-block">
                      {prod.nombre}
                    </span>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      ID: {prod.id}
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge rounded-pill bg-body-secondary text-body border border-secondary-subtle">
                  {prod.categoria ? prod.categoria.nombre : "General"}
                </span>
              </td>
              <td className="text-end fw-bold text-success">
                ${prod.precio.toLocaleString()}
              </td>
              <td className="text-center">
                {/* Se conecta con el AdminPanel mediante 'onActualizarStock' */}
                <StockEditor
                  producto={prod}
                  onGuardarCambio={onActualizarStock}
                />
              </td>
              <td className="text-end pe-4">
                <button
                  className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                  onClick={() => onEliminar(prod.id)}
                  title="Eliminar producto"
                  style={{ width: "35px", height: "35px" }}
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

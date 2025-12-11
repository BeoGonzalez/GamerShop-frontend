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
    // 'position-relative' es vital aquí para que el botón flotante sepa dónde ubicarse
    <div className="position-relative d-inline-flex align-items-center justify-content-center">
      {/* CÁPSULA VERTICAL (CONTROLES) */}
      <div className="d-flex flex-column align-items-center">
        {/* BOTÓN ARRIBA */}
        <button
          className="btn border-0 bg-transparent p-0 d-flex align-items-center justify-content-center text-secondary"
          onClick={handleSumar}
          title="Aumentar"
          style={{ width: "24px", height: "24px" }}
        >
          <i className="bx bx-chevron-up fs-4"></i>
        </button>

        {/* INPUT */}
        <input
          type="number"
          className="form-control border-0 bg-transparent text-center p-0 m-0 fw-bold"
          style={{ width: "40px", boxShadow: "none" }}
          value={stockLocal}
          onChange={handleChangeInput}
        />

        {/* BOTÓN ABAJO */}
        <button
          className="btn border-0 bg-transparent p-0 d-flex align-items-center justify-content-center text-secondary"
          onClick={handleRestar}
          disabled={stockLocal <= 0}
          title="Disminuir"
          style={{ width: "24px", height: "24px" }}
        >
          <i className="bx bx-chevron-down fs-4"></i>
        </button>
      </div>

      {/* BOTÓN FLOTANTE DE GUARDAR (ABSOLUTO)
         - position-absolute: Lo saca del flujo normal (no empuja nada).
         - top-50 translate-middle-y: Lo centra verticalmente.
         - start-100: Lo mueve 100% a la derecha del contenedor.
         - ms-2: Un pequeño margen para separarlo.
      */}
      {haCambiado && (
        <button
          className="btn border-0 bg-transparent p-0 d-flex align-items-center justify-content-center text-success animate__animated animate__fadeIn position-absolute top-50 start-100 translate-middle-y ms-3"
          onClick={handleSave}
          title="Guardar cambios"
          style={{ width: "30px", height: "30px" }}
        >
          <i className="bx bx-save fs-3"></i>
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
        <i className="bx bx-package fs-1 mb-2"></i>
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
            {/* Damos un poco más de ancho a la columna Inventario para el botón flotante */}
            <th
              scope="col"
              className="text-center"
              style={{ minWidth: "120px" }}
            >
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
                    className="rounded-3 overflow-hidden shadow-sm me-3 d-flex align-items-center justify-content-center bg-white"
                    style={{ width: "45px", height: "45px" }}
                  >
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center text-secondary">
                        <i className="bx bx-joystick fs-4"></i>
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
                <StockEditor
                  producto={prod}
                  onGuardarCambio={onActualizarStock}
                />
              </td>
              <td className="text-end pe-4">
                {/* BOTÓN ELIMINAR - ROJO */}
                <button
                  className="btn border-0 bg-transparent p-0 d-inline-flex align-items-center justify-content-center text-danger"
                  onClick={() => onEliminar(prod.id)}
                  title="Eliminar producto"
                  style={{ width: "35px", height: "35px" }}
                >
                  <i className="bx bx-trash fs-4"></i>
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

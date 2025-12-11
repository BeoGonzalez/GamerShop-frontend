import React from "react";

const OrdersView = ({ ordenes }) => {
  return (
    <div className="card border-0 shadow-lg rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-transparent border-0 pt-4 ps-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">
          <i className="bx bx-receipt text-success me-2"></i>
          Boletas Emitidas
        </h4>
        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
          {ordenes.length} Transacciones
        </span>
      </div>

      <div className="card-body p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col"># Boleta</th>
                <th scope="col">Usuario (Cliente)</th>
                <th scope="col">Fecha Emisión</th>
                <th scope="col" className="text-center">
                  Items
                </th>
                <th scope="col" className="text-end">
                  Monto Total
                </th>
                <th scope="col" className="text-center">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  {/* ID DE BOLETA */}
                  <td className="fw-bold text-secondary">
                    #{String(orden.id).padStart(6, "0")}
                  </td>

                  {/* USUARIO */}
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-2">
                        <i className="bx bx-user"></i>
                      </div>
                      <span className="fw-bold text-dark">
                        {orden.username || "Desconocido"}
                      </span>
                    </div>
                  </td>

                  {/* FECHA (Viene formateada del Backend) */}
                  <td>
                    <i className="bx bx-calendar text-muted me-1"></i>
                    {orden.fecha}
                  </td>

                  {/* CANTIDAD ITEMS */}
                  <td className="text-center">
                    <span className="badge bg-secondary rounded-pill">
                      {orden.cantidadItems} prod.
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="text-end fw-bold text-success fs-6">
                    ${orden.total?.toLocaleString()}
                  </td>

                  {/* ESTADO (Simulado como Pagado) */}
                  <td className="text-center">
                    <span className="badge bg-success text-white">
                      <i className="bx bx-check-circle"></i> PAGADO
                    </span>
                  </td>
                </tr>
              ))}

              {ordenes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted">
                      <i className="bx bx-ghost fs-1 mb-3"></i>
                      <p className="mb-0">No se han registrado boletas aún.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;

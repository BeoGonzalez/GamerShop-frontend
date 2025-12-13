import React from "react";

const RecentOrders = ({ ordenes }) => {
  const ultimasOrdenes = [...ordenes].reverse().slice(0, 5);

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100 bg-body-tertiary">
      <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-body mb-0">
          <i className="bx bx-time-five text-primary"></i> Actividad Reciente
        </h5>
        <small className="text-muted">Últimas 5</small>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-body-secondary">
              <tr>
                <th className="ps-4 py-3 small text-muted text-uppercase">
                  ID
                </th>
                <th className="py-3 small text-muted text-uppercase">
                  Cliente
                </th>
                <th className="py-3 small text-muted text-uppercase">Total</th>
                <th className="pe-4 py-3 small text-muted text-uppercase text-end">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {ultimasOrdenes.length > 0 ? (
                ultimasOrdenes.map((ord, index) => (
                  <tr key={index}>
                    <td className="ps-4 fw-bold text-primary">#{ord.id}</td>
                    <td className="text-body">
                      <small className="fw-bold">
                        {ord.usuario?.username || "Anónimo"}
                      </small>
                    </td>
                    <td className="fw-bold text-success">
                      ${ord.total?.toLocaleString()}
                    </td>
                    <td className="pe-4 text-end">
                      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                        Listo
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Sin actividad.
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
export default RecentOrders;

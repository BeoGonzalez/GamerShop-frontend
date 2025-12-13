import React from "react";

const OrdersView = ({ ordenes }) => {
  return (
    <div className="card border-0 shadow-lg bg-body-tertiary rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-transparent border-0 pt-4 ps-4">
        <h5 className="fw-bold text-primary">
          <i className="bx bx-receipt"></i> Historial de Ventas
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-body-secondary">
              <tr>
                <th className="ps-4">ID</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Items</th>
                <th>Total</th>
                <th className="text-end pe-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((ord) => (
                <tr key={ord.id}>
                  <td className="ps-4 fw-bold">#{ord.id}</td>
                  <td className="text-muted small">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="text-body fw-bold">
                    {ord.usuario?.username || "Anónimo"}
                  </td>
                  <td>
                    <span className="badge bg-secondary rounded-pill">
                      {ord.items?.length || 0} Prod
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    ${ord.total?.toLocaleString()}
                  </td>
                  <td className="text-end pe-4">
                    <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default OrdersView;

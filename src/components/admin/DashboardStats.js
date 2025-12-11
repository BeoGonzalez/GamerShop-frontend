import React from "react";

const DashboardStats = ({ productos, ordenes, usuarios }) => {
  const totalVentas = ordenes.reduce((acc, ord) => acc + ord.totalPagado, 0);
  const stockBajo = productos.filter((p) => p.stock < 5).length;

  return (
    <div className="row g-4 animate__animated animate__fadeIn mb-4">
      {/* Widget Ventas */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100 rounded-4 bg-primary text-white">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <i className="bx bx-money fs-1 bg-white bg-opacity-25 p-2 rounded-circle"></i>
              <span className="badge bg-white text-primary">Total</span>
            </div>
            <h5 className="card-title opacity-75">Ingresos Totales</h5>
            <h2 className="fw-bold mb-0">${totalVentas.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Widget Usuarios */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100 rounded-4 bg-info text-white">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <i className="bx bx-group fs-1 bg-white bg-opacity-25 p-2 rounded-circle"></i>
              <span className="badge bg-white text-info">Usuarios</span>
            </div>
            <h5 className="card-title opacity-75">Clientes Registrados</h5>
            <h2 className="fw-bold mb-0">{usuarios.length}</h2>
          </div>
        </div>
      </div>

      {/* Widget Productos */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100 rounded-4 bg-success text-white">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <i className="bx bx-package fs-1 bg-white bg-opacity-25 p-2 rounded-circle"></i>
              <span className="badge bg-white text-success">Stock</span>
            </div>
            <h5 className="card-title opacity-75">Productos Activos</h5>
            <h2 className="fw-bold mb-0">{productos.length}</h2>
          </div>
        </div>
      </div>

      {/* Widget Alertas */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100 rounded-4 bg-warning text-dark">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <i className="bx bx-error fs-1 bg-white bg-opacity-25 p-2 rounded-circle"></i>
              <span className="badge bg-white text-warning">Atención</span>
            </div>
            <h5 className="card-title opacity-75">Stock Bajo</h5>
            <h2 className="fw-bold mb-0">{stockBajo}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

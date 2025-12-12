import React from "react";

const DashboardStats = ({ productos, ordenes, usuarios }) => {
  // Calculamos totales simples para mostrar
  const totalVentas = ordenes.reduce((acc, ord) => acc + (ord.total || 0), 0);

  return (
    <div className="row g-3 mb-4 animate__animated animate__fadeIn">
      <div className="col-12">
        {/* ESTE ES EL TÍTULO QUE BUSCA EL TEST */}
        <h4 className="fw-bold mb-3">Estadísticas Generales</h4>
      </div>

      {/* Tarjeta 1: Ventas */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm p-3 bg-primary text-white rounded-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 opacity-75">Ingresos Totales</p>
              <h3 className="fw-bold mb-0">${totalVentas.toLocaleString()}</h3>
            </div>
            <i className="bx bx-money fs-1 opacity-50"></i>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Usuarios */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm p-3 bg-white rounded-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 text-muted">Usuarios Registrados</p>
              <h3 className="fw-bold mb-0 text-dark">{usuarios.length}</h3>
            </div>
            <i className="bx bx-user fs-1 text-primary opacity-25"></i>
          </div>
        </div>
      </div>

      {/* Tarjeta 3: Productos */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm p-3 bg-white rounded-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 text-muted">Productos Activos</p>
              <h3 className="fw-bold mb-0 text-dark">{productos.length}</h3>
            </div>
            <i className="bx bx-cube fs-1 text-warning opacity-25"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

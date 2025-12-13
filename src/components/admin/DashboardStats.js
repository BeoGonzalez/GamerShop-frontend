import React from "react";

const DashboardStats = ({ productos, ordenes, usuarios }) => {
  // Cálculos
  const totalVentas = ordenes.reduce((acc, ord) => acc + (ord.total || 0), 0);
  const ticketPromedio = ordenes.length > 0 ? totalVentas / ordenes.length : 0;

  // Componente de Tarjeta Reutilizable
  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="col-12 col-sm-6 col-xl-3">
      <div
        className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden position-relative"
        style={{
          background: `linear-gradient(135deg, var(--bs-body-bg) 0%, var(--bs-body-tertiary-bg) 100%)`,
        }}
      >
        {/* Línea lateral de color */}
        <div
          className="position-absolute top-0 start-0 h-100"
          style={{ width: "4px", backgroundColor: color }}
        ></div>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <p className="text-muted small text-uppercase fw-bold mb-1">
                {title}
              </p>
              <h3 className="fw-bold text-body mb-0">{value}</h3>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              <i className={`bx ${icon} fs-3`}></i>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-success-subtle text-success rounded-pill me-2">
              <i className="bx bx-trending-up"></i> +Activo
            </span>
            <span className="small text-muted">{subtext}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-4 mb-4 animate__animated animate__fadeIn">
      <StatCard
        title="Ingresos Totales"
        value={`$${totalVentas.toLocaleString()}`}
        icon="bx-dollar-circle"
        color="#198754"
        subtext="Histórico"
      />
      <StatCard
        title="Ventas Totales"
        value={ordenes.length}
        icon="bx-shopping-bag"
        color="#0d6efd"
        subtext="Órdenes"
      />
      <StatCard
        title="Clientes"
        value={usuarios.length}
        icon="bx-group"
        color="#6f42c1"
        subtext="Registrados"
      />
      <StatCard
        title="Ticket Promedio"
        value={`$${ticketPromedio.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`}
        icon="bx-bar-chart-alt"
        color="#fd7e14"
        subtext="Por venta"
      />
    </div>
  );
};

export default DashboardStats;

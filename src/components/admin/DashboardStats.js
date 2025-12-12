import React from "react";

const DashboardStats = ({ productos, ordenes, usuarios }) => {
  // Calculamos totales
  const totalVentas = ordenes.reduce((acc, ord) => acc + (ord.total || 0), 0);

  return (
    <div className="row g-3 mb-4 animate__animated animate__fadeIn">
      <div className="col-12">
        {/* El texto se adapta al modo oscuro automáticamente */}
        <h4 className="fw-bold mb-3 text-body">Estadísticas Generales</h4>
      </div>

      {/* --- TARJETA 1: VENTAS (VERDE) --- */}
      <div className="col-md-4">
        {/* Usamos bg-success (Verde) y text-white para asegurar contraste */}
        <div className="card border-0 shadow-sm p-3 bg-success text-white rounded-4 h-100">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 opacity-75 fw-bold">Ingresos Totales</p>
              <h3 className="fw-bold mb-0">${totalVentas.toLocaleString()}</h3>
            </div>
            {/* Icono semitransparente */}
            <div
              className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bx bx-money fs-1 text-white"></i>
            </div>
          </div>
        </div>
      </div>

      {/* --- TARJETA 2: USUARIOS (AZUL O NEUTRO) --- */}
      <div className="col-md-4">
        {/* Usamos bg-primary (Azul) para variar, o puedes usar bg-body-tertiary */}
        <div className="card border-0 shadow-sm p-3 bg-primary text-white rounded-4 h-100">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 opacity-75 fw-bold">Usuarios Registrados</p>
              <h3 className="fw-bold mb-0">{usuarios.length}</h3>
            </div>
            <div
              className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bx bx-user fs-1 text-white"></i>
            </div>
          </div>
        </div>
      </div>

      {/* --- TARJETA 3: PRODUCTOS (AMARILLO) --- */}
      <div className="col-md-4">
        {/* Usamos bg-warning (Amarillo). 
            IMPORTANTE: Usamos text-dark porque el amarillo es claro y necesita texto negro para leerse. */}
        <div className="card border-0 shadow-sm p-3 bg-warning text-dark rounded-4 h-100">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 opacity-75 fw-bold text-dark">
                Productos Activos
              </p>
              <h3 className="fw-bold mb-0 text-dark">{productos.length}</h3>
            </div>
            <div
              className="bg-black bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bx bx-cube fs-1 text-dark"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

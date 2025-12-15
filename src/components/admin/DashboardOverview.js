import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardOverview = ({
  productos = [],
  ordenes = [],
  usuarios = [],
  darkMode, // Recibimos el estado del tema para adaptar el gráfico
  onRefresh,
}) => {
  // 1. CÁLCULOS DE ESTADÍSTICAS
  const totalVentas = ordenes.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalOrdenes = ordenes.length;

  // 2. DATOS PARA LA TABLA (Últimas 5, orden descendente)
  const actividadReciente = [...ordenes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // 3. DATOS PARA EL GRÁFICO (Recharts)
  // Tomamos las últimas 10 órdenes y las invertimos para que se vean cronológicas (Izq a Der)
  const dataGrafico = [...ordenes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10)
    .reverse()
    .map((orden) => ({
      name: `Ord #${orden.id}`,
      total: orden.total,
    }));

  // Colores dinámicos para el gráfico según el tema
  const chartTextColor = darkMode ? "#adb5bd" : "#6c757d"; // Texto ejes
  const chartGridColor = darkMode ? "#373b3e" : "#e9ecef"; // Líneas rejilla
  const tooltipBg = darkMode ? "#212529" : "#ffffff"; // Fondo tooltip
  const tooltipText = darkMode ? "#f8f9fa" : "#212529"; // Texto tooltip

  return (
    <div className="animate__animated animate__fadeIn">
      {/* --- TARJETAS DE RESUMEN (STATS) --- */}
      <div className="row g-4 mb-4">
        {/* Ventas */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0 opacity-75">Ventas Totales</h6>
                <i className="bx bx-dollar-circle fs-4"></i>
              </div>
              <h3 className="fw-bold mb-0">${totalVentas.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        {/* Pedidos */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0 text-body-secondary">Pedidos</h6>
                <i className="bx bx-shopping-bag fs-4 text-primary"></i>
              </div>
              <h3 className="fw-bold mb-0 text-body-emphasis">
                {totalOrdenes}
              </h3>
            </div>
          </div>
        </div>
        {/* Usuarios */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0 text-body-secondary">Usuarios</h6>
                <i className="bx bx-user fs-4 text-info"></i>
              </div>
              <h3 className="fw-bold mb-0 text-body-emphasis">
                {totalUsuarios}
              </h3>
            </div>
          </div>
        </div>
        {/* Productos */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0 text-body-secondary">Productos</h6>
                <i className="bx bx-cube fs-4 text-warning"></i>
              </div>
              <h3 className="fw-bold mb-0 text-body-emphasis">
                {totalProductos}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* --- GRÁFICO RECHARTS --- */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold text-body-emphasis mb-0">
                Rendimiento de Ventas
              </h5>
            </div>
            <div className="card-body px-4 pb-4" style={{ height: "300px" }}>
              {dataGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dataGrafico}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    {/* Definición del degradado azul */}
                    <defs>
                      <linearGradient
                        id="colorVentas"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0d6efd"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0d6efd"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGridColor}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke={chartTextColor}
                      tick={{ fill: chartTextColor, fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={chartTextColor}
                      tick={{ fill: chartTextColor, fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: chartGridColor,
                        color: tooltipText,
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: tooltipText }}
                      labelStyle={{ color: tooltipText, fontWeight: "bold" }}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Venta Total",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#0d6efd"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVentas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-body-secondary">
                  <p>Sin datos suficientes para graficar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- ESTADO DEL SISTEMA --- */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary h-100">
            <div className="card-body">
              <h5 className="fw-bold text-body-emphasis mb-4">
                Estado del Sistema
              </h5>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1">
                  <h6 className="mb-0 text-body">Servidor Backend</h6>
                  <small className="text-success fw-bold">● En Línea</small>
                </div>
                <i className="bx bx-server fs-3 text-body-secondary"></i>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1">
                  <h6 className="mb-0 text-body">Base de Datos</h6>
                  <small className="text-success fw-bold">● Conectado</small>
                </div>
                <i className="bx bx-data fs-3 text-body-secondary"></i>
              </div>
              <div className="alert alert-info border-0 rounded-3 mt-4 mb-0 bg-opacity-10 text-body-emphasis">
                <small>
                  <i className="bx bx-info-circle"></i> Recuerda revisar los
                  pedidos pendientes diariamente.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLA DE ACTIVIDAD RECIENTE --- */}
      <div className="card border-0 shadow-sm rounded-4 bg-body-tertiary mt-4">
        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-body-emphasis mb-0">
            Actividad Reciente
          </h5>
          <button
            className="btn btn-sm btn-outline-primary rounded-pill"
            onClick={onRefresh}
          >
            <i className="bx bx-refresh"></i> Actualizar
          </button>
        </div>

        <div className="card-body px-0 pt-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-body-secondary">
                <tr>
                  <th
                    className="ps-4 text-body-secondary"
                    style={{ width: "100px" }}
                  >
                    ID
                  </th>
                  <th className="text-body-secondary">Cliente</th>
                  <th className="text-body-secondary">Fecha</th>
                  <th className="text-body-secondary">Monto</th>
                  <th className="text-body-secondary">Estado</th>
                  <th className="text-end pe-4 text-body-secondary">Items</th>
                </tr>
              </thead>
              <tbody>
                {actividadReciente.length > 0 ? (
                  actividadReciente.map((orden) => (
                    <tr
                      key={orden.id}
                      className="border-bottom border-secondary-subtle"
                    >
                      <td className="ps-4 fw-bold text-body">#{orden.id}</td>

                      {/* NOMBRE DEL CLIENTE */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                            style={{ width: "35px", height: "35px" }}
                          >
                            {orden.username
                              ? orden.username.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <span className="fw-bold text-body">
                            {orden.username || "Usuario"}
                          </span>
                        </div>
                      </td>

                      <td className="text-body-secondary small">
                        {orden.fecha}
                      </td>
                      <td className="fw-bold text-success">
                        ${orden.total?.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            orden.estado === "PAGADO"
                              ? "bg-success-subtle text-success"
                              : orden.estado === "ENVIADO"
                              ? "bg-primary-subtle text-primary"
                              : "bg-warning-subtle text-warning"
                          }`}
                        >
                          {orden.estado}
                        </span>
                      </td>
                      <td className="text-end pe-4 text-body-secondary">
                        {orden.cantidadItems}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-5 text-body-secondary"
                    >
                      <i className="bx bx-notepad fs-1 mb-2"></i>
                      <p>No hay actividad reciente.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

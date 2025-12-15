import React from "react";
import DashboardStats from "./DashboardStats";
import RecentOrders from "./RecentOrders";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardOverview = ({ productos, ordenes, usuarios, darkMode }) => {
  // Colores dinámicos
  const axisColor = darkMode ? "#e9ecef" : "#495057";
  const gridColor = darkMode ? "#495057" : "#dee2e6";
  const tooltipBg = darkMode ? "#212529" : "#ffffff";
  const tooltipText = darkMode ? "#ffffff" : "#000000";

  const dataGrafico = ordenes.map((o, i) => ({
    name: `Venta ${i + 1}`,
    total: o.total,
  }));

  const adminName = localStorage.getItem("username") || "Admin";

  return (
    <div className="animate__animated animate__fadeIn">
      {/* Banner */}
      <div className="d-flex justify-content-between align-items-end mb-4 bg-primary bg-gradient text-white p-4 rounded-4 shadow-sm position-relative overflow-hidden">
        <div className="position-relative" style={{ zIndex: 1 }}>
          <h2 className="fw-bold mb-1">¡Hola, {adminName}! 👋</h2>
          <p className="mb-0 opacity-75">Resumen de actividad de GamerShop.</p>
        </div>
        <i
          className="bx bx-joystick position-absolute text-white opacity-25"
          style={{
            fontSize: "10rem",
            right: "-20px",
            bottom: "-30px",
            transform: "rotate(-20deg)",
          }}
        ></i>
      </div>

      <DashboardStats
        productos={productos}
        ordenes={ordenes}
        usuarios={usuarios}
      />

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <i className="bx bx-line-chart text-primary"></i> Rendimiento
              </h5>
            </div>
            <div className="card-body">
              {/* FIX: minWidth: 0 evita el error 'width(-1)' en flexbox/grids */}
              <div style={{ width: "100%", height: 300, minWidth: 0 }}>
                {dataGrafico.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataGrafico}>
                      <defs>
                        <linearGradient
                          id="colorTotal"
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
                        stroke={gridColor}
                        opacity={0.5}
                      />
                      <XAxis dataKey="name" hide stroke={axisColor} />
                      <YAxis hide stroke={axisColor} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: tooltipBg,
                          color: tooltipText,
                          borderRadius: "8px",
                          border: `1px solid ${gridColor}`,
                        }}
                        itemStyle={{ color: tooltipText }}
                        formatter={(val) => [`$${val}`, "Total"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#0d6efd"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    Sin datos de ventas aún
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <RecentOrders ordenes={ordenes} />
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;

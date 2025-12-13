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

const DashboardOverview = ({ productos, ordenes, usuarios }) => {
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
          <p className="mb-0 opacity-75">
            Resumen de actividad de tu tienda GamerShop.
          </p>
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
          <div className="card border-0 shadow-lg rounded-4 h-100 bg-body-tertiary">
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold text-body mb-0">
                <i className="bx bx-line-chart text-primary"></i> Rendimiento
              </h5>
            </div>
            <div className="card-body">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
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
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#212529",
                        color: "#fff",
                        borderRadius: "8px",
                        border: "none",
                      }}
                      itemStyle={{ color: "#fff" }}
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

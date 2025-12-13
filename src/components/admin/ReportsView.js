import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportsView = ({ productos, ordenes, categorias }) => {
  const dataPie = categorias
    .map((cat) => ({
      name: cat.nombre,
      value: productos.filter((p) => p.categoria?.id === cat.id).length,
    }))
    .filter((item) => item.value > 0);
  const COLORES_PIE = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const dataBar = [...productos]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => ({
      name: p.nombre.length > 10 ? p.nombre.substring(0, 10) + "..." : p.nombre,
      stock: p.stock,
    }));

  const dataLine = ordenes.map((o, index) => ({
    name: `Ord #${index + 1}`,
    monto: o.total,
  }));

  let acumulado = 0;
  const dataArea = ordenes.map((o, index) => {
    acumulado += o.total;
    return { name: `Venta ${index + 1}`, ingreso: acumulado };
  });

  const cardStyle =
    "card border-0 shadow-lg h-100 bg-body-tertiary rounded-4 overflow-hidden";
  const containerH = { width: "100%", height: 300 };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length)
      return (
        <div className="bg-dark text-white p-2 rounded shadow border border-secondary">
          <p className="mb-0 fw-bold">{label}</p>
          <p className="mb-0">{`${payload[0].name || ""}: ${
            payload[0].value
          }`}</p>
        </div>
      );
    return null;
  };

  return (
    <div className="container-fluid animate__animated animate__fadeIn">
      <h3 className="fw-bold mb-4 text-body">
        <i className="bx bx-pie-chart-alt-2"></i> Reportes de la Tienda
      </h3>
      <div className="row g-4">
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Por Categorías</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {dataPie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORES_PIE[index % COLORES_PIE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Top 5 Stock</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <BarChart data={dataBar}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      stroke="#8884d8"
                      style={{ fontSize: "0.8rem" }}
                    />
                    <YAxis stroke="#8884d8" />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar dataKey="stock" fill="#82ca9d" radius={[5, 5, 0, 0]}>
                      {dataBar.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Ventas Individuales</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <LineChart data={dataLine}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="#8884d8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="monto"
                      stroke="#ff7300"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={cardStyle}>
            <div className="card-header bg-transparent border-0 pt-4 text-center">
              <h5 className="fw-bold text-primary">Ingreso Acumulado</h5>
            </div>
            <div className="card-body">
              <div style={containerH}>
                <ResponsiveContainer>
                  <AreaChart data={dataArea}>
                    <defs>
                      <linearGradient
                        id="colorIngreso"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="#8884d8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ingreso"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorIngreso)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsView;
